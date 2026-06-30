"use client";

import { useState } from "react";

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
          className="text-[150px] floating relative z-10"
          style={{ filter: `drop-shadow(0 0 50px ${box.gradientFrom}80)` }}
        >
          🎁
        </div>
      )}

      <div className="absolute bottom-6 flex gap-2 z-20">
        {["✨", "🌸", "⭐"].map((e, i) => (
          <span
            key={i}
            className="w-12 h-12 rounded-xl glass flex items-center justify-center text-xl shadow-sm"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
