import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/db";
import { generateBoxAllocation } from "@/lib/mystery-engine";

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

    // Update payment record
    await prisma.payment.updateMany({
      where: { providerOrderId: razorpay_order_id },
      data: { status: "PAID", providerPaymentId: razorpay_payment_id },
    });

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED", paymentStatus: "PAID" },
      include: { items: true },
    });

    // Generate box allocations
    for (const item of order.items) {
      const allocation = await generateBoxAllocation(item.mysteryBoxId, orderId);
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { allocations: allocation as unknown as import("@prisma/client").Prisma.InputJsonValue },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
