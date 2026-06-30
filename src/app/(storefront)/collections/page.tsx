import { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  PenTool,
  Smile,
  Zap,
  Sparkles,
  Palette,
  Flower2,
  Gamepad2,
  Gift,
  Inbox,
  Dices,
  HelpCircle,
  Package,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  stationery: PenTool,
  plushies: Smile,
  anime: Zap,
  kawaii: Sparkles,
  diy: Palette,
  beauty: Flower2,
  toys: Gamepad2,
};

function getCategoryIcon(slug: string) {
  return CATEGORY_ICONS[slug] || HelpCircle;
}

export const metadata: Metadata = {
  title: "Collections | Stack Your Scoops",
};

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function CollectionsPage(props: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams?.category || "all";

  // Fetch all categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch products under the active category
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(activeCategory !== "all"
        ? {
            category: {
              slug: activeCategory,
            },
          }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
  });

  // Helper for rarity badge style
  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case "ULTRA_RARE":
        return "bg-[oklch(0.85_0.15_85)] text-yellow-900 border-yellow-300";
      case "RARE":
        return "bg-[oklch(0.88_0.12_330)] text-pink-900 border-pink-300";
      case "UNCOMMON":
        return "bg-[oklch(0.88_0.1_260)] text-purple-900 border-purple-300";
      default:
        return "bg-[oklch(0.92_0.05_140)] text-emerald-950 border-emerald-200";
    }
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.replace("_", " ");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-accent-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Our Curation Pool
        </p>
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4 flex items-center justify-center gap-2">
          Unboxing <span className="gradient-text">Collections</span>
          <Sparkles className="w-6 h-6 text-accent-pink fill-accent-pink/15" />
        </h1>
        <p className="text-text-muted max-w-lg mx-auto">
          Take a look at the gorgeous kawaii, stationery, and beauty items in our inventory pools that get randomly stacked inside your scoops!
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
        <Link
          href="/collections"
          className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
            activeCategory === "all"
              ? "bg-accent-teal border-accent-teal text-text-primary shadow-lg shadow-teal-900/10"
              : "glass border-border text-text-muted hover:text-text-primary hover:border-border-hover"
          }`}
        >
          <Sparkles size={14} />
          <span>All Items</span>
        </Link>
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/collections?category=${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
                activeCategory === cat.slug
                  ? "bg-accent-teal border-accent-teal text-text-primary shadow-lg shadow-teal-900/10"
                  : "glass border-border text-text-muted hover:text-text-primary hover:border-border-hover"
              }`}
            >
              <Icon size={14} />
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl max-w-md mx-auto">
          <Inbox className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No Items Found</h3>
          <p className="text-text-muted text-sm mb-6">
            We don&apos;t have any active catalog items in this collection right now. Check back soon!
          </p>
          <Link href="/collections" className="btn-primary px-6 py-2.5 rounded-xl text-sm">
            Browse All Items
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.map((prod) => {
            const Icon = getCategoryIcon(prod.category.slug);
            return (
              <div
                key={prod.id}
                className="group relative rounded-2xl overflow-hidden bg-bg-card/45 border border-border/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Product Visual Area */}
                <div
                  className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, var(--bg-card) 30%, var(--accent-pink) 15%)`,
                  }}
                >
                  {/* Category icon as background decor */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-text-primary pointer-events-none select-none">
                    <Icon size={140} />
                  </div>

                  {/* Main themed packaging visual */}
                  <div className="text-text-primary/70 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={48} />
                  </div>

                  {/* Rarity tag */}
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${getRarityStyle(
                      prod.rarity
                    )}`}
                  >
                    {getRarityLabel(prod.rarity)}
                  </span>
                </div>

                {/* Info Area */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon size={12} className="text-accent-pink" />
                      <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
                        {prod.category.name}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-text-primary leading-snug mb-2 font-jakarta">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div>
                      <span className="text-xs text-text-muted line-through block leading-none mb-0.5">
                        {formatPrice(prod.mrp)}
                      </span>
                      <span className="text-sm font-bold text-text-primary font-grotesk">
                        {formatPrice(prod.price)}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-bg-primary text-accent-pink border border-accent-pink/20 flex items-center gap-1">
                      <Dices size={10} />
                      <span>Curation Pool</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA Box */}
      <div className="mt-16 glass-card p-8 max-w-2xl mx-auto text-center rounded-3xl">
        <Package className="w-12 h-12 mx-auto text-accent-pink mb-4" />
        <h3 className="text-xl font-bold mb-2 font-jakarta">Want these items?</h3>
        <p className="text-text-muted text-sm leading-relaxed mb-6">
          Order a Mystery Scoop today and pick the theme that includes these. Our packing algorithm curates a magical selection of items worth more than you pay!
        </p>
        <Link href="/mystery-scoops" className="btn-primary px-8 py-3 rounded-xl font-semibold shadow-lg shadow-pink-900/10 inline-flex items-center gap-2">
          <Gift size={16} />
          <span>Shop Mystery Scoops</span>
        </Link>
      </div>
    </div>
  );
}
