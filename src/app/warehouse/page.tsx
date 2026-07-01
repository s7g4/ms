import { prisma } from "@/lib/db";
import { Package, Truck, Clock, AlertTriangle, ListTodo } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WarehouseOverviewPage() {
  const [
    pendingOrders,
    packingOrders,
    readyToShipOrders,
    lowStockItems
  ] = await Promise.all([
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.order.count({ where: { status: "PACKING" } }),
    prisma.order.count({ where: { status: "PACKED" } }),
    prisma.product.count({ where: { stock: { lt: 10 } } })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-jakarta mb-1">Operations Overview</h1>
        <p className="text-text-muted text-sm">Real-time fulfillment metrics and queue status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Orders */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-blue-500 shadow-sm">
          <div>
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">To Pack</p>
            <p className="text-3xl font-extrabold text-white font-grotesk">{pendingOrders}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Packing in Progress */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-yellow-500 shadow-sm">
          <div>
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">In Progress</p>
            <p className="text-3xl font-extrabold text-white font-grotesk">{packingOrders}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-yellow-400" />
          </div>
        </div>

        {/* Ready to Ship */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-green-500 shadow-sm">
          <div>
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">Ready to Ship</p>
            <p className="text-3xl font-extrabold text-white font-grotesk">{readyToShipOrders}</p>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6 text-green-400" />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-red-500 shadow-sm">
          <div>
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">Low Stock Items</p>
            <p className="text-3xl font-extrabold text-red-400 font-grotesk">{lowStockItems}</p>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold text-lg mb-4">Urgent Actions</h3>
          {lowStockItems > 0 ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-400">Inventory Warning</p>
                <p className="text-sm text-text-muted mt-1">There are {lowStockItems} items with low stock. Please alert procurement to restock soon to avoid fulfillment delays.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted">No urgent actions required right now. Keep up the good work!</p>
          )}
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <div className="space-y-3">
            <a href="/warehouse/queue" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5 group">
              <span className="text-sm font-medium">View Packing Queue</span>
              <Package size={16} className="text-text-muted group-hover:text-white transition-colors" />
            </a>
            <a href="/warehouse/scan" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5 group">
              <span className="text-sm font-medium">Scan & Pack Barcodes</span>
              <ListTodo size={16} className="text-text-muted group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
