import { ReactNode } from "react";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { User, ShoppingBag, Settings, Gift, Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Stack Your Scoops",
  description: "Manage your mystery box orders and account details.",
};

const customerNavItems: NavItem[] = [
  { name: "Overview", href: "/account", icon: <User size={18} /> },
  { name: "My Orders", href: "/account/orders", icon: <ShoppingBag size={18} /> },
  { name: "Rewards & Referrals", href: "/account/rewards", icon: <Gift size={18} /> },
  { name: "Wishlist", href: "/wishlist", icon: <Heart size={18} /> },
  { name: "Settings", href: "/account/settings", icon: <Settings size={18} /> },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell navItems={customerNavItems} title="Customer Account">
      {children}
    </DashboardShell>
  );
}
