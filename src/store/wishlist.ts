"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrpValue: number;
  gradientFrom: string;
  gradientTo: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  count: () => number;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) =>
          state.items.find((i) => i.id === item.id)
            ? state
            : { items: [...state.items, item] }
        ),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      toggleItem: (item) => {
        const { items } = get();
        if (items.find((i) => i.id === item.id)) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },
      isWishlisted: (id) => get().items.some((i) => i.id === id),
      count: () => get().items.length,
    }),
    { name: "mysteryscoop-wishlist" }
  )
);
