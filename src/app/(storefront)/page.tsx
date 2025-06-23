import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedBoxes } from "@/components/home/FeaturedBoxes";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "MysteryScoop | Every Box, A New Adventure ✨",
};

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const boxes = await prisma.mysteryBox.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

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
