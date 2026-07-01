import { prisma } from "@/lib/db";
import { InventoryTable } from "./InventoryTable";
import { PackageSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WarehouseInventoryPage() {
  const products = await prisma.catalogProduct.findMany({
    orderBy: { name: "asc" },
  });

  const formattedInventory = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.id.substring(0, 8).toUpperCase(), // Placeholder SKU logic
    stock: product.stock,
    isActive: product.isActive,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center border border-teal-500/20">
          <PackageSearch size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-jakarta">Inventory Management</h1>
          <p className="text-sm text-text-muted">Track available stock and update counts across the warehouse.</p>
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl p-2 border border-white/5 shadow-xl">
        <InventoryTable data={formattedInventory} />
      </div>
    </div>
  );
}
