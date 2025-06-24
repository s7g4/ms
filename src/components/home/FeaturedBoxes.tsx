"use client";

import { motion } from "framer-motion";
import { MysteryBoxCard } from "./MysteryBoxCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Box {
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

export function FeaturedBoxes({ boxes }: { boxes: Box[] }) {
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest mb-3">Choose Your Adventure</p>
          <h2 className="text-4xl md:text-5xl font-bold font-jakarta">
            Mystery <span className="gradient-text">Scoops</span> ✨
          </h2>
          <p className="text-text-muted mt-4 max-w-xl mx-auto">
            Three tiers of magic — each box packed with curated surprises worth way more than you paid.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boxes.map((box, i) => (
            <motion.div
              key={box.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <MysteryBoxCard box={box} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/mystery-scoops" className="inline-flex items-center gap-2 text-accent-purple hover:text-accent-pink transition-colors font-semibold group">
            View all mystery scoops
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
