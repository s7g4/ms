"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CATEGORIES = [
  { emoji: "✏️", name: "Stationery", slug: "stationery", color: "#00d4aa" },
  { emoji: "🧸", name: "Plushies", slug: "plushies", color: "#ff6eb4" },
  { emoji: "⚔️", name: "Anime", slug: "anime", color: "#b06cf0" },
  { emoji: "🌸", name: "Kawaii", slug: "kawaii", color: "#ffd166" },
  { emoji: "🎨", name: "DIY", slug: "diy", color: "#00b4d8" },
  { emoji: "💄", name: "Beauty", slug: "beauty", color: "#f472b6" },
  { emoji: "🎮", name: "Toys", slug: "toys", color: "#a78bfa" },
];

export function CategoryShowcase() {
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-accent-pink text-sm font-semibold uppercase tracking-widest mb-3">What's Inside?</p>
          <h2 className="text-4xl md:text-5xl font-bold font-jakarta">
            Categories <span className="gradient-text">We Curate</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map(({ emoji, name, slug, color }, i) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Link
                href={`/collections?category=${slug}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 font-medium text-sm"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  color: color,
                }}
              >
                <span className="text-xl">{emoji}</span>
                {name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
