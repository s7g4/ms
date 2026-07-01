"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string; // composite key: `${mysteryBoxId}-${selectedVariant || 'default'}`
  mysteryBoxId: string; // real database ID
  slug: string;
  name: string;
  price: number;
  mrpValue: number;
  gradientFrom: string;
  gradientTo: string;
  quantity: number;
  theme?: string;
  minItems: number;
  maxItems: number;
  selectedVariant?: string;
  unwantedNote?: string;
  wantedNote?: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

const MAX_QTY_PER_ITEM = 10;
const MAX_TOTAL_QTY = 20;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      couponDiscount: 0,
      isOpen: false,

      addItem: (item) => {
        const qtyToAdd = Math.floor(item.quantity ?? 1);
        if (qtyToAdd < 1) return;

        set((state) => {
          const currentTotal = state.items.reduce((acc, i) => acc + i.quantity, 0);
          const existing = state.items.find((i) => i.id === item.id);
          const currentItemQty = existing ? existing.quantity : 0;

          // 1. Check total cart quantity limit
          if (currentTotal - currentItemQty + qtyToAdd > MAX_TOTAL_QTY) {
            toast.warning(`Total order limit is ${MAX_TOTAL_QTY} scoops due to shipping box sizes.`);
            const allowedTotalAdd = MAX_TOTAL_QTY - currentTotal + currentItemQty;
            if (allowedTotalAdd <= 0) return { isOpen: true };
          }

          // 2. Check item variant limit
          if (currentItemQty + qtyToAdd > MAX_QTY_PER_ITEM) {
            toast.warning(`Maximum limit is ${MAX_QTY_PER_ITEM} of the same scoop type per order.`);
            const targetQty = MAX_QTY_PER_ITEM;
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: targetQty } : i
                ),
                isOpen: true,
              };
            }
            return {
              items: [...state.items, { ...item, quantity: targetQty }],
              isOpen: true,
            };
          }

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...item, quantity: qtyToAdd }], isOpen: true };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        const sanitizedQty = Math.floor(qty);
        if (sanitizedQty < 1) {
          get().removeItem(id);
          return;
        }

        set((state) => {
          const targetItem = state.items.find((i) => i.id === id);
          if (!targetItem) return {};

          const currentTotalWithoutTarget = state.items
            .filter((i) => i.id !== id)
            .reduce((acc, i) => acc + i.quantity, 0);

          let finalQty = sanitizedQty;

          // Check single item limit
          if (finalQty > MAX_QTY_PER_ITEM) {
            toast.warning(`Maximum limit is ${MAX_QTY_PER_ITEM} of the same scoop type per order.`);
            finalQty = MAX_QTY_PER_ITEM;
          }

          // Check total cart limit
          if (currentTotalWithoutTarget + finalQty > MAX_TOTAL_QTY) {
            toast.warning(`Total order limit is ${MAX_TOTAL_QTY} scoops due to shipping box sizes.`);
            finalQty = MAX_TOTAL_QTY - currentTotalWithoutTarget;
          }

          if (finalQty < 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }

          return {
            items: state.items.map((i) => (i.id === id ? { ...i, quantity: finalQty } : i)),
          };
        });
      },

      clearCart: () => set({ items: [], couponCode: "", couponDiscount: 0 }),

      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: "mysteryscoop-cart" }
  )
);
