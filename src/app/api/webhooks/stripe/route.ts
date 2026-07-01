import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/payments/stripe";
import { generateBoxAllocation } from "@/lib/mystery-engine";
import { sendEmail } from "@/lib/email";
import { OrderConfirmation } from "@/lib/email/templates";
import { bookShipment } from "@/lib/shipping/shiprocket";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const signature = req.headers.get("stripe-signature");

    if (!stripe) {
      console.error("[Stripe Webhook Error]: Stripe client is not configured");
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[Stripe Webhook Error]: Webhook secret is not configured");
      return NextResponse.json({ error: "Stripe webhook secret missing" }, { status: 500 });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err: any) {
      console.warn("[Stripe Webhook Error]: Invalid signature verification attempt:", err.message);
      return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    // Handle payment intent success event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      const transactionId = paymentIntent.id;

      if (!orderId) {
        console.warn("[Stripe Webhook]: No orderId metadata in payment intent");
        return NextResponse.json({ success: true, message: "No order metadata associated with transaction" });
      }

      // Fetch order details
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          address: true,
          items: { include: { mysteryBox: true } },
        },
      });

      if (!order) {
        console.warn(`[Stripe Webhook]: No order record found for ID ${orderId}`);
        return NextResponse.json({ error: "Associated order not found" }, { status: 400 });
      }

      // Idempotency: skip if already processed
      if (order.paymentStatus === "PAID") {
        return NextResponse.json({ success: true, message: "Order already paid" });
      }

      const total = order.total;
      const subtotal = order.subtotal;
      const shipping = order.shipping;

      // Update order and payment record atomically inside database transaction
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CONFIRMED", paymentStatus: "PAID" },
        });

        await tx.payment.updateMany({
          where: { orderId: order.id, provider: "STRIPE", status: "PENDING" },
          data: { status: "PAID", providerPaymentId: transactionId },
        });
      });

      after(async () => {
        try {
          // Run allocations and inventory updates
          const confirmedItemsForEmail = [];
          for (const item of order.items) {
            const allocationsList = [];
            for (let q = 0; q < item.quantity; q++) {
              const allocation = await generateBoxAllocation(item.mysteryBoxId, order.id);
              allocationsList.push(allocation.packingSlipData);
            }

            await prisma.orderItem.update({
              where: { id: item.id },
              data: { allocations: allocationsList },
            });

            confirmedItemsForEmail.push({
              name: item.mysteryBox.name,
              quantity: item.quantity,
              price: Math.round(item.price * 100),
            });
          }

          // Credit loyalty points to purchaser
          await prisma.user.update({
            where: { id: order.userId },
            data: { loyaltyPoints: { increment: Math.floor(total) } },
          });

          // Payout referral rewards on first purchase completion
          const referral = await prisma.referral.findFirst({
            where: { refereeId: order.userId, status: "PENDING" },
          });

          if (referral) {
            await prisma.$transaction([
              prisma.referral.update({
                where: { id: referral.id },
                data: { status: "REWARDED" },
              }),
              prisma.user.update({
                where: { id: referral.referrerId },
                data: { loyaltyPoints: { increment: referral.reward } },
              }),
              prisma.rewardTransaction.create({
                data: {
                  userId: referral.referrerId,
                  points: referral.reward,
                  type: "EARNED",
                  description: `Referral bonus for inviting ${order.user.name}`,
                  orderId: order.id,
                },
              }),
            ]);
          }

          // Book shipment on Shiprocket asynchronously
          const addressRecord = order.address;
          const shippingResult = await bookShipment({
            orderId: order.id,
            orderDate: new Date(order.createdAt).toISOString().split("T")[0],
            customerName: order.user.name,
            customerEmail: order.user.email,
            customerPhone: addressRecord.phone,
            addressLine1: addressRecord.line1,
            addressLine2: addressRecord.line2 || "",
            city: addressRecord.city,
            state: addressRecord.state,
            pincode: addressRecord.pincode,
            items: order.items.map((item) => ({
              name: item.mysteryBox.name,
              sku: item.mysteryBox.slug,
              units: item.quantity,
              selling_price: item.price,
            })),
            totalValue: order.total,
          });

          let trackingNumber = "";
          let trackingUrl = "";
          if (shippingResult.success && shippingResult.awbNumber) {
            trackingNumber = shippingResult.awbNumber;
            trackingUrl = shippingResult.trackingUrl || "";
            await prisma.order.update({
              where: { id: order.id },
              data: {
                trackingNumber,
                trackingUrl,
                status: "SHIPPED",
              },
            });
          }

          // Send confirmation email
          const formattedAddress = `${addressRecord.name}, ${addressRecord.line1}, ${addressRecord.line2 ? addressRecord.line2 + ", " : ""}${addressRecord.city}, ${addressRecord.state} - ${addressRecord.pincode}`;
          const estimatedDelivery = new Date();
          estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

          await sendEmail({
            to: order.user.email,
            subject: `Your Stack Your Scoops Order #${order.id} is Confirmed! 🎉`,
            react: OrderConfirmation({
              customerName: order.user.name,
              orderNumber: order.id,
              orderDate: new Date(order.createdAt).toLocaleDateString(),
              items: confirmedItemsForEmail,
              subtotal: Math.round(subtotal * 100),
              shipping: Math.round(shipping * 100),
              total: Math.round(total * 100),
              shippingAddress: formattedAddress,
              estimatedDelivery: estimatedDelivery.toLocaleDateString(),
              trackingUrl: trackingUrl || undefined,
            }),
          }).catch((err) => console.error("Failed to send webhook confirmation email:", err));
        } catch (bgErr) {
          console.error("[Stripe Webhook Background Error]:", bgErr);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Stripe Webhook POST Handler Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
