"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const REVIEWS = [
  { id: 1, name: "Priya S.", location: "Mumbai", rating: 5, text: "Omg the Classic Scoop blew my mind!! Got a rare Ghibli figurine + 6 other amazing items. Worth every rupee! 🌸", box: "Classic Scoop", avatar: "P", color: "#ff6eb4" },
  { id: 2, name: "Aryan K.", location: "Bangalore", rating: 5, text: "Ordered 3 times already and every box is different. The packaging is SO cute and items are always high quality!", box: "Premium Scoop", avatar: "A", color: "#b06cf0" },
  { id: 3, name: "Meera R.", location: "Delhi", rating: 5, text: "Best surprise box ever! My daughter was literally squealing when she opened it. 10/10 will order again ✨", box: "Starter Scoop", avatar: "M", color: "#00d4aa" },
  { id: 4, name: "Zoya T.", location: "Hyderabad", rating: 5, text: "The Premium Scoop is absolutely worth it!! Got items worth easily ₹2500+ in a ₹799 box. Unreal value!", box: "Premium Scoop", avatar: "Z", color: "#ffd166" },
  { id: 5, name: "Rahul M.", location: "Chennai", rating: 5, text: "Gifted this to my girlfriend and she absolutely loved it. MysteryScoop hits different 💜", box: "Classic Scoop", avatar: "R", color: "#ff6eb4" },
];

export function ReviewsCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => { setDir(1); setIdx((i) => (i + 1) % REVIEWS.length); }, 5000);
    return () => clearInterval(t);
  }, []);

  const go = (d: number) => { setDir(d); setIdx((i) => (i + d + REVIEWS.length) % REVIEWS.length); };
  const review = REVIEWS[idx];

  return (
    <section className="section" style={{ background: "rgba(176,108,240,0.04)" }}>
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-accent-yellow text-sm font-semibold uppercase tracking-widest mb-3">Real Reviews</p>
          <h2 className="text-4xl md:text-5xl font-bold font-jakarta">
            What People <span className="gradient-text">Say</span>
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -dir * 60 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 text-center"
            >
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="fill-accent-yellow text-accent-yellow" />
                ))}
              </div>

              <p className="text-text-primary text-lg leading-relaxed mb-6 font-medium">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: review.color }}
                >
                  {review.avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-text-primary text-sm">{review.name}</p>
                  <p className="text-xs text-text-muted">{review.location} · {review.box}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => go(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 glass rounded-full text-text-muted hover:text-white transition-all hover:scale-110 hidden md:flex">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 glass rounded-full text-text-muted hover:text-white transition-all hover:scale-110 hidden md:flex">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {REVIEWS.map((_, i) => (
            <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === idx ? 24 : 8, background: i === idx ? "var(--accent-purple)" : "rgba(176,108,240,0.3)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
