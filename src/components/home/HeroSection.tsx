"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const FLOATING_BOXES = [
  { emoji: "🎁", size: 64, x: "12%", y: "25%", delay: 0, duration: 7 },
  { emoji: "✨", size: 40, x: "85%", y: "20%", delay: 1, duration: 6 },
  { emoji: "🎀", size: 50, x: "82%", y: "65%", delay: 1.5, duration: 8 },
];

// Deterministic star data — avoids SSR/client hydration mismatch from Math.random()
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  size: 1 + ((i * 7 + 13) % 30) / 10,          // 1.0 – 4.0 px
  x: (i * 17 + 3) % 100,                         // 0 – 99 %
  y: (i * 23 + 11) % 100,                        // 0 – 99 %
  delay: (i * 3 + 7) % 40 / 10,                  // 0 – 3.9 s
  duration: 2 + (i * 11 + 5) % 20 / 10,          // 2 – 4 s
}));

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, [-1, 1], [-15, 15]);
  const parallaxY = useTransform(mouseY, [-1, 1], [-10, 10]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(176,108,240,0.2) 0%, rgba(255,110,180,0.08) 50%, transparent 80%)",
          }}
        />
        <div
          className="absolute inset-0 animate-[gradient-shift_8s_ease_infinite]"
          style={{
            background: "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(0,212,170,0.1) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Stars */}
      {STARS.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            "--duration": `${star.duration}s`,
            "--delay": `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Floating elements */}
      <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute inset-0 z-0 pointer-events-none">
        {FLOATING_BOXES.map((box, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: 1,
              y: [0, -20, 0],
            }}
            transition={{
              opacity: { duration: box.duration, repeat: Infinity, delay: box.delay },
              y: { duration: box.duration, repeat: Infinity, delay: box.delay, ease: "easeInOut" },
              scale: { duration: 0.5, delay: box.delay * 0.5 },
            }}
            className="absolute flex items-center justify-center select-none"
            style={{
              fontSize: box.size,
              left: box.x,
              top: box.y,
              filter: "drop-shadow(0 0 20px rgba(176,108,240,0.5))",
            }}
          >
            {box.emoji}
          </motion.div>
        ))}
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(176,108,240,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(176,108,240,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-400/30 text-sm text-accent-purple font-medium mb-6"
        >
          <Sparkles size={14} />
          India&apos;s #1 Mystery Box Store
          <Sparkles size={14} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] font-jakarta text-[oklch(0.4_0.1_350)]"
        >
          Unbox the <span className="shimmer-text">Magic</span> of Surprises
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Every box is a curated surprise — kawaii treasures, anime collectibles,
          stationery wonders & more. Pick your scoop, we handle the magic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <Link
            href="/mystery-scoops"
            className="btn-primary px-8 py-4 rounded-2xl text-base font-semibold inline-flex items-center gap-2 group focus-ring"
          >
            Shop Mystery Scoops
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/collections"
            className="btn-secondary px-8 py-4 rounded-2xl text-base font-semibold focus-ring"
          >
            Browse Collections
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: 3, suffix: "", label: "Scoop Tiers" },
            { value: 100, suffix: "%", label: "Value Guarantee" },
            { value: 7, suffix: "+", label: "Curated Themes" },
            { value: "Free", suffix: "", label: "Shipping" },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="glass-card p-3 text-center">
              <div className="text-2xl font-bold gradient-text font-grotesk">
                {value}{suffix}
              </div>
              <div className="text-xs text-text-muted mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-purple-400/40 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-2 bg-accent-purple rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
