import { IndianRupee, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const STATS = [
  { label: "Total Revenue", value: 125000, isCurrency: true, icon: IndianRupee, change: "+12.5%" },
  { label: "Orders Today", value: 45, isCurrency: false, icon: ShoppingBag, change: "+5.2%" },
  { label: "New Customers", value: 12, isCurrency: false, icon: Users, change: "-2.1%" },
  { label: "Conversion Rate", value: 3.4, suffix: "%", isCurrency: false, icon: TrendingUp, change: "+0.8%" },
];

const RECENT_ORDERS = [
  { id: "#ORD-001", customer: "Priya S.", date: "2 mins ago", total: 799, status: "PENDING" },
  { id: "#ORD-002", customer: "Rahul M.", date: "15 mins ago", total: 399, status: "PAID" },
  { id: "#ORD-003", customer: "Anjali K.", date: "1 hour ago", total: 1598, status: "SHIPPED" },
  { id: "#ORD-004", customer: "Vikram D.", date: "3 hours ago", total: 199, status: "DELIVERED" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold font-jakarta mb-2">Dashboard Overview</h1>
        <p className="text-text-muted">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(s => (
          <div key={s.label} className="glass p-6 rounded-2xl border border-purple-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <s.icon size={20} className="text-accent-purple" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${s.change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {s.change}
              </span>
            </div>
            <p className="text-text-muted text-sm mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-text-primary">
              {s.isCurrency ? formatPrice(s.value as number) : s.value}{s.suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl border border-purple-500/20 p-6">
          <h3 className="font-bold text-lg mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase border-b border-purple-500/20">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map(o => (
                  <tr key={o.id} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-medium">{o.id}</td>
                    <td className="py-4 px-4">{o.customer}</td>
                    <td className="py-4 px-4 text-text-muted">{o.date}</td>
                    <td className="py-4 px-4">{formatPrice(o.total)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                        ${o.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                          o.status === 'PAID' ? 'bg-blue-500/10 text-blue-400' :
                          o.status === 'SHIPPED' ? 'bg-purple-500/10 text-accent-purple' :
                          'bg-green-500/10 text-accent-teal'
                        }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl border border-purple-500/20 p-6">
          <h3 className="font-bold text-lg mb-6">Top Selling Boxes</h3>
          <div className="space-y-6">
            {[
              { name: "Classic Scoop", sales: 124, revenue: 49476, gradient: "linear-gradient(135deg, #b06cf0, #ff6eb4)" },
              { name: "Starter Scoop", sales: 89, revenue: 17711, gradient: "linear-gradient(135deg, #00d4aa, #00b4d8)" },
              { name: "Premium Scoop", sales: 32, revenue: 25568, gradient: "linear-gradient(135deg, #ffd166, #ff6eb4)" },
            ].map((b, i) => (
              <div key={b.name} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-lg" style={{ background: b.gradient }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{b.name}</p>
                  <p className="text-xs text-text-muted">{b.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm gradient-text">{formatPrice(b.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
