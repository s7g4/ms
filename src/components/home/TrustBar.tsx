"use client";

import { motion } from "framer-motion";
import { Shield, Star, RotateCcw, Truck } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Star, value: "4.9/5★", label: "Happy Customers", color: "#ffd166" },
  { icon: Shield, value: "100%", label: "Authentic Products", color: "#00d4aa" },
  { icon: Truck, value: "Free", label: "Shipping over ₹499", color: "#b06cf0" },
  { icon: RotateCcw, value: "Easy", label: "Returns & Refunds", color: "#ff6eb4" },
];

export function TrustBar() {
  return (
    <section className="py-8 border-y border-purple-500/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="font-bold text-sm text-text-primary">{value}</p>
                <p className="text-xs text-text-muted">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
