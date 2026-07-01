import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const role = searchParams.get("role");

  if (!email || !role) {
    return NextResponse.json({ error: "Missing email or role" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: role as any },
    });

    return NextResponse.json({ success: true, message: `Successfully promoted ${email} to ${role}!` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to promote user" }, { status: 500 });
  }
}
