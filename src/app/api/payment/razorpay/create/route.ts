import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const rzOrder = await createRazorpayOrder(order.total, orderId);

    await prisma.payment.create({
      data: {
        orderId,
        provider: "RAZORPAY",
        providerOrderId: rzOrder.id,
        amount: order.total,
        currency: "INR",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      orderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: rzOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
