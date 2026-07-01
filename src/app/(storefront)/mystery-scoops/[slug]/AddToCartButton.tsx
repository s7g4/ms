"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { Plus, Minus, ShoppingBag, Info, ChevronDown } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  // Default to Mega Scoop if available, or first variant, or mock variant
  const getInitialVariant = (): Variant => {
    if (variants.length > 0) {
      const mega = variants.find((v) => v.name.toLowerCase().includes("mega"));
      return mega || variants[0];
    }
    return {
      name: "Standard Scoop",
      price: box.price,
      mrpValue: box.mrpValue,
      minItems: box.minItems,
      maxItems: box.maxItems,
    };
  };

  const [selectedVariant, setSelectedVariant] = useState<Variant>(getInitialVariant());
  const [isOpen, setIsOpen] = useState(false);
  const [unwantedNote, setUnwantedNote] = useState("");
  const [wantedNote, setWantedNote] = useState("");
  const [quantity, setQuantity] = useState(1);



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
      wantedNote: box.slug === "personalised-custom-scoop" ? (wantedNote.trim() || undefined) : undefined,
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
        <div className="space-y-2 relative">
          <label className="block text-sm font-bold text-text-primary">
            Scoop Size
          </label>
          
          {/* Custom Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border bg-bg-card text-text-primary font-medium hover:border-accent-pink/40 transition-all focus:outline-none focus:ring-2 focus:ring-accent-pink cursor-pointer"
          >
            <span>
              {selectedVariant.name} — <span className="text-accent-pink font-extrabold">{formatPrice(selectedVariant.price)}</span>{" "}
              <span className="text-text-muted text-xs font-normal">(Worth {formatPrice(selectedVariant.mrpValue)})</span>
            </span>
            <ChevronDown size={18} className={cn("text-text-muted transition-transform duration-300", isOpen && "rotate-180")} />
          </button>

          {/* Custom Dropdown Options Menu */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop overlay to close on click outside */}
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 right-0 mt-1 bg-bg-card/95 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                >
                  {variants.map((v) => {
                    const isSelected = selectedVariant.name === v.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm font-medium transition-all flex items-center justify-between hover:bg-white/5",
                          isSelected ? "text-accent-pink bg-accent-pink/5" : "text-text-primary"
                        )}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{v.name}</span>
                          <span className="text-xs text-text-muted mt-0.5">Worth {formatPrice(v.mrpValue)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn("text-sm font-extrabold", isSelected ? "text-accent-pink" : "text-text-primary")}>
                            {formatPrice(v.price)}
                          </span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-accent-pink" />}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. Customization Text Area */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="custom-notes" className="block text-sm font-bold text-text-primary">
            Customize Your Scoop (Optional)
          </label>
          <span className="text-xs text-text-muted font-medium">
            {unwantedNote.length}/500
          </span>
        </div>
        <textarea
          id="custom-notes"
          value={unwantedNote}
          onChange={(e) => setUnwantedNote(e.target.value.slice(0, 500))}
          placeholder="Tell us your preferences! What themes do you love? Any colors or products you like or dislike? (e.g. Pastel pink theme, love washi tapes, dislike hair clips...)"
          className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg-primary text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-pink min-h-24 resize-none text-sm leading-relaxed"
        />
        <div className="flex items-start gap-1.5 text-xs text-text-muted">
          <Info size={14} className="shrink-0 text-accent-purple mt-0.5" />
          <p>
            Tell us about your likes, dislikes, favorite themes (kawaii, anime, etc.), or preferred colors. We will curate your stack to match your vibe!
          </p>
        </div>
      </div>

      {/* 3. Quantity Selector */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="block text-sm font-bold text-text-primary">
            Quantity
          </span>
        </div>
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
        className="w-full py-4.5 rounded-2xl text-lg font-bold text-white transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: `linear-gradient(135deg, ${box.gradientFrom}, ${box.gradientTo})`,
          boxShadow: `0 10px 30px ${box.gradientFrom}35`
        }}
      >
        <ShoppingBag size={20} /> Add to Cart
      </button>
    </div>
  );
}
