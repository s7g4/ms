import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, referralCode } = await req.json();

    if (!email || !referralCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the referee user (the newly registered account)
    const referee = await prisma.user.findUnique({
      where: { email },
    });

    if (!referee) {
      return NextResponse.json({ error: "Referee user not found" }, { status: 404 });
    }

    // Find the referrer by code
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
    }

    // Link the referee to the referrer in User table
    await prisma.user.update({
      where: { id: referee.id },
      data: {
        referredBy: referrer.id,
      },
    });

    // Create a pending referral transaction
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId: referee.id,
        status: "PENDING",
        reward: 500, // 500 points reward
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Referral Link Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
