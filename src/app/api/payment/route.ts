import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { getStripe } from "@/lib/payments/stripe";
import { generateBoxAllocation } from "@/lib/mystery-engine";
import { sendEmail } from "@/lib/email";
import { OrderConfirmation } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      provider, // "RAZORPAY" | "STRIPE"
      orderId,
      // Razorpay params
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      // Stripe params
      paymentIntentId,
    } = await req.json();

    if (!provider || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        items: {
          include: { mysteryBox: true },
        },
      },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, message: "Order is already paid" });
    }

    let isVerified = false;
    let transactionId = "";

    // 1. Verify Payment
    if (provider === "RAZORPAY") {
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return NextResponse.json({ error: "Missing Razorpay verification parameters" }, { status: 400 });
      }

      isVerified = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      transactionId = razorpayPaymentId;
    } else if (provider === "STRIPE") {
      if (!paymentIntentId) {
        return NextResponse.json({ error: "Missing Stripe payment intent ID" }, { status: 400 });
      }

      const stripe = getStripe();
      if (!stripe) {
        // Mock fallback for stripe testing without credentials
        if (paymentIntentId.startsWith("pi_mock_")) {
          isVerified = true;
          transactionId = paymentIntentId;
        } else {
          return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
        }
      } else {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === "succeeded") {
          isVerified = true;
          transactionId = paymentIntent.id;
        }
      }
    }

    if (!isVerified) {
      // Log payment failure
      await prisma.payment.updateMany({
        where: { orderId: order.id, status: "PENDING" },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Fulfill and Allocate Mystery Boxes in Transaction
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      });

      // Update payment record
      await tx.payment.updateMany({
        where: { orderId: order.id, provider, status: "PENDING" },
        data: {
          status: "PAID",
          providerPaymentId: transactionId,
        },
      });
    });

    // Run allocations for each item in the order
    const confirmedItemsForEmail = [];

    for (const item of order.items) {
      const allocationsList = [];
      for (let q = 0; q < item.quantity; q++) {
        // Allocate contents and reduce catalog stock
        const allocation = await generateBoxAllocation(item.mysteryBoxId, order.id);
        allocationsList.push(allocation.packingSlipData);
      }

      // Save allocations in OrderItem
      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          allocations: allocationsList,
        },
      });

      confirmedItemsForEmail.push({
        name: item.mysteryBox.name,
        quantity: item.quantity,
        price: Math.round(item.price * 100),
      });
    }

    // 3. Send confirmation email
    const addressRecord = order.address;
    const formattedAddress = `${addressRecord.name}, ${addressRecord.line1}, ${addressRecord.line2 ? addressRecord.line2 + ", " : ""}${addressRecord.city}, ${addressRecord.state} - ${addressRecord.pincode}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    sendEmail({
      to: session.user.email,
      subject: `Your MysteryScoop Order #${order.id} is Confirmed! 🎉`,
      react: OrderConfirmation({
        customerName: session.user.name,
        orderNumber: order.id,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        items: confirmedItemsForEmail,
        subtotal: Math.round(order.subtotal * 100),
        shipping: Math.round(order.shipping * 100),
        total: Math.round(order.total * 100),
        shippingAddress: formattedAddress,
        estimatedDelivery: estimatedDelivery.toLocaleDateString(),
      }),
    }).catch((err) => console.error("Failed to send order confirmation email:", err));

    // Award loyalty points: 1 point per rupee spent
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        loyaltyPoints: { increment: Math.floor(order.total) },
      },
    });

    // Check if referee needs point payout (first order completion)
    const referral = await prisma.referral.findFirst({
      where: { refereeId: session.user.id, status: "PENDING" },
    });

    if (referral) {
      await prisma.$transaction([
        prisma.referral.update({
          where: { id: referral.id },
          data: { status: "REWARDED" },
        }),
        // Add points to referrer
        prisma.user.update({
          where: { id: referral.referrerId },
          data: { loyaltyPoints: { increment: referral.reward } },
        }),
        prisma.rewardTransaction.create({
          data: {
            userId: referral.referrerId,
            points: referral.reward,
            type: "EARNED",
            description: `Referral bonus for inviting ${session.user.name}`,
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("[Payment Verification Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
