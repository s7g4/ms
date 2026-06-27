import { Metadata } from "next";
import { MysteryBoxCard } from "@/components/home/MysteryBoxCard";
import { prisma } from "@/lib/db";
import { cacheQuery } from "@/lib/cache";

export const metadata: Metadata = { title: "Mystery Scoops" };

export const revalidate = 60; // Revalidate every minute

export default async function MysteryScoopsPage() {
  const boxes = await cacheQuery("store:mystery_boxes", 60, () =>
    prisma.mysteryBox.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    })
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest mb-3">Pick Your Box</p>
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
          Mystery <span className="gradient-text">Scoops</span> ✨
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
      <div className="mt-16 glass-card p-8 max-w-2xl mx-auto text-center">
        <div className="text-4xl mb-4">💎</div>
        <h3 className="text-xl font-bold mb-2 font-jakarta">Value Guarantee</h3>
        <p className="text-text-muted text-sm leading-relaxed">
          Every Mystery Scoop is guaranteed to contain products worth at least the stated MRP value.
          If your box falls short, we will make it right — no questions asked.
        </p>
      </div>
    </div>
  );
}
