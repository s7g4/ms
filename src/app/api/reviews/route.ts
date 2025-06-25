import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mysteryBoxId = url.searchParams.get("mysteryBoxId");
    const productId = url.searchParams.get("productId");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const whereClause: any = {};
    if (mysteryBoxId) whereClause.mysteryBoxId = mysteryBoxId;
    if (productId) whereClause.productId = productId;

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.review.count({ where: whereClause });

    return NextResponse.json({ success: true, reviews, totalCount });
  } catch (error: any) {
    console.error("[Reviews GET API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mysteryBoxId, productId, orderId, rating, title, body, images } = await req.json();

    if (!rating || !orderId || (!mysteryBoxId && !productId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Check if the order exists, is paid/delivered, and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    // Verify user actually purchased the box/product in this order
    const hasItem = order.items.some((item) => {
      if (mysteryBoxId) return item.mysteryBoxId === mysteryBoxId;
      return false; // Extension if they reviewed individual product in future
    });

    if (!hasItem) {
      return NextResponse.json({ error: "You did not purchase this item in this order" }, { status: 400 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        mysteryBoxId: mysteryBoxId || null,
        productId: productId || null,
        orderId,
        rating,
        title,
        body,
        images: images || [],
        isVerified: true,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("[Reviews POST API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
