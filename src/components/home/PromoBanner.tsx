"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(176,108,240,0.3) 0%, rgba(255,110,180,0.2) 50%, rgba(0,212,170,0.2) 100%)",
            border: "1px solid rgba(176,108,240,0.3)",
          }}
        >
          {/* Glow orbs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #b06cf0, transparent)" }} />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #ff6eb4, transparent)" }} />

          <div className="relative z-10">
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🎁
            </motion.p>
            <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest mb-3">Limited Time Offer</p>
            <h2 className="text-3xl md:text-5xl font-bold font-jakarta mb-4">
              First Order? <span className="gradient-text">Save 10%!</span>
            </h2>
            <p className="text-text-muted text-lg mb-2">
              Use code <span className="font-mono font-bold text-accent-yellow text-xl px-3 py-1 rounded-lg" style={{ background: "rgba(255,209,102,0.1)", border: "1px solid rgba(255,209,102,0.3)" }}>FIRST10</span>
            </p>
            <p className="text-text-muted text-sm mb-8">Valid on your very first mystery scoop order. No minimum order required.</p>

            <Link href="/mystery-scoops" className="btn-primary px-10 py-4 rounded-2xl text-base font-semibold inline-flex items-center gap-2 group">
              Claim Your Discount
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
