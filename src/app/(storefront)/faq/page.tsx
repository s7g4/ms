"use client";

import { Metadata } from "next";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";

type FaqItem = { q: string; a: string };
type FaqSection = { title: string; color: string; items: FaqItem[] };

const FAQ_DATA: FaqSection[] = [
  {
    title: "Orders & Shipping",
    color: "purple",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery across India takes 5–8 business days. Express shipping (2–3 days) is available at checkout for select pincodes. You will receive a tracking link via email and SMS once your order is dispatched.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship only within India. We are actively working on expanding to South East Asia, UAE, and other regions. Join our waitlist to be notified when international shipping launches!",
      },
      {
        q: "What shipping carriers do you use?",
        a: "We partner with Bluedart, Delhivery, XpressBees, and India Post depending on your pincode. The carrier is selected automatically for the fastest delivery to your address.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely! Once shipped, you will receive a tracking ID via email and SMS. You can also track your order directly on our website using your Order ID on the Track Order page, or from your Profile → My Orders section.",
      },
      {
        q: "What happens if I miss my delivery?",
        a: "Our delivery partners will attempt delivery 2–3 times. If all attempts fail, the package is returned to our warehouse and we will initiate a full refund within 5–7 business days after receiving the return.",
      },
    ],
  },
  {
    title: "Products & Mystery Boxes",
    color: "pink",
    items: [
      {
        q: "What's inside a MysteryScoop box?",
        a: "Each box is curated with 3–7 items depending on the tier you choose. Items include kawaii plushies, anime merchandise, aesthetic stationery, DIY craft kits, snacks, and exclusive collectibles. Every box has a guaranteed MRP value higher than what you pay!",
      },
      {
        q: "Can I choose what goes inside my box?",
        a: "That's the fun part — you can't! The mystery is the experience. However, you can select a theme category (e.g., Kawaii, Anime, Aesthetic, Festive) and set preferences in your profile such as dietary restrictions for snack-included tiers.",
      },
      {
        q: "Will I get duplicate items if I order multiple boxes?",
        a: "Our allocation algorithm is designed to minimize duplicates. If you order multiple boxes of the same tier in a single month, we guarantee at least 70% unique items across your boxes.",
      },
      {
        q: "What is the minimum value guarantee?",
        a: "We guarantee that the total MRP of items in your box will always exceed the price you paid. For example, in our Classic Scoop (₹399), the total market value of items will always be ₹500 or more.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    color: "teal",
    items: [
      {
        q: "Can I return or exchange my mystery box?",
        a: "Due to the surprise nature of our product, we do not accept returns or exchanges based on personal preference. However, if you receive a damaged, defective, or incorrect item, we will replace it or provide a full refund. Please raise a ticket within 48 hours of delivery with photographic evidence.",
      },
      {
        q: "How long does a refund take?",
        a: "Once approved, refunds are processed within 2–3 business days. The amount will be credited to your original payment method. UPI/wallet payments are refunded instantly; card payments may take 5–7 banking days depending on your bank.",
      },
      {
        q: "What if my package arrives damaged?",
        a: "We are deeply sorry if this happens! Please photograph the damaged package and its contents immediately and email support@mysteryscoop.in with your Order ID. We will arrange a replacement or full refund within 24 hours of verification.",
      },
    ],
  },
  {
    title: "Account & Referrals",
    color: "yellow",
    items: [
      {
        q: "How does the referral program work?",
        a: "Every MysteryScoop account gets a unique referral code. When a new user signs up using your code and places their first order, you both get ₹50 in store credits. There's no cap — you can refer unlimited friends and keep earning!",
      },
      {
        q: "How do I use my store credits?",
        a: "Store credits appear automatically in your cart during checkout. You can use them to partially or fully pay for your next order. Credits are valid for 12 months from the date of issuance.",
      },
      {
        q: "Can I change my delivery address after placing an order?",
        a: "You can update your address within 1 hour of placing the order. After that, the order goes into packing and we cannot make changes. To request an address change, contact us immediately at support@mysteryscoop.in with your Order ID.",
      },
    ],
  },
];

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="glass border border-purple-500/15 rounded-2xl overflow-hidden"
        >
          <button
            id={`faq-item-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 hover:bg-white/5 transition-colors"
          >
            <span className="font-medium text-text-primary text-sm leading-snug">
              {item.q}
            </span>
            <ChevronDown
              size={18}
              className={`text-accent-purple flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? "max-h-96" : "max-h-0"}`}
          >
            <div className="px-6 pb-5 text-text-muted text-sm leading-relaxed border-t border-purple-500/10 pt-4">
              {item.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const sectionColorMap: Record<string, string> = {
    purple: "bg-purple-500/10 border-purple-500/30 text-accent-purple",
    pink: "bg-pink-500/10 border-pink-500/30 text-accent-pink",
    teal: "bg-teal-500/10 border-teal-500/30 text-accent-teal",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-accent-yellow",
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #ff6eb4 0%, transparent 70%)",
          }}
        />
        <div className="relative container mx-auto px-4 max-w-2xl space-y-4">
          <p className="text-accent-pink text-sm font-semibold uppercase tracking-widest">
            Help Center
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold font-jakarta leading-tight">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-text-muted text-lg leading-relaxed">
            Everything you need to know about MysteryScoop. Can't find an
            answer?{" "}
            <Link
              href="/contact"
              className="text-accent-purple hover:underline"
            >
              Contact our team
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-3xl pb-24 space-y-12">
        {FAQ_DATA.map((section) => (
          <div key={section.title}>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border mb-6 ${sectionColorMap[section.color]}`}
            >
              <HelpCircle size={15} />
              {section.title}
            </div>
            <FaqAccordion items={section.items} />
          </div>
        ))}

        {/* Still have questions */}
        <div className="glass p-8 rounded-3xl border border-purple-500/20 text-center space-y-4">
          <h3 className="font-bold font-jakarta text-xl">
            Still have questions?
          </h3>
          <p className="text-text-muted text-sm">
            Our support team is happy to help with anything not covered here.
          </p>
          <Link
            href="/contact"
            id="faq-contact-btn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #b06cf0, #ff6eb4)" }}
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
