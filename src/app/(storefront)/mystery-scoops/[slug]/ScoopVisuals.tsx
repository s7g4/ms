"use client";

import { useState } from "react";
import { Gift, Sparkles, Heart, Star } from "lucide-react";

interface ScoopVisualsProps {
  box: {
    name: string;
    images?: string[] | null;
    gradientFrom: string;
    gradientTo: string;
  };
}

export function ScoopVisuals({ box }: ScoopVisualsProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="relative aspect-square rounded-3xl overflow-hidden flex items-center justify-center glass-card"
      style={{
        background: `linear-gradient(135deg, ${box.gradientFrom}40, ${box.gradientTo}40)`,
      }}
    >
      <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />

      {box.images && box.images.length > 0 && !imageError ? (
        <img
          src={box.images[0]}
          alt={box.name}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <div
          className="floating relative z-10 flex items-center justify-center"
          style={{ filter: `drop-shadow(0 0 50px ${box.gradientFrom}80)` }}
        >
          <Gift size={120} style={{ color: box.gradientFrom }} className="opacity-90" />
        </div>
      )}

      <div className="absolute bottom-6 flex gap-2.5 z-20">
        {[
          { icon: Sparkles, color: "text-accent-purple fill-accent-purple/20", bg: "bg-purple-500/15 border-purple-500/30" },
          { icon: Heart, color: "text-accent-pink fill-accent-pink/40", bg: "bg-pink-500/15 border-pink-500/30" },
          { icon: Star, color: "text-accent-teal fill-accent-teal/20", bg: "bg-teal-500/15 border-teal-500/30" },
        ].map((item, i) => (
          <span
            key={i}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm backdrop-blur-md transition-all hover:scale-110 cursor-pointer ${item.bg}`}
          >
            <item.icon size={18} className={item.color} />
          </span>
        ))}
      </div>
    </div>
  );
}
