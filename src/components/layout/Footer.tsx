"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Share2, MessageCircle, CirclePlay, Mail, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SHOP_LINKS = [
  { href: "/mystery-scoops", label: "Mystery Scoops" },
  { href: "/collections", label: "All Collections" },
  { href: "/track", label: "Track Order" },
  { href: "/wishlist", label: "Wishlist" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/refund", label: "Refund Policy" },
  { href: "/legal/shipping", label: "Shipping Policy" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("🎉 You're on the list! Expect magic in your inbox.");
    setEmail("");
  };

  return (
    <footer className="relative border-t border-border mt-20 bg-bg-card/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <span className="font-bold text-xl gradient-text font-grotesk">Stack Your Scoops</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
              Every scoop is filled with love, joy, and little surprises. We curate pretty things that heal everything!
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="flex gap-2 max-w-xs">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field flex-1 text-sm py-2"
              />
              <button type="submit" className="btn-primary py-2 px-4 text-sm whitespace-nowrap rounded-lg">
                <Mail size={16} />
              </button>
            </form>

            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: Share2, href: "https://instagram.com/stackyourscoops", label: "Instagram" },
                { icon: MessageCircle, href: "https://twitter.com/stackyourscoops", label: "Twitter" },
                { icon: CirclePlay, href: "https://youtube.com/@stackyourscoops", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-text-muted hover:text-accent-pink transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Shop", links: SHOP_LINKS },
            { title: "Company", links: COMPANY_LINKS },
            { title: "Legal", links: LEGAL_LINKS },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-text-muted hover:text-accent-purple transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment & Shipping Badges */}
        <div className="mt-12 pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Secured Payments</span>
            <div className="flex flex-wrap items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-300">
              <span className="text-[9px] font-bold tracking-widest px-2.5 py-1 rounded bg-emerald-500 text-white border border-emerald-400/30">UPI</span>
              <span className="text-[9px] font-bold italic px-2.5 py-1 rounded bg-[#0A2540] text-[#00D4B2] border border-[#0A2540]/30 font-serif">VISA</span>
              <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-[#1A1919] text-[#FF5F00] border border-[#FF5F00]/20">MASTERCARD</span>
              <span className="text-[9px] font-black px-2.5 py-1 rounded bg-blue-600 text-white border border-blue-500/20 tracking-tight">RAZORPAY</span>
              <span className="text-[9px] font-extrabold px-2.5 py-1 rounded bg-[#635BFF] text-white border border-[#635BFF]/20">STRIPE</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:text-right">
            <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Fulfillment Partners</span>
            <div className="flex flex-wrap items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-300 sm:justify-end">
              <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-[#5D16FF] text-white border border-[#5D16FF]/20">SHIPROCKET</span>
              <span className="text-[9px] font-black px-2.5 py-1 rounded bg-slate-900 text-[#FF5A00] border border-[#FF5A00]/20">DELHIVERY</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} MysteryScoop. All rights reserved.
          </p>
          <p className="text-text-muted text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-accent-pink fill-accent-pink" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
