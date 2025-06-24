"use client";

import { useCart } from "@/store/cart";
import { toast } from "sonner";

export function AddToCartButton({ box }: { box: any }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ ...box });
    toast.success(`✨ Added ${box.name} to cart!`);
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full py-5 rounded-2xl text-lg font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: `linear-gradient(135deg, ${box.gradientFrom}, ${box.gradientTo})`,
        boxShadow: `0 10px 30px ${box.gradientFrom}40`
      }}
    >
      Add to Cart ✨
    </button>
  );
}
