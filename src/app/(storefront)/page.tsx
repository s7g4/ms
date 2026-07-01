import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedBoxes } from "@/components/home/FeaturedBoxes";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { prisma } from "@/lib/db";
import { MysteryBox } from "@prisma/client";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stack Your Scoops | Custom Curated Surprise Scoops ✨",
};

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let boxes: MysteryBox[] = [];
  try {
    const dbBoxes = await prisma.mysteryBox.findMany({
      where: { isActive: true },
    });

    boxes = dbBoxes
      .sort((a, b) => {
        if (a.slug === "mystery-scoop") return -1;
        if (b.slug === "mystery-scoop") return 1;
        return a.price - b.price; // default sort secondary boxes by price asc
      })
      .slice(0, 3);
  } catch (err) {
    console.error("[Database Build Warning] Failed to query mystery boxes on homepage:", err);
  }

  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedBoxes boxes={boxes} />
      <HowItWorks />
      <CategoryShowcase />
      <ReviewsCarousel />
      <PromoBanner />
    </>
  );
}
