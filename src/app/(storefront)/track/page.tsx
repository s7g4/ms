"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle, Package, Truck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type TrackData = {
  id: string;
  status: string;
  createdAt: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
};

export default function PublicTrackPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<TrackData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setOrderData(null);

    try {
      // Fetch public order status
      // We can query our api endpoint or a specific tracking lookup
      const res = await axios.get(`/api/products?type=box`); // dummy check for auth, but let's query DB directly or write an endpoint.
      // Wait, we can fetch public details from DB via a dedicated endpoint, but since it's just order status, let's query it.
      // Wait! Let's build a small helper inside the page or write a quick public query helper.
      // Actually, let's write a Server Action or fetch. Since we can fetch via fetch API, let's look up using an inline fetch or write the endpoint.
      // Let's call /api/orders/track?id=orderId
      const trackingRes = await axios.get(`/api/orders?id=${orderId.trim()}`);
      if (trackingRes.data.success) {
        setOrderData(trackingRes.data.order);
      } else {
        toast.error("Order not found");
      }
    } catch {
      toast.error("Order not found or verification failed");
    } finally {
      setLoading(false);
    }
  };

  const statusLevels: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    PACKING: 2,
    PACKED: 3,
    SHIPPED: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
  };

  const currentLevel = orderData ? statusLevels[orderData.status] ?? 1 : 0;

  const STEPS = [
    { label: "Ordered", icon: Clock },
    { label: "Confirmed", icon: CheckCircle },
    { label: "Curating", icon: Package },
    { label: "Packed", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: CheckCircle },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12">
      {/* Title */}
      <div className="text-center">
        <p className="text-accent-purple text-sm font-semibold uppercase tracking-widest mb-3">
          Courier Tracking
        </p>
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
          Track Your <span className="gradient-text">Scoop</span> 📦
        </h1>
        <p className="text-text-muted max-w-md mx-auto">
          Enter your Order ID (starts with `cm...` or similar) to see live unboxing and shipping updates.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. cmqtucyb10004rasb92hecwqz"
          required
          className="input-field flex-1 py-3 text-sm"
        />
        <button type="submit" disabled={loading} className="btn-primary py-3 px-6 rounded-xl text-sm font-bold flex items-center gap-2">
          {loading ? "Searching..." : <><Search size={16} /> Track</>}
        </button>
      </form>

      {/* Result Timeline */}
      <AnimatePresence>
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="glass-card p-6 md:p-8 rounded-3xl space-y-8"
          >
            <div className="flex justify-between items-center border-b border-purple-500/10 pb-4">
              <div>
                <p className="text-xs text-text-muted">Order ID</p>
                <p className="font-mono text-sm font-bold text-text-primary">#{orderData.id}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Status</p>
                <span className="inline-block px-3 py-1 bg-accent-purple/15 text-accent-purple rounded-full font-bold text-[10px] uppercase tracking-wider mt-1">
                  {orderData.status}
                </span>
              </div>
            </div>

            {/* Horizontal Timeline */}
            <div className="grid grid-cols-6 gap-2 relative">
              {/* Connector Bar */}
              <div className="absolute top-4 left-[8.33%] right-[8.33%] h-0.5 bg-purple-500/10 z-0">
                <div
                  className="h-full bg-accent-purple transition-all duration-500"
                  style={{ width: `${(Math.min(currentLevel, 5) / 5) * 100}%` }}
                />
              </div>

              {STEPS.map((step, idx) => {
                const isCompleted = currentLevel >= idx;
                const isActive = currentLevel === idx;
                const Icon = step.icon;

                return (
                  <div key={step.label} className="flex flex-col items-center text-center space-y-2 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300
                        ${
                          isCompleted
                            ? "bg-accent-purple border-accent-purple text-white shadow-lg shadow-purple-500/30"
                            : "bg-[#0d0118] border-purple-500/30 text-text-muted"
                        } ${isActive ? "scale-110 ring-4 ring-purple-500/10" : ""}`}
                    >
                      <Icon size={14} />
                    </div>
                    <span className={`text-[10px] font-bold block ${isCompleted ? "text-text-primary" : "text-text-muted"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tracking details */}
            {orderData.trackingNumber && (
              <div className="p-4 bg-white/5 border border-purple-500/10 rounded-2xl text-xs space-y-1">
                <p className="text-text-muted">Shipment tracking number:</p>
                <p className="font-mono font-bold text-text-primary text-sm">{orderData.trackingNumber}</p>
                {orderData.trackingUrl && (
                  <a
                    href={orderData.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 font-bold text-accent-purple hover:underline"
                  >
                    Track shipment on courier portal →
                  </a>
                )}
              </div>
            )}

            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-400">
              <ShieldAlert className="shrink-0" size={16} />
              <span>For privacy reasons, detailed item allocations are only visible inside your dashboard. <a href="/login" className="underline font-bold text-white">Log in</a> to view unboxed items.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
