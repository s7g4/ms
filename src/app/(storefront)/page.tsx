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

export const metadata: Metadata = {
  title: "Stack Your Scoops | Custom Curated Surprise Scoops ✨",
};

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let boxes: MysteryBox[] = [];
  try {
    boxes = await prisma.mysteryBox.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { price: "asc" },
    });
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
