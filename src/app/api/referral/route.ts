import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code parameter is required" }, { status: 400 });
    }

    const referrer = await prisma.user.findUnique({
      where: { referralCode: code },
      select: {
        name: true,
      },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    return NextResponse.json({ success: true, referrerName: referrer.name });
  } catch (error: any) {
    console.error("[Referral API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
