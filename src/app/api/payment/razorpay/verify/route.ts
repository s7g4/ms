import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/db";
import { generateBoxAllocation } from "@/lib/mystery-engine";
import { after } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await req.json();

    const valid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Look up the database payment record linked to this Razorpay order
    const paymentRecord = await prisma.payment.findFirst({
      where: { providerOrderId: razorpay_order_id },
    });

    if (!paymentRecord) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 400 });
    }

    if (paymentRecord.orderId !== orderId) {
      return NextResponse.json({ error: "Payment mismatch with Order ID" }, { status: 400 });
    }

    // Update payment record inside a transaction for atomic safety
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { status: "PAID", providerPaymentId: razorpay_payment_id },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED", paymentStatus: "PAID" },
      }),
    ]);

    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { items: true },
    });



    after(async () => {
      try {
        // Generate box allocations asynchronously in background
        for (const item of order.items) {
          const allocation = await generateBoxAllocation(item.mysteryBoxId, orderId);
          await prisma.orderItem.update({
            where: { id: item.id },
            data: { allocations: allocation as unknown as import("@prisma/client").Prisma.InputJsonValue },
          });
        }
      } catch (err) {
        console.error("[Background Allocation Error]:", err);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
