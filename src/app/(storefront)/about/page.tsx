import { Metadata } from "next";
import { Sparkles, Heart, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = { title: "About Us | MysteryScoop" };

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest">Our Story</p>
        <h1 className="text-4xl md:text-6xl font-extrabold font-jakarta">
          Unboxing the <span className="gradient-text">Magic</span> ✨
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          We believe that life is better with surprises. MysteryScoop was founded with a simple goal: to deliver curated joy, kawaii collectibles, and anime magic directly to your doorstep.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4 border border-purple-500/20">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Sparkles className="w-6 h-6 text-accent-purple" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Curated Surprises</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Our teams scour the globe for the cutest kawaii plushies, rare anime collectibles, aesthetic stationery, and creative DIY kits. No boring fillers — only items that will make you smile!
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 border border-pink-500/20">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
            <Zap className="w-6 h-6 text-accent-pink" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Smart Weighted Randomization</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Every scoop is generated using our custom unboxing algorithm. We balance rarity, item weight, and theme distributions to ensure every box packs maximum variety and value.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 border border-teal-500/20">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <ShieldCheck className="w-6 h-6 text-accent-teal" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Value Guarantee</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            We guarantee that the total market price (MRP) of the items in your box is always higher than what you pay. You receive amazing surprise value with every single order!
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 border border-purple-500/20">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Heart className="w-6 h-6 text-accent-purple" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Loved by Fans</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            With over 50,000 happy unboxing experiences shipped across the country, we have built a thriving community of kawaii and anime enthusiasts who share their surprise pulls!
          </p>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-purple-500/15 text-center space-y-6 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold font-jakarta">Our Promise</h3>
        <p className="text-text-muted text-sm leading-relaxed max-w-xl mx-auto">
          We treat every single order as if we are packing a surprise gift for our best friend. From selecting the perfect theme to carefully wrapping each item in custom tissue paper, we are committed to giving you a magical unboxing journey.
        </p>
      </div>
    </div>
  );
}
