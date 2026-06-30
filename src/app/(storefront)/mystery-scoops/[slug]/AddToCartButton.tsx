"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { Plus, Minus, ShoppingBag, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Variant {
  name: string;
  price: number;
  mrpValue: number;
  minItems: number;
  maxItems: number;
}

export function AddToCartButton({ box }: { box: any }) {
  const { addItem } = useCart();

  // Parse variants from JSON database column
  const variants: Variant[] = Array.isArray(box.variants)
    ? (box.variants as Variant[])
    : [];

  // Default to first variant, or mock variant if none exists
  const defaultVariant: Variant = variants.length > 0
    ? variants[0]
    : {
        name: "Standard Scoop",
        price: box.price,
        mrpValue: box.mrpValue,
        minItems: box.minItems,
        maxItems: box.maxItems,
      };

  const [selectedVariant, setSelectedVariant] = useState<Variant>(defaultVariant);
  const [unwantedNote, setUnwantedNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantName = e.target.value;
    const found = variants.find((v) => v.name === variantName);
    if (found) {
      setSelectedVariant(found);
    }
  };

  const handleAdd = () => {
    const compositeId = `${box.id}-${selectedVariant.name.replace(/\s+/g, "-").toLowerCase()}`;

    addItem({
      id: compositeId,
      mysteryBoxId: box.id,
      slug: box.slug,
      name: `${box.name} - ${selectedVariant.name}`,
      price: selectedVariant.price,
      mrpValue: selectedVariant.mrpValue,
      gradientFrom: box.gradientFrom,
      gradientTo: box.gradientTo,
      theme: box.theme || "Kawaii Mix",
      minItems: selectedVariant.minItems,
      maxItems: selectedVariant.maxItems,
      selectedVariant: selectedVariant.name,
      unwantedNote: unwantedNote.trim() || undefined,
      quantity: quantity,
    });

    toast.success(`✨ Added ${quantity}x ${box.name} (${selectedVariant.name}) to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Item & Rarity Stats Block */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-2xl border border-border">
          <p className="text-text-muted text-xs mb-1 uppercase tracking-wider font-semibold">Goodies Guaranteed</p>
          <p className="text-2xl font-extrabold text-text-primary">
            {selectedVariant.minItems}-{selectedVariant.maxItems} items
          </p>
        </div>
        <div className="glass p-4 rounded-2xl border border-border">
          <p className="text-text-muted text-xs mb-1 uppercase tracking-wider font-semibold">Value Guarantee</p>
          <p className="text-2xl font-extrabold text-accent-teal">
            {formatPrice(selectedVariant.mrpValue)}+
          </p>
        </div>
      </div>

      {/* 1. Dropdown Choice (if variants exist) */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="scoop-size" className="block text-sm font-bold text-text-primary">
            Scoop Size
          </label>
          <select
            id="scoop-size"
            value={selectedVariant.name}
            onChange={handleVariantChange}
            className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg-primary text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-accent-pink cursor-pointer"
          >
            {variants.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} — {formatPrice(v.price)} (Worth {formatPrice(v.mrpValue)})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 2. Customization Text Area */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="exclusions-note" className="block text-sm font-bold text-text-primary">
            Any 3-4 products or colors you don't want in your box? *
          </label>
          <span className="text-xs text-text-muted font-medium">
            {unwantedNote.length}/500
          </span>
        </div>
        <textarea
          id="exclusions-note"
          value={unwantedNote}
          onChange={(e) => setUnwantedNote(e.target.value.slice(0, 500))}
          placeholder="e.g. No pink hair accessories, no black lip gloss, no anime stickers..."
          className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg-primary text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-pink min-h-24 resize-none text-sm leading-relaxed"
        />
        <div className="flex items-start gap-1.5 text-xs text-text-muted">
          <Info size={14} className="shrink-0 text-accent-purple mt-0.5" />
          <p>
            You can exclude categories like: Kawaii stationery, Makeup tools, sleeping masks, anti-tarnish jewelry, scrunchies, squishies, mini ring lights, custom nails, spa gel socks etc.
          </p>
        </div>
      </div>

      {/* 3. Quantity Selector */}
      <div className="space-y-2">
        <span className="block text-sm font-bold text-text-primary">
          Quantity
        </span>
        <div className="flex items-center gap-3 w-fit bg-bg-secondary p-1 rounded-xl border border-border/50">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-bg-primary hover:bg-bg-card active:scale-95 transition-all text-text-primary"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-bold text-text-primary">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-bg-primary hover:bg-bg-card active:scale-95 transition-all text-text-primary"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* 4. Price and MRP Info Block */}
      <div className="flex items-end justify-between py-6 border-y border-border">
        <div>
          <span className="text-xs text-text-muted font-bold uppercase tracking-widest block mb-1">Total Price</span>
          <span className="text-4xl font-extrabold font-grotesk gradient-text">
            {formatPrice(selectedVariant.price * quantity)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-accent-pink font-bold uppercase tracking-wider block mb-1">Guaranteed Worth</span>
          <span className="inline-block px-3 py-1 bg-accent-pink/15 text-accent-pink text-xs font-bold rounded-full">
            {formatPrice(selectedVariant.mrpValue * quantity)}+ Value
          </span>
        </div>
      </div>

      {/* 5. Add to Cart Button */}
      <button
        onClick={handleAdd}
        className="w-full py-4.5 rounded-2xl text-lg font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        style={{
          background: `linear-gradient(135deg, ${box.gradientFrom}, ${box.gradientTo})`,
          boxShadow: `0 10px 30px ${box.gradientFrom}35`
        }}
      >
        <ShoppingBag size={20} />
        Add to Cart
      </button>
    </div>
  );
}
