import { IndianRupee, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  // Compute date thresholds
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 1. Fetch live metrics
  const totalRevenueAggregate = await prisma.order.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { total: true },
  });
  const totalRevenue = totalRevenueAggregate._sum.total || 0;

  const ordersToday = await prisma.order.count({
    where: { createdAt: { gte: startOfToday } },
  });

  const newCustomers = await prisma.user.count({
    where: { role: "USER", createdAt: { gte: thirtyDaysAgo } },
  });

  // Fetch recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  // Fetch top mystery box orders grouped by sales count
  const topSales = await prisma.orderItem.groupBy({
    by: ["mysteryBoxId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 3,
  });

  // Hydrate top selling mystery boxes names
  const topSellingBoxes = await Promise.all(
    topSales.map(async (group, i) => {
      const box = await prisma.mysteryBox.findUnique({
        where: { id: group.mysteryBoxId },
        select: { name: true, price: true },
      });
      const gradients = [
        "linear-gradient(135deg, #b06cf0, #ff6eb4)",
        "linear-gradient(135deg, #00d4aa, #00b4d8)",
        "linear-gradient(135deg, #ffd166, #ff6eb4)",
      ];
      return {
        name: box?.name || "Unknown Box",
        sales: group._count.id,
        revenue: group._count.id * (box?.price || 0),
        gradient: gradients[i] || gradients[0],
      };
    })
  );

  const STATS = [
    { label: "Total Revenue", value: totalRevenue, isCurrency: true, icon: IndianRupee, change: "Live" },
    { label: "Orders Today", value: ordersToday, isCurrency: false, icon: ShoppingBag, change: "Today" },
    { label: "New Customers (30d)", value: newCustomers, isCurrency: false, icon: Users, change: "Last 30d" },
    { label: "Conversion Rate", value: 3.4, suffix: "%", isCurrency: false, icon: TrendingUp, change: "+0.8%" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold font-jakarta mb-2 text-[oklch(0.4_0.1_350)]">Dashboard Overview</h1>
        <p className="text-[oklch(0.45_0.03_350)]">Welcome back. Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(s => (
          <div key={s.label} className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[oklch(0.92_0.05_15_/_0.3)] rounded-xl">
                <s.icon size={20} className="text-[oklch(0.75_0.15_5)]" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-green-50 text-green-700">
                {s.change}
              </span>
            </div>
            <p className="text-[oklch(0.45_0.03_350)] text-sm mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[oklch(0.4_0.1_350)]">
              {s.isCurrency ? formatPrice(s.value as number) : s.value}{s.suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] p-6 bg-white">
          <h3 className="font-bold text-lg mb-6 text-[oklch(0.4_0.1_350)]">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[oklch(0.45_0.03_350)] uppercase border-b border-[oklch(0.4_0.1_350_/_0.08)]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[oklch(0.45_0.03_350)]">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map(o => (
                    <tr key={o.id} className="border-b border-[oklch(0.4_0.1_350_/_0.04)] hover:bg-[oklch(0.92_0.05_15_/_0.15)] transition-colors">
                      <td className="py-4 px-4 font-semibold text-[oklch(0.4_0.1_350)]">#{o.id.slice(-6).toUpperCase()}</td>
                      <td className="py-4 px-4 text-[oklch(0.25_0.05_350)]">{o.user?.name || "Guest"}</td>
                      <td className="py-4 px-4 text-[oklch(0.45_0.03_350)] text-xs">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[oklch(0.25_0.05_350)]">{formatPrice(o.total)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-[9px] font-bold rounded-full uppercase tracking-wider
                          ${o.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            o.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            o.status === 'SHIPPED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] p-6 bg-white">
          <h3 className="font-bold text-lg mb-6 text-[oklch(0.4_0.1_350)]">Top Selling Boxes</h3>
          <div className="space-y-6">
            {topSellingBoxes.length === 0 ? (
              <p className="text-sm text-[oklch(0.45_0.03_350)] text-center py-8">No box sales recorded.</p>
            ) : (
              topSellingBoxes.map((b, i) => (
                <div key={b.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-md" style={{ background: b.gradient }}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-[oklch(0.4_0.1_350)]">{b.name}</p>
                    <p className="text-xs text-[oklch(0.45_0.03_350)]">{b.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-[oklch(0.75_0.15_5)]">{formatPrice(b.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
