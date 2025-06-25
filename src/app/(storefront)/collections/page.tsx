import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { MysteryBoxCard } from "@/components/home/MysteryBoxCard";
import Link from "next/link";

export const metadata: Metadata = { title: "Collections | MysteryScoop" };

export const revalidate = 60; // Revalidate every minute

export default async function CollectionsPage(props: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams?.category || "all";

  // Fetch all categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch boxes with categories included
  const boxes = await prisma.mysteryBox.findMany({
    where: {
      isActive: true,
      ...(activeCategory !== "all"
        ? {
            categories: {
              some: {
                category: {
                  slug: activeCategory,
                },
              },
            },
          }
        : {}),
    },
    include: {
      categories: {
        include: { category: true },
      },
    },
    orderBy: { price: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest mb-3">
          Explore Themes
        </p>
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
          Mystery Box <span className="gradient-text">Collections</span> 🎁
        </h1>
        <p className="text-text-muted max-w-lg mx-auto">
          Filter by your favorite categories to discover curated unboxing items tailored to your
          tastes.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
        <Link
          href="/collections"
          className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
            activeCategory === "all"
              ? "bg-accent-purple border-accent-purple text-white shadow-lg shadow-purple-900/30"
              : "glass border-purple-500/20 text-text-muted hover:text-text-primary hover:border-purple-500/40"
          }`}
        >
          ✨ All Mixes
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/collections?category=${cat.slug}`}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
              activeCategory === cat.slug
                ? "bg-accent-purple border-accent-purple text-white shadow-lg shadow-purple-900/30"
                : "glass border-purple-500/20 text-text-muted hover:text-text-primary hover:border-purple-500/40"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Box Grid */}
      {boxes.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl max-w-md mx-auto">
          <p className="text-4xl mb-4">🔮</p>
          <h3 className="text-lg font-bold mb-2">No Boxes Found</h3>
          <p className="text-text-muted text-sm mb-6">
            We don&apos;t have any active mystery scoops under this category right now. Check back
            soon!
          </p>
          <Link href="/collections" className="btn-primary px-6 py-2.5 rounded-xl text-sm">
            Browse All Mixes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {boxes.map((box) => (
            <MysteryBoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
    </div>
  );
}
