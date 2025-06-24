import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "box"; // "box" or "product"
    const categorySlug = url.searchParams.get("category");
    const rarity = url.searchParams.get("rarity");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    if (type === "box") {
      const boxes = await prisma.mysteryBox.findMany({
        where: { isActive: true },
        include: {
          categories: {
            include: { category: true },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { price: "asc" },
      });
      return NextResponse.json({ success: true, data: boxes });
    } else {
      const whereClause: any = { isActive: true };
      if (categorySlug) {
        whereClause.category = { slug: categorySlug };
      }
      if (rarity) {
        whereClause.rarity = rarity;
      }
      const products = await prisma.product.findMany({
        where: whereClause,
        include: { category: true },
        take: limit,
        skip: offset,
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ success: true, data: products });
    }
  } catch (error: any) {
    console.error("[Products API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
