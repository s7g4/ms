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
  { href: "/blog", label: "Blog" },
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
    <footer className="relative border-t border-purple-500/20 mt-20">
      {/* Gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-accent-purple to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <span className="font-bold text-xl gradient-text font-grotesk">MysteryScoop</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s most magical mystery box store. Every box is a curated adventure — kawaii, anime, stationery, beauty & more.
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
                { icon: Share2, href: "#", label: "Instagram" },
                { icon: MessageCircle, href: "#", label: "Twitter" },
                { icon: CirclePlay, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
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

        <div className="mt-12 pt-6 border-t border-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
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
