import { ReactNode } from "react";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { LayoutDashboard, Package, Users, Settings, Tags, LineChart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Stack Your Scoops",
  description: "Administrative control panel.",
};

const adminNavItems: NavItem[] = [
  { name: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { name: "Analytics", href: "/admin/analytics", icon: <LineChart size={18} /> },
  { name: "Orders", href: "/admin/orders", icon: <Package size={18} /> },
  { name: "Products", href: "/admin/products", icon: <Tags size={18} /> },
  { name: "Customers", href: "/admin/customers", icon: <Users size={18} /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell navItems={adminNavItems} title="Command Center">
      {children}
    </DashboardShell>
  );
}
