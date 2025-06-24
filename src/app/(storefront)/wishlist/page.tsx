"use client";

import { useWishlist } from "@/store/wishlist";
import { MysteryBoxCard } from "@/components/home/MysteryBoxCard";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-12">
        <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest mb-3">
          Saved Magic
        </p>
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
          My <span className="gradient-text">Wishlist</span> ❤️
        </h1>
        <p className="text-text-muted max-w-md mx-auto">
          Your saved mystery scoops. Add them to your cart whenever you are ready to unbox the surprise!
        </p>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20 mb-4">
            <Heart className="w-8 h-8 text-accent-pink" />
          </div>
          <h3 className="text-xl font-bold mb-2">Wishlist is Empty</h3>
          <p className="text-text-muted text-sm mb-6">
            Browse our mystery collections and click the heart icon on any box to save it here.
          </p>
          <Link href="/mystery-scoops" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">
            Shop Mystery Scoops ✨
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((box) => (
            // Adapt WishlistItem type to MysteryBox Card expected fields
            <MysteryBoxCard
              key={box.id}
              box={{
                id: box.id,
                slug: box.slug,
                name: box.name,
                price: box.price,
                mrpValue: box.mrpValue,
                gradientFrom: box.gradientFrom,
                gradientTo: box.gradientTo,
                minItems: 3, // Fallback card defaults
                maxItems: 5,
                tagline: "Saved Scoop",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
