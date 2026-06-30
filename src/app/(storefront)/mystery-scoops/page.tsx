import { Metadata } from "next";
import { MysteryBoxCard } from "@/components/home/MysteryBoxCard";
import { prisma } from "@/lib/db";
import { cacheQuery } from "@/lib/cache";
import { MysteryBox } from "@prisma/client";
import { Sparkles, Gem } from "lucide-react";

export const metadata: Metadata = { title: "Mystery Scoops" };

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute

export default async function MysteryScoopsPage() {
  let boxes: MysteryBox[] = [];
  try {
    boxes = await cacheQuery("store:mystery_boxes", 60, () =>
      prisma.mysteryBox.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      })
    );
  } catch (err) {
    console.error("[Database Build Warning] Failed to query mystery scoops:", err);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest mb-3">Pick Your Box</p>
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4 flex items-center justify-center gap-2">
          Mystery <span className="gradient-text">Scoops</span>
          <Sparkles className="w-6 h-6 text-accent-pink fill-accent-pink/15" />
        </h1>
        <p className="text-text-muted max-w-lg mx-auto">
          Every box is a curated adventure. Our algorithm picks rare, themed surprises — each worth more than you paid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {boxes.map((box) => (
          <MysteryBoxCard key={box.id} box={box} />
        ))}
      </div>

      {/* Value guarantee */}
      <div className="mt-16 glass-card p-8 max-w-2xl mx-auto text-center rounded-3xl">
        <Gem className="w-10 h-10 mx-auto text-accent-pink fill-accent-pink/10 mb-4" />
        <h3 className="text-xl font-bold mb-2 font-jakarta">Value Guarantee</h3>
        <p className="text-text-muted text-sm leading-relaxed">
          Every Mystery Scoop is guaranteed to contain products worth at least the stated MRP value.
          If your box falls short, we will make it right — no questions asked.
        </p>
      </div>
    </div>
  );
}
