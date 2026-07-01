import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Award, ShoppingBag, Gift } from "lucide-react";
import CopyReferralButton from "@/app/(storefront)/profile/CopyReferralButton";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
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
      orders: { select: { id: true } },
      referrals: { select: { id: true, status: true } },
    },
  });

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/register?ref=${user.referralCode}`;
  const successfulReferrals = user.referrals.filter((r) => r.status === "REWARDED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-jakarta mb-1">Hello, {user.name}! 👋</h1>
        <p className="text-text-muted text-sm">Welcome to your Stack Your Scoops dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Loyalty Points */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">Stardust Points</p>
            <p className="text-3xl font-extrabold text-accent-purple font-grotesk">{user.loyaltyPoints}</p>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-accent-purple" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-extrabold text-accent-pink font-grotesk">{user.orders.length}</p>
          </div>
          <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-accent-pink" />
          </div>
        </div>

        {/* Referrals */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">Successful Invites</p>
            <p className="text-3xl font-extrabold text-accent-teal font-grotesk">{successfulReferrals}</p>
          </div>
          <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-accent-teal" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Card */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Gift className="text-accent-purple w-5 h-5" /> Invite Friends
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Share the magic! Give your friends a link to register. They get 500 bonus points on checkout, and you get 500 points when they complete their first order!
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-text-muted mb-1">YOUR REFERRAL CODE</p>
              <div className="p-3 bg-purple-500/10 rounded-xl text-center border border-purple-500/20 font-mono tracking-widest text-lg font-bold text-accent-pink">
                {user.referralCode}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-text-muted mb-1">REFERRAL LINK</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="input-field text-xs flex-1 truncate font-mono py-2 bg-black/20"
                />
                <CopyReferralButton link={referralLink} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
