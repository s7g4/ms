"use client";

import { Metadata } from "next";
import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  Share2,
  MessageCircle,
  CirclePlay,
  MapPin,
  CheckCircle,
} from "lucide-react";

const SUBJECTS = [
  "Order Issue",
  "Return / Refund",
  "Collaboration",
  "General Query",
  "Feedback",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #b06cf0 0%, transparent 70%)",
          }}
        />
        <div className="relative container mx-auto px-4 max-w-2xl space-y-4">
          <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest">
            We&apos;re Here For You
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold font-jakarta leading-tight">
            Get In{" "}
            <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-text-muted text-lg leading-relaxed">
            Have a question, issue, or just want to say hi? We&apos;d love to
            hear from you. Our support team is always ready to help.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            {[
              {
                icon: Mail,
                title: "Email Support",
                value: "support@mysteryscoop.in",
                note: "For order queries & general help",
                color: "purple",
              },
              {
                icon: MessageSquare,
                title: "WhatsApp",
                value: "+91 98765 43210",
                note: "Quick replies Mon–Sat, 10am–6pm",
                color: "teal",
              },
              {
                icon: Clock,
                title: "Response Time",
                value: "Under 24 hours",
                note: "We aim to reply as fast as possible",
                color: "pink",
              },
              {
                icon: MapPin,
                title: "Office",
                value: "Bengaluru, Karnataka, India",
                note: "560001",
                color: "yellow",
              },
            ].map((item) => {
              const colorMap: Record<string, string> = {
                purple: "bg-purple-500/10 border-purple-500/20 text-accent-purple",
                teal: "bg-teal-500/10 border-teal-500/20 text-accent-teal",
                pink: "bg-pink-500/10 border-pink-500/20 text-accent-pink",
                yellow: "bg-yellow-500/10 border-yellow-500/20 text-accent-yellow",
              };
              return (
                <div
                  key={item.title}
                  className="glass p-5 rounded-2xl border border-purple-500/20 flex items-start gap-4"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorMap[item.color]}`}
                  >
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                      {item.title}
                    </p>
                    <p className="font-semibold text-text-primary">
                      {item.value}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{item.note}</p>
                  </div>
                </div>
              );
            })}

            {/* Social */}
            <div className="glass p-5 rounded-2xl border border-purple-500/20">
              <p className="text-sm font-semibold mb-4">Follow Us</p>
              <div className="flex gap-3">
                {[
                  {
                    icon: Share2,
                    label: "Instagram",
                    href: "https://instagram.com/mysteryscoop",
                  },
                  {
                    icon: MessageCircle,
                    label: "Twitter",
                    href: "https://twitter.com/mysteryscoop",
                  },
                  {
                    icon: CirclePlay,
                    label: "YouTube",
                    href: "https://youtube.com/@mysteryscoop",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-center text-text-muted hover:text-accent-purple hover:border-accent-purple/40 transition-all"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl border border-purple-500/20 p-8 md:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-accent-teal" />
                  </div>
                  <h2 className="text-2xl font-bold font-jakarta">
                    Message Sent! 🎉
                  </h2>
                  <p className="text-text-muted max-w-sm">
                    Thank you for reaching out. Our support team will get back
                    to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-accent-purple text-sm font-medium hover:bg-purple-500/20 transition-all"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold font-jakarta mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-text-muted text-sm mb-8">
                    Fill out the form below and we&apos;ll get back to you as soon
                    as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Your name"
                          className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/60 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="you@email.com"
                          className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/60 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                        Subject *
                      </label>
                      <select
                        id="contact-subject"
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-purple/60 transition-colors appearance-none"
                      >
                        <option value="" disabled>
                          Select a subject...
                        </option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s} className="bg-[#1a0533]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        placeholder="Tell us how we can help you..."
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/60 transition-colors resize-none"
                      />
                    </div>

                    <button
                      id="contact-submit"
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                      style={{
                        background:
                          "linear-gradient(135deg, #b06cf0, #ff6eb4)",
                      }}
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={18} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
