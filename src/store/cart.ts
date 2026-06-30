"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      couponDiscount: 0,
      isOpen: false,

      addItem: (item) => {
        const qtyToAdd = item.quantity ?? 1;
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
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
        if (qty < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        }));
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
