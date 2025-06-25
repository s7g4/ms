import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Award, Gift, ShoppingBag, ArrowUpRight, Copy } from "lucide-react";
import CopyReferralButton from "./CopyReferralButton";

export const metadata: Metadata = { title: "My Profile | MysteryScoop" };

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  // Fetch complete user data
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: {
      orders: {
        include: {
          items: {
            include: { mysteryBox: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      referrals: {
        include: {
          referee: {
            select: { name: true, createdAt: true },
          },
        },
      },
      rewardTx: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/register?ref=${user.referralCode}`;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-jakarta mb-2">Hello, {user.name}! 👋</h1>
        <p className="text-text-muted">Welcome to your magical mystery box account dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loyalty Points */}
        <div className="glass p-6 rounded-3xl border border-purple-500/20 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm mb-1">Stardust Points</p>
            <p className="text-4xl font-extrabold text-accent-purple font-grotesk">
              {user.loyaltyPoints}
            </p>
            <p className="text-xs text-accent-teal mt-2">Level: Bronze Tier 🌟</p>
          </div>
          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
            <Award className="w-8 h-8 text-accent-purple" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass p-6 rounded-3xl border border-purple-500/20 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm mb-1">Total Orders</p>
            <p className="text-4xl font-extrabold text-accent-pink font-grotesk">
              {user.orders.length}
            </p>
            <p className="text-xs text-text-muted mt-2">Unboxing experiences</p>
          </div>
          <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20">
            <ShoppingBag className="w-8 h-8 text-accent-pink" />
          </div>
        </div>

        {/* Referrals */}
        <div className="glass p-6 rounded-3xl border border-purple-500/20 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm mb-1">Successful Invites</p>
            <p className="text-4xl font-extrabold text-accent-teal font-grotesk">
              {user.referrals.filter((r) => r.status === "REWARDED").length}
            </p>
            <p className="text-xs text-text-muted mt-2">Invited friends to unbox</p>
          </div>
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/20">
            <Gift className="w-8 h-8 text-accent-teal" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Referral Program & Points Ledger */}
        <div className="lg:col-span-5 space-y-8">
          {/* Referral Panel */}
          <div className="glass-card p-6 md:p-8 rounded-3xl">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Gift className="text-accent-purple animate-bounce" /> Invite Friends
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Share the magic! Give your friends a link to register. They will earn 500 bonus
              points on checkout, and you get 500 points when they complete their first order!
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-text-muted mb-2">YOUR REFERRAL CODE</p>
                <div className="p-3.5 bg-black/20 rounded-2xl text-center border border-purple-500/20 font-mono tracking-widest text-lg font-bold text-accent-pink">
                  {user.referralCode}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-muted mb-2">REFERRAL LINK</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="input-field text-xs flex-1 truncate font-mono py-2 bg-black/20 opacity-80"
                  />
                  <CopyReferralButton link={referralLink} />
                </div>
              </div>
            </div>
          </div>

          {/* Stardust History */}
          <div className="glass-card p-6 md:p-8 rounded-3xl">
            <h3 className="font-bold text-lg mb-6">Point Transactions</h3>
            {user.rewardTx.length === 0 ? (
              <p className="text-text-muted text-sm">No points history yet. Make a purchase or invite friends to earn points!</p>
            ) : (
              <div className="space-y-4">
                {user.rewardTx.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-medium text-text-primary">{tx.description}</p>
                      <p className="text-xs text-text-muted">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-bold ${tx.points > 0 ? "text-accent-teal" : "text-accent-pink"}`}>
                      {tx.points > 0 ? `+${tx.points}` : tx.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Order History */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-3xl">
          <h3 className="font-bold text-xl mb-6">Order History</h3>

          {user.orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
              <p className="text-text-muted text-sm mb-6">You haven&apos;t placed any orders yet.</p>
              <Link href="/mystery-scoops" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold">
                Shop Mystery Scoops ✨
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-purple-500/10 bg-white/5 space-y-4 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-purple-500/10">
                    <div>
                      <p className="text-xs text-text-muted">Order ID</p>
                      <p className="font-mono text-sm font-bold text-text-primary">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Date</p>
                      <p className="text-sm font-medium text-text-primary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Total</p>
                      <p className="text-sm font-bold text-accent-pink">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-wider
                          ${
                            order.status === "PENDING"
                              ? "bg-yellow-500/15 text-yellow-400"
                              : order.status === "CONFIRMED" || order.status === "PACKED"
                              ? "bg-blue-500/15 text-blue-400"
                              : order.status === "SHIPPED"
                              ? "bg-purple-500/15 text-accent-purple"
                              : order.status === "DELIVERED"
                              ? "bg-green-500/15 text-accent-teal"
                              : "bg-red-500/15 text-red-400"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span>🎁</span>
                          <span className="font-semibold text-text-primary">{item.mysteryBox.name}</span>
                          <span className="text-xs text-text-muted">x{item.quantity}</span>
                        </div>
                        <span className="text-text-muted">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <Link
                      href={`/profile/orders?id=${order.id}`}
                      className="text-xs font-semibold text-accent-purple hover:underline flex items-center gap-1"
                    >
                      Track Order & View Contents <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
