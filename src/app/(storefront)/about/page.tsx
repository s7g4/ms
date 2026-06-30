import { Metadata } from "next";
import { Sparkles, Heart, ShieldCheck, Smile } from "lucide-react";

export const metadata: Metadata = { title: "About Us | Stack Your Scoops" };

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <p className="text-accent-pink text-sm font-semibold uppercase tracking-widest">Our Story</p>
        <h1 className="text-4xl md:text-6xl font-extrabold font-jakarta">
          Curated with Love, <span className="gradient-text">Stacked with Happiness</span> ✨
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Welcome to Stack Your Scoops, where every scoop is filled with love, joy, and little surprises. We believe that pretty things heal everything, bringing happiness directly to your doorstep.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4 border border-border">
          <div className="w-12 h-12 rounded-2xl bg-accent-pink/15 flex items-center justify-center border border-accent-pink/30">
            <Sparkles className="w-6 h-6 text-accent-pink" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Curated Surprises</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Our teams scour the globe for the cutest kawaii plushies, aesthetic stationery, beauty accessories, and custom treats. No boring fillers — only items that will make you smile!
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 border border-border">
          <div className="w-12 h-12 rounded-2xl bg-accent-purple/15 flex items-center justify-center border border-accent-purple/30">
            <Smile className="w-6 h-6 text-accent-purple" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Aesthetic & Cute Vibe</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Every box is themed and stacked beautifully. We choose products that heal the soul — from kawaii highlighters and squishy toys to anti-tarnish jewellery and spa gel socks.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 border border-border">
          <div className="w-12 h-12 rounded-2xl bg-accent-teal/15 flex items-center justify-center border border-accent-teal/30">
            <ShieldCheck className="w-6 h-6 text-accent-teal" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Value Guarantee</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            We guarantee that the total market price (MRP) of the items in your scoop is always higher than what you pay. You receive amazing surprise value with every single order!
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 border border-border">
          <div className="w-12 h-12 rounded-2xl bg-accent-pink/15 flex items-center justify-center border border-accent-pink/30">
            <Heart className="w-6 h-6 text-accent-pink" />
          </div>
          <h3 className="text-xl font-bold font-jakarta">Handpicked with Care</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Each box is handpicked with love, care, and attention to detail. Tell us what you want or don't want using our exclusions customizer, and we will package the perfect box.
          </p>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-border text-center space-y-6 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold font-jakarta">Our Promise</h3>
        <p className="text-text-muted text-sm leading-relaxed max-w-xl mx-auto font-medium">
          "Stack Your Scoop – Curated with Love, Stacked with Happiness."
        </p>
        <p className="text-text-muted text-sm leading-relaxed max-w-xl mx-auto">
          We treat every single order as if we are packing a surprise gift for our best friend. From selecting the perfect theme to carefully packaging each item to avoid your exclusions list, we are committed to giving you a magical unboxing journey.
        </p>
      </div>
    </div>
  );
}
