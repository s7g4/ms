"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PenTool, Smile, Zap, Sparkles, Palette, Flower2, Gamepad2 } from "lucide-react";

const CATEGORIES = [
  { icon: PenTool, name: "Stationery", slug: "stationery", color: "#00d4aa" },
  { icon: Smile, name: "Plushies", slug: "plushies", color: "#ff6eb4" },
  { icon: Zap, name: "Anime", slug: "anime", color: "#b06cf0" },
  { icon: Sparkles, name: "Kawaii", slug: "kawaii", color: "#ffd166" },
  { icon: Palette, name: "DIY", slug: "diy", color: "#00b4d8" },
  { icon: Flower2, name: "Beauty", slug: "beauty", color: "#f472b6" },
  { icon: Gamepad2, name: "Toys", slug: "toys", color: "#a78bfa" },
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
          {CATEGORIES.map(({ icon: Icon, name, slug, color }, i) => (
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
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all duration-300 font-medium text-sm"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  color: color,
                }}
              >
                <Icon size={16} />
                {name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
