import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || subtotal === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (coupon.minOrder !== null && subtotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Minimum order value of ₹${coupon.minOrder} required for this coupon` },
        { status: 400 }
      );
    }

    let discount = 0;
    let isFreeShipping = false;

    if (coupon.type === "PERCENT") {
      discount = subtotal * (coupon.value / 100);
      if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.type === "FIXED") {
      discount = coupon.value;
      if (discount > subtotal) {
        discount = subtotal;
      }
    } else if (coupon.type === "FREE_SHIPPING") {
      isFreeShipping = true;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
        isFreeShipping,
      },
    });
  } catch (error: any) {
    console.error("[Coupon API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
