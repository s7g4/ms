import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { WelcomeEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const { name, email, password, referralCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check referrer if referralCode is provided
    let referrerId: string | null = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Create user and credentials account in transaction
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          referredBy: referrerId,
        },
      });

      await tx.account.create({
        data: {
          userId: createdUser.id,
          providerId: "credential",
          accountId: email,
          password: hashedPassword,
        },
      });

      return createdUser;
    });

    // If referred, create a pending referral record
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          refereeId: user.id,
          status: "PENDING",
          reward: 500, // 500 points reward
        },
      });
    }

    // Send welcome email (non-blocking)
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/register?ref=${user.referralCode}`;
    sendEmail({
      to: email,
      subject: "Welcome to MysteryScoop! 🌟",
      react: WelcomeEmail({
        name,
        email,
        referralCode: user.referralCode,
        referralLink,
      }),
    }).catch((err) => console.error("Failed to send welcome email:", err));

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error("[Register API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
