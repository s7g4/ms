"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, User, ArrowRight, Tag } from "lucide-react";
import { Metadata } from "next";

import { BLOG_POSTS, type BlogPost } from "@/lib/blog-data";



const CATEGORIES = ["All", "Kawaii", "Anime", "Unboxing", "Culture", "Tips"];

const categoryColorMap: Record<string, string> = {
  Kawaii: "bg-purple-500/15 text-accent-purple border-purple-500/30",
  Anime: "bg-teal-500/15 text-accent-teal border-teal-500/30",
  Unboxing: "bg-yellow-500/15 text-accent-yellow border-yellow-500/30",
  Culture: "bg-pink-500/15 text-accent-pink border-pink-500/30",
  Tips: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #00d4aa 0%, transparent 70%)",
          }}
        />
        <div className="relative container mx-auto px-4 max-w-2xl space-y-4">
          <p className="text-accent-teal text-sm font-semibold uppercase tracking-widest">
            Stories & Updates
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold font-jakarta leading-tight">
            The Scoop{" "}
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-text-muted text-lg">
            Unboxing stories, kawaii culture, anime news & creative inspiration.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl pb-24">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`blog-filter-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-accent-purple border-accent-purple text-white"
                  : "bg-white/5 border-purple-500/20 text-text-muted hover:border-accent-purple/40 hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <article
              key={post.slug}
              className="glass border border-purple-500/20 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Area */}
              <div
                className="h-48 w-full relative"
                style={{ background: post.gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-20">✨</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm ${categoryColorMap[post.category] || "bg-white/10 text-white border-white/20"}`}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h2 className="font-bold font-jakarta text-base leading-snug group-hover:text-accent-purple transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 pt-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: post.gradient }}
                  >
                    {post.authorInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {post.author}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>{post.date}</span>
                      <span>·</span>
                      <Clock size={11} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1.5 text-accent-purple text-sm font-medium hover:gap-2.5 transition-all mt-2"
                >
                  Read More <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            No posts in this category yet. Check back soon!
          </div>
        )}
      </section>
    </div>
  );
}
