import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { generateBoxAllocation } from "@/lib/mystery-engine";
import { sendEmail } from "@/lib/email";
import { OrderConfirmation } from "@/lib/email/templates";
import { bookShipment } from "@/lib/shipping/shiprocket";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("[Razorpay Webhook Error]: Webhook secret is not configured");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // Verify webhook signature authenticity
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("[Razorpay Webhook Error]: Invalid signature verification attempt");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    // Handle order payment capture event
    if (event === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Find original database payment record
      const paymentRecord = await prisma.payment.findFirst({
        where: { providerOrderId: razorpayOrderId },
        include: {
          order: {
            include: {
              user: true,
              address: true,
              items: { include: { mysteryBox: true } },
            },
          },
        },
      });

      if (!paymentRecord) {
        console.warn(`[Razorpay Webhook]: No payment record found for order ID ${razorpayOrderId}`);
        return NextResponse.json({ error: "Associated transaction not found" }, { status: 400 });
      }

      // Idempotency: skip if already processed
      if (paymentRecord.status === "PAID" || paymentRecord.order.paymentStatus === "PAID") {
        return NextResponse.json({ success: true, message: "Transaction already processed" });
      }

      const order = paymentRecord.order;
      const total = order.total;
      const subtotal = order.subtotal;
      const shipping = order.shipping;

      // Wrap state updates in a secure database transaction
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: paymentRecord.id },
          data: { status: "PAID", providerPaymentId: razorpayPaymentId },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: "CONFIRMED", paymentStatus: "PAID" },
        }),
      ]);

      after(async () => {
        try {
          // Run inventory decrements and package allocations
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

          // Handle referral rewards payouts on first purchase completion
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

          // Dispatch order confirmation email
          const formattedAddress = `${addressRecord.name}, ${addressRecord.line1}, ${addressRecord.line2 ? addressRecord.line2 + ", " : ""}${addressRecord.city}, ${addressRecord.state} - ${addressRecord.pincode}`;
          const estimatedDelivery = new Date();
          estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

          await sendEmail({
            to: order.user.email,
            subject: `Your MysteryScoop Order #${order.id} is Confirmed! 🎉`,
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
          console.error("[Razorpay Webhook Background Error]:", bgErr);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Razorpay Webhook POST Handler Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
