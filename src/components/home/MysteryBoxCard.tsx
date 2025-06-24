"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface MysteryBox {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  price: number;
  mrpValue: number;
  minItems: number;
  maxItems: number;
  gradientFrom: string;
  gradientTo: string;
  theme?: string | null;
}

export function MysteryBoxCard({ box }: { box: MysteryBox }) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(box.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: box.id,
      slug: box.slug,
      name: box.name,
      price: box.price,
      mrpValue: box.mrpValue,
      gradientFrom: box.gradientFrom,
      gradientTo: box.gradientTo,
      theme: box.theme ?? undefined,
      minItems: box.minItems,
      maxItems: box.maxItems,
    });
    toast.success(`🎁 ${box.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      id: box.id,
      slug: box.slug,
      name: box.name,
      price: box.price,
      mrpValue: box.mrpValue,
      gradientFrom: box.gradientFrom,
      gradientTo: box.gradientTo,
    });
    toast.success(wishlisted ? "Removed from wishlist" : "❤️ Added to wishlist!");
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "rgba(176,108,240,0.06)",
        border: "1px solid rgba(176,108,240,0.15)",
        transition: "all 0.3s ease",
      }}
    >
      <Link href={`/mystery-scoops/${box.slug}`} className="block">
        {/* Box Art */}
        <div
          className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${box.gradientFrom}33, ${box.gradientTo}33)` }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(circle at 50% 50%, ${box.gradientFrom}, transparent 70%)` }}
          />
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 text-7xl"
            style={{ filter: `drop-shadow(0 0 30px ${box.gradientFrom}80)` }}
          >
            🎁
          </motion.div>

          {/* Worth badge */}
          <div
            className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: `linear-gradient(135deg, ${box.gradientFrom}, ${box.gradientTo})` }}
          >
            Worth {formatPrice(box.mrpValue)}+
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full glass transition-all hover:scale-110"
          >
            <Heart
              size={16}
              className={wishlisted ? "fill-accent-pink text-accent-pink" : "text-white/60"}
            />
          </button>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-text-primary font-jakarta leading-tight">{box.name}</h3>
              {box.tagline && <p className="text-text-muted text-xs mt-0.5">{box.tagline}</p>}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text font-grotesk">{formatPrice(box.price)}</p>
            </div>
          </div>

          <p className="text-xs text-text-muted mb-4">
            🎲 {box.minItems}–{box.maxItems} surprise items inside
            {box.theme && ` · ${box.theme}`}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${box.gradientFrom}, ${box.gradientTo})` }}
          >
            ✨ Add to Cart
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
