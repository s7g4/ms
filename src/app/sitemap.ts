import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mysteryscoop.com";

  // Fetch active mystery boxes
  let boxes: { slug: string; updatedAt: Date }[] = [];
  try {
    boxes = await prisma.mysteryBox.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (err) {
    console.error("[Database Build Warning] Failed to query mystery boxes for sitemap:", err);
  }

  const boxUrls = boxes.map((box) => ({
    url: `${baseUrl}/mystery-scoops/${box.slug}`,
    lastModified: box.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Static core routes
  const staticUrls = ["", "/mystery-scoops", "/faq", "/contact", "/wishlist"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticUrls, ...boxUrls];
}
