"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Sparkles, Package, Star } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: ShoppingCart,
    title: "Choose Your Scoop",
    desc: "Pick from our mystery box tiers — Starter, Classic, or Premium.",
    color: "#00d4aa",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "We Curate Surprises",
    desc: "Our algorithm picks rare, curated products just for you.",
    color: "#b06cf0",
  },
  {
    step: "03",
    icon: Package,
    title: "It Ships Fast",
    desc: "Your mystery box is packed and shipped within 24-48 hours.",
    color: "#ff6eb4",
  },
  {
    step: "04",
    icon: Star,
    title: "You Unbox Joy",
    desc: "Open your box, earn loyalty points, and share the magic!",
    color: "#ffd166",
  },
];

export function HowItWorks() {
  return (
    <section className="section" style={{ background: "rgba(176,108,240,0.04)" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-accent-teal text-sm font-semibold uppercase tracking-widest mb-3">Simple & Magical</p>
          <h2 className="text-4xl md:text-5xl font-bold font-jakarta">
            How It <span className="gradient-text">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-accent-teal via-accent-purple to-accent-yellow opacity-30" />

          {STEPS.map(({ step, icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center p-6 rounded-2xl glass-card"
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center relative"
                style={{ background: `${color}20`, border: `1px solid ${color}30` }}
              >
                <Icon size={24} style={{ color }} />
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold text-black flex items-center justify-center"
                  style={{ background: color }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 font-jakarta">{title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
