import { IndianRupee, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

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
    where: { role: "CUSTOMER", createdAt: { gte: thirtyDaysAgo } },
  });

  // Fetch recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
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
        "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30",
        "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-400 border border-teal-500/30",
        "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30",
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-jakarta mb-1">Business Overview</h1>
        <p className="text-text-muted text-sm">Welcome back to the Command Center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s, i) => {
          const isPositive = s.change.startsWith("+") || s.change === "Live" || s.change === "Today" || s.change === "Last 30d";
          return (
            <div key={s.label} className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-text-primary">
                  <s.icon size={20} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {s.change}
                </span>
              </div>
              <div>
                <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-3xl font-extrabold text-white font-grotesk">
                  {s.isCurrency ? formatPrice(s.value as number) : s.value}{s.suffix}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 bg-black/20">
          <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
            <span>Recent Orders</span>
            <a href="/admin/orders" className="text-xs font-semibold text-accent-purple hover:text-purple-400">View All →</a>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 rounded-r-lg font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => {
                  const getStatusColor = (s: string) => {
                    switch (s) {
                      case "DELIVERED": return "text-green-400 bg-green-500/10 border-green-500/20";
                      case "PENDING": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
                      case "PAID": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
                      default: return "text-purple-400 bg-purple-500/10 border-purple-500/20";
                    }
                  };
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{order.user.name}</p>
                        <p className="text-xs text-text-muted">{order.user.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-text-muted">{format(new Date(order.createdAt), "MMM d, h:mm a")}</td>
                      <td className="px-4 py-4 text-right font-semibold">{formatPrice(order.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 bg-black/20">
          <h3 className="font-bold text-lg mb-6">Top Performers</h3>
          <div className="space-y-4">
            {topSellingBoxes.length > 0 ? (
              topSellingBoxes.map((box, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex items-center justify-between ${box.gradient}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold opacity-50">#{idx + 1}</div>
                    <div>
                      <p className="font-semibold">{box.name}</p>
                      <p className="text-xs opacity-80">{box.sales} units sold</p>
                    </div>
                  </div>
                  <div className="font-bold">
                    {formatPrice(box.revenue)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted text-center py-8">No sales data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
