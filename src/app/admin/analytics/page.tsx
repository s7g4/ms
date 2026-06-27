import { prisma } from "@/lib/db";
import { AnalyticsCharts } from "./AnalyticsCharts";

export default async function AdminAnalyticsPage() {
  // 1. Gather all time metrics
  const totalOrders = await prisma.order.count();
  const paidOrders = await prisma.order.count({ where: { paymentStatus: "PAID" } });
  
  const revenueAggregate = await prisma.order.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { total: true },
  });
  const totalRevenue = revenueAggregate._sum.total || 0;

  const usersCount = await prisma.user.count({ where: { role: "USER" } });

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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[oklch(0.4_0.1_350)]">Store Analytics</h1>
        <p className="text-sm text-[oklch(0.45_0.03_350)] mt-1">
          Review sales performance, conversions, and catalog health.
        </p>
      </div>

      {/* Top Aggregated metrics banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white">
          <p className="text-[oklch(0.45_0.03_350)] text-xs uppercase tracking-wider font-semibold mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-[oklch(0.4_0.1_350)]">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white">
          <p className="text-[oklch(0.45_0.03_350)] text-xs uppercase tracking-wider font-semibold mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-[oklch(0.4_0.1_350)]">{totalOrders} ({paidOrders} Paid)</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white">
          <p className="text-[oklch(0.45_0.03_350)] text-xs uppercase tracking-wider font-semibold mb-1">Active Customers</p>
          <p className="text-2xl font-bold text-[oklch(0.4_0.1_350)]">{usersCount}</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white">
          <p className="text-[oklch(0.45_0.03_350)] text-xs uppercase tracking-wider font-semibold mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold text-[oklch(0.4_0.1_350)]">
            ₹{paidOrders > 0 ? Math.round(totalRevenue / paidOrders).toLocaleString("en-IN") : 0}
          </p>
        </div>
      </div>

      {/* Recharts wrapper */}
      <AnalyticsCharts salesData={salesData} rarityData={rarityData} />
    </div>
  );
}
