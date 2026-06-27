"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, couponDiscount } = useCart();
  const sub = subtotal();
  const shipping = sub >= 499 ? 0 : 59;
  const total = sub - couponDiscount + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col shadow-2xl border-l border-[oklch(0.4_0.1_350_/_0.15)]"
            style={{ background: "var(--bg-primary)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-accent-purple" size={20} />
                <h2 className="font-semibold text-lg">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-xs bg-accent-purple/20 text-accent-purple border border-accent-purple/30 rounded-full px-2 py-0.5">
                    {items.reduce((a, i) => a + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl floating"
                    style={{ background: "linear-gradient(135deg, rgba(176,108,240,0.2), rgba(255,110,180,0.2))", border: "1px solid rgba(176,108,240,0.2)" }}>
                    🎁
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary mb-1">Your cart is empty!</p>
                    <p className="text-text-muted text-sm">Add some mystery boxes to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-primary px-6 py-2 text-sm rounded-xl"
                  >
                    Shop Now
                  </button>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass-card p-4 flex gap-3"
                  >
                    {/* Box art */}
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                      style={{ background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }}
                    >
                      🎁
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-muted mb-2">{item.minItems}–{item.maxItems} surprise items</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 glass rounded-lg p-1">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-text-muted hover:text-white transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-text-muted hover:text-white transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm gradient-text">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-purple-500/20 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span><span>{formatPrice(sub)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-accent-teal">
                      <span>Coupon Discount</span><span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-accent-teal">FREE</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="h-px bg-purple-500/20" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="gradient-text">{formatPrice(total)}</span>
                  </div>
                </div>

                {sub < 499 && (
                  <p className="text-xs text-center text-text-muted">
                    Add {formatPrice(499 - sub)} more for <span className="text-accent-teal font-medium">FREE shipping</span>
                  </p>
                )}

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold focus-ring"
                >
                  <Package size={18} />
                  Secure Checkout
                  <ArrowRight size={16} />
                </Link>

                <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted mt-1 font-semibold">
                  <span className="flex items-center gap-1">🔒 Secure SSL checkout</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">🚚 Dispatches within 24-48h</span>
                </div>

                <button onClick={closeCart} className="w-full text-sm text-text-muted hover:text-text-primary transition-colors focus-ring py-1 rounded">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
