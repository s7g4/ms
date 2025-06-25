import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, body, orderId, priority = "MEDIUM" } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
    }

    // Optional order validation
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order || order.userId !== session.user.id) {
        return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
      }
    }

    // Create ticket and first message in a transaction
    const ticket = await prisma.$transaction(async (tx) => {
      const newTicket = await tx.supportTicket.create({
        data: {
          userId: session.user.id,
          orderId: orderId || null,
          subject,
          priority: priority as any,
          status: "OPEN",
        },
      });

      await tx.ticketMessage.create({
        data: {
          ticketId: newTicket.id,
          userId: session.user.id,
          body,
          isAdmin: false,
        },
      });

      return newTicket;
    });

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error: any) {
    console.error("[Feedback/Tickets API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
