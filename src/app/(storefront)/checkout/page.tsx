"use client";

import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { CreditCard, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, couponDiscount } = useCart();
  const sub = subtotal();
  const shipping = sub >= 499 ? 0 : 59;
  const total = sub - couponDiscount + shipping;

  const [loading, setLoading] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment
    setTimeout(() => {
      setLoading(false);
      toast.success("🎉 Payment successful! Redirecting to tracking...");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-text-muted mb-8">Add some magic to your cart before checking out.</p>
        <Link href="/mystery-scoops" className="btn-primary px-8 py-3 rounded-xl">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold font-jakarta mb-8">
        Secure <span className="gradient-text">Checkout</span> 🔒
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleCheckout} className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck className="text-accent-teal" /> Shipping Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="First Name" className="input-field" />
              <input required type="text" placeholder="Last Name" className="input-field" />
              <input required type="email" placeholder="Email" className="input-field md:col-span-2" />
              <input required type="text" placeholder="Phone Number" className="input-field md:col-span-2" />
              <input required type="text" placeholder="Address Line 1" className="input-field md:col-span-2" />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" className="input-field md:col-span-2" />
              <input required type="text" placeholder="City" className="input-field" />
              <input required type="text" placeholder="State" className="input-field" />
              <input required type="text" placeholder="PIN Code" className="input-field" />
              <input required type="text" placeholder="Country" defaultValue="India" disabled className="input-field opacity-50 cursor-not-allowed" />
            </div>

            <h2 className="text-xl font-bold mt-10 mb-6 flex items-center gap-2">
              <CreditCard className="text-accent-pink" /> Payment
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-accent-purple/30 bg-accent-purple/10 cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="accent-accent-purple" />
                <span className="font-medium">UPI / Credit Card / Debit Card (Razorpay)</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-purple-500/20 bg-white/5 cursor-pointer">
                <input type="radio" name="payment" className="accent-accent-purple" />
                <span className="font-medium">Cash on Delivery (₹50 Extra)</span>
              </label>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0"
                       style={{ background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }}>
                    🎁
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-4 border-y border-purple-500/20 mb-6 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span><span>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold gradient-text">{formatPrice(total)}</span>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
              {!loading && <ChevronRight size={20} />}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
              <ShieldCheck size={14} className="text-accent-teal" />
              256-bit secure encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
