import { prisma } from "@/lib/db";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { formatPrice } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  // 1. Gather all time metrics
  const totalOrders = await prisma.order.count();
  const paidOrders = await prisma.order.count({ where: { paymentStatus: "PAID" } });
  
  const revenueAggregate = await prisma.order.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { total: true },
  });
  const totalRevenue = revenueAggregate._sum.total || 0;

  const usersCount = await prisma.user.count({ where: { role: "CUSTOMER" } });

  // 2. Build last 30 days daily sales history (dynamic aggregation)
  const now = new Date();
  const dailyDataMap = new Map<string, { date: string; revenue: number; orders: number }>();

  // Initialize last 30 days in the map to guarantee zero fills
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    dailyDataMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
  }

  // Fetch all orders from last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentOrders = await prisma.order.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { total: true, paymentStatus: true, createdAt: true },
  });

  // Populate actual data
  for (const order of recentOrders) {
    const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    if (dailyDataMap.has(dateStr)) {
      const day = dailyDataMap.get(dateStr)!;
      day.orders += 1;
      if (order.paymentStatus === "PAID") {
        day.revenue += order.total;
      }
    }
  }

  const salesData = Array.from(dailyDataMap.values());

  // 3. Product catalog rarity breakdowns
  const products = await prisma.product.groupBy({
    by: ["rarity"],
    _count: { id: true },
  });

  const rarityData = products.map((p) => ({
    name: p.rarity,
    value: p._count.id,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/10 text-accent-purple rounded-xl flex items-center justify-center">
          <TrendingUp size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-jakarta mb-1">Store Analytics</h1>
          <p className="text-sm text-text-muted">Review sales performance, conversions, and catalog health.</p>
        </div>
      </div>

      {/* Top Aggregated metrics banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/20">
          <p className="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1">Total Sales</p>
          <p className="text-2xl font-extrabold text-white font-grotesk">{formatPrice(totalRevenue)}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/20">
          <p className="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1">Total Orders</p>
          <p className="text-2xl font-extrabold text-white font-grotesk">{totalOrders} <span className="text-sm text-accent-teal font-medium">({paidOrders} Paid)</span></p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/20">
          <p className="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1">Active Customers</p>
          <p className="text-2xl font-extrabold text-white font-grotesk">{usersCount}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/20">
          <p className="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1">Avg Order Value</p>
          <p className="text-2xl font-extrabold text-white font-grotesk">
            {paidOrders > 0 ? formatPrice(Math.round(totalRevenue / paidOrders)) : formatPrice(0)}
          </p>
        </div>
      </div>

      {/* Recharts wrapper */}
      <div className="glass-card p-2 rounded-3xl border border-white/5 bg-black/20">
        <AnalyticsCharts salesData={salesData} rarityData={rarityData} />
      </div>
    </div>
  );
}
