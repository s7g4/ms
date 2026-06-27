import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";
import { prisma } from "@/lib/db";
import { Star, MessageSquare, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60; // Revalidate every minute

export default async function MysteryBoxPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const box = await prisma.mysteryBox.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
    include: {
      reviews: {
        where: { isVerified: true },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!box) notFound();

  // Calculate review stats
  const totalReviews = box.reviews.length;
  const averageRating =
    totalReviews > 0
      ? (box.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": box.name,
    "description": box.description,
    "image": "https://mysteryscoop.com/gift-icon.png",
    "offers": {
      "@type": "Offer",
      "price": box.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://mysteryscoop.com/mystery-scoops/${box.slug}`,
    },
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Visuals */}
        <div className="relative aspect-square rounded-3xl overflow-hidden flex items-center justify-center glass-card"
             style={{ background: `linear-gradient(135deg, ${box.gradientFrom}40, ${box.gradientTo}40)` }}>
          <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
          <div className="text-[150px] floating relative z-10" style={{ filter: `drop-shadow(0 0 50px ${box.gradientFrom}80)` }}>
            🎁
          </div>
          <div className="absolute bottom-6 flex gap-2">
            {["✨", "🌸", "⭐"].map((e,i) => (
              <span key={i} className="w-12 h-12 rounded-xl glass flex items-center justify-center text-xl">{e}</span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4"
               style={{ background: `linear-gradient(90deg, ${box.gradientFrom}, ${box.gradientTo})`, color: '#fff' }}>
            Worth ₹{box.mrpValue}+ Guaranteed
          </div>
          
          <h1 className="text-5xl font-bold font-jakarta mb-2">{box.name}</h1>
          <p className="text-xl text-accent-purple mb-4 font-medium">{box.tagline}</p>
          
          {/* Reviews Badges */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-text-primary text-sm">{averageRating}</span>
              <span className="text-xs text-text-muted">({totalReviews} reviews)</span>
            </div>
            <div className="w-px h-4 bg-purple-500/20" />
            <div className="flex items-center gap-1 text-xs text-accent-teal font-medium">
              <ShieldCheck size={14} /> Verified Purchases
            </div>
          </div>

          <p className="text-text-muted text-lg mb-8 leading-relaxed">
            {box.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass p-4 rounded-2xl border border-purple-500/20">
              <p className="text-text-muted text-sm mb-1">Items Inside</p>
              <p className="text-2xl font-bold text-text-primary">{box.minItems}-{box.maxItems}</p>
            </div>
            <div className="glass p-4 rounded-2xl border border-purple-500/20">
              <p className="text-text-muted text-sm mb-1">Theme</p>
              <p className="text-xl font-bold text-text-primary">{box.theme || "Kawaii Mix"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-purple-500/20">
            <div>
              <p className="text-text-muted text-sm mb-1">Price</p>
              <p className="text-5xl font-bold gradient-text font-grotesk">₹{box.price}</p>
            </div>
          </div>

          <AddToCartButton box={box} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 border-t border-purple-500/10 pt-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-jakarta mb-8 flex items-center gap-3">
          <MessageSquare className="text-accent-pink" /> Customer Reviews ✨
        </h2>

        {box.reviews.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <p className="text-text-muted">No reviews yet. Be the first to open this box and share the magic! 🎁</p>
          </div>
        ) : (
          <div className="space-y-6">
            {box.reviews.map((review) => (
              <div key={review.id} className="glass p-6 rounded-2xl border border-purple-500/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center font-bold text-white text-sm">
                      {review.user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{review.user.name}</p>
                      <p className="text-xs text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-current" : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {review.title && <h4 className="font-bold text-text-primary text-sm">{review.title}</h4>}
                  <p className="text-text-muted text-sm leading-relaxed">{review.body}</p>
                </div>

                {review.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-purple-500/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Review thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
