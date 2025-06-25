import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  Package,
  Sparkles,
  MapPin,
  FileText,
} from "lucide-react";

export const metadata: Metadata = { title: "Track Order | MysteryScoop" };

export const dynamic = "force-dynamic";

type TimelineStep = {
  label: string;
  desc: string;
  icon: any;
  status: string;
};

export default async function OrderTrackingPage(props: {
  searchParams?: Promise<{ id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const orderId = searchParams?.id;

  if (!orderId) {
    redirect("/profile");
  }

  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      items: {
        include: { mysteryBox: true },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    redirect("/profile");
  }

  // 1. Map status index
  const statusLevels: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    PACKING: 2,
    PACKED: 3,
    SHIPPED: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
  };

  const currentLevel = statusLevels[order.status] ?? 1;

  const STEPS: TimelineStep[] = [
    { label: "Ordered", desc: "Payment received & verified", icon: Clock, status: "PENDING" },
    { label: "Confirmed", desc: "Order queued for packing", icon: CheckCircle, status: "CONFIRMED" },
    { label: "Curating", desc: "Selecting random weighted items", icon: Sparkles, status: "PACKING" },
    { label: "Packed", desc: "Mystery box sealed & labeled", icon: Package, status: "PACKED" },
    { label: "Shipped", desc: "Handed over to delivery courier", icon: Truck, status: "SHIPPED" },
    { label: "Delivered", desc: "Unboxing magic awaits!", icon: CheckCircle, status: "DELIVERED" },
  ];

  // Estimated delivery helper
  const deliveryEst = new Date(order.createdAt);
  deliveryEst.setDate(deliveryEst.getDate() + 5);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <span className="text-xs text-text-muted font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-purple-500/15">
          Order #{order.id}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tracking & Unboxed Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tracking Card */}
          <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold font-jakarta">Tracking Status</h2>

            <div className="relative pl-8 space-y-8 border-l border-purple-500/20 ml-3 py-2">
              {STEPS.map((step, idx) => {
                const isCompleted = currentLevel >= idx;
                const isActive = currentLevel === idx;
                const Icon = step.icon;

                return (
                  <div key={step.label} className="relative">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300
                        ${
                          isCompleted
                            ? "bg-accent-purple border-accent-purple text-white shadow-lg shadow-purple-500/30"
                            : "bg-[#0d0118] border-purple-500/30 text-text-muted"
                        } ${isActive ? "scale-110 ring-4 ring-purple-500/10" : ""}`}
                    >
                      <Icon size={12} className={isCompleted ? "text-white" : "text-text-muted"} />
                    </div>

                    <div className="space-y-1">
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {step.label} {isActive && "⚡"}
                      </h4>
                      <p className="text-xs text-text-muted">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unboxed Contents Card */}
          {currentLevel >= 2 && ( // Show allocations once packing has started (curating/packed/shipped/delivered)
            <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-jakarta flex items-center gap-2">
                  <Sparkles className="text-accent-pink" /> Unboxed Items!
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Here is the curated list of surprise products selected for your scoop:
                </p>
              </div>

              <div className="space-y-6">
                {order.items.map((item) => {
                  const allocations = (item.allocations as any[]) || [];

                  return (
                    <div key={item.id} className="space-y-4">
                      <h4 className="text-sm font-bold border-b border-purple-500/20 pb-2 text-accent-purple">
                        {item.mysteryBox.name} Contents
                      </h4>

                      {allocations.length === 0 ? (
                        <p className="text-xs text-text-muted italic">Curating your items right now...</p>
                      ) : (
                        <div className="space-y-3">
                          {allocations.map((alloc, boxIdx) => (
                            <div key={boxIdx} className="p-4 bg-white/5 rounded-2xl border border-purple-500/10 space-y-3">
                              <p className="text-xs font-semibold text-text-muted">Box #{boxIdx + 1}</p>
                              <div className="divide-y divide-purple-500/10">
                                {alloc.items.map((prod: any, prodIdx: number) => (
                                  <div key={prodIdx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">🎁</span>
                                      <div>
                                        <p className="font-semibold text-text-primary">{prod.name}</p>
                                        <span
                                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 uppercase tracking-widest
                                            ${
                                              prod.rarity === "ULTRA_RARE"
                                                ? "bg-red-500/10 text-red-400"
                                                : prod.rarity === "RARE"
                                                ? "bg-yellow-500/10 text-yellow-400"
                                                : prod.rarity === "UNCOMMON"
                                                ? "bg-blue-500/10 text-blue-400"
                                                : "bg-zinc-500/10 text-zinc-400"
                                            }`}
                                        >
                                          {prod.rarity}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="font-semibold text-text-muted">{formatPrice(prod.value)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="pt-2 flex justify-between items-center text-xs font-bold text-accent-pink border-t border-purple-500/10">
                                <span>Total Box Value:</span>
                                <span>{formatPrice(alloc.totalValue)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Address and Order Summary */}
        <div className="lg:col-span-4 space-y-8">
          {/* Estimated Delivery */}
          <div className="glass p-6 rounded-3xl border border-purple-500/20 text-center space-y-1">
            <p className="text-text-muted text-xs">Estimated Delivery</p>
            <p className="text-lg font-bold text-accent-teal">
              {order.status === "DELIVERED"
                ? "Delivered! 🎉"
                : deliveryEst.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
            </p>
          </div>

          {/* Shipping Address */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-purple-500/10 pb-2">
              <MapPin size={16} className="text-accent-pink" /> Delivery Address
            </h3>
            <div className="text-xs text-text-muted space-y-1.5">
              <p className="font-bold text-text-primary">{order.address.name}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p>Phone: {order.address.phone}</p>
            </div>
          </div>

          {/* Courier Details */}
          {order.trackingNumber && (
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-purple-500/10 pb-2">
                <Truck size={16} className="text-accent-teal" /> Shipping Info
              </h3>
              <div className="text-xs text-text-muted space-y-1.5">
                <p>Tracking Number:</p>
                <p className="font-mono font-bold text-text-primary">{order.trackingNumber}</p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 font-bold text-accent-purple hover:underline"
                  >
                    Track Shipment Live →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Payment Card */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-purple-500/10 pb-2">
              <FileText size={16} className="text-accent-purple" /> Cost Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Discount:</span>
                <span className="text-accent-pink">-{formatPrice(order.discount)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-text-primary border-t border-purple-500/15 pt-2">
                <span>Total:</span>
                <span className="text-accent-purple text-base">{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled
                className="w-full py-2.5 bg-white/5 border border-purple-500/20 text-xs font-bold rounded-xl text-text-muted flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              >
                <FileText size={14} /> Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
