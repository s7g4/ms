import { ReactNode } from "react";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { PackageSearch, ListTodo, Barcode, Warehouse } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouse Operations | Stack Your Scoops",
  description: "Fulfillment and inventory management.",
};

const warehouseNavItems: NavItem[] = [
  { name: "Overview", href: "/warehouse", icon: <Warehouse size={18} /> },
  { name: "Packing Queue", href: "/warehouse/queue", icon: <ListTodo size={18} /> },
  { name: "Scan & Pack", href: "/warehouse/scan", icon: <Barcode size={18} /> },
  { name: "Inventory", href: "/warehouse/inventory", icon: <PackageSearch size={18} /> },
];

export default function WarehouseLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell navItems={warehouseNavItems} title="Fulfillment Center">
      {children}
    </DashboardShell>
  );
}
