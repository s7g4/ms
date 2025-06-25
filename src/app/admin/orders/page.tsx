"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type PaymentStatus = "PAID" | "UNPAID" | "REFUNDED";

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  payment: PaymentStatus;
  status: OrderStatus;
  date: string;
}

const MOCK_ORDERS: Order[] = [
  { id: "#ORD-1001", customer: "Priya Sharma", email: "priya@gmail.com", items: 3, total: 1197, payment: "PAID", status: "PENDING", date: "2026-06-25" },
  { id: "#ORD-1002", customer: "Rahul Mehta", email: "rahul@gmail.com", items: 1, total: 399, payment: "PAID", status: "SHIPPED", date: "2026-06-25" },
  { id: "#ORD-1003", customer: "Anjali Kumar", email: "anjali@outlook.com", items: 2, total: 1598, payment: "PAID", status: "DELIVERED", date: "2026-06-24" },
  { id: "#ORD-1004", customer: "Vikram Das", email: "vikram@yahoo.com", items: 1, total: 199, payment: "UNPAID", status: "CANCELLED", date: "2026-06-24" },
  { id: "#ORD-1005", customer: "Sneha Patel", email: "sneha@gmail.com", items: 4, total: 2396, payment: "PAID", status: "PROCESSING", date: "2026-06-24" },
  { id: "#ORD-1006", customer: "Arjun Nair", email: "arjun@gmail.com", items: 2, total: 798, payment: "PAID", status: "SHIPPED", date: "2026-06-23" },
  { id: "#ORD-1007", customer: "Kavya Reddy", email: "kavya@gmail.com", items: 1, total: 799, payment: "PAID", status: "DELIVERED", date: "2026-06-23" },
  { id: "#ORD-1008", customer: "Ravi Krishnan", email: "ravi@yahoo.com", items: 3, total: 1197, payment: "PAID", status: "PENDING", date: "2026-06-23" },
  { id: "#ORD-1009", customer: "Meera Joshi", email: "meera@gmail.com", items: 2, total: 998, payment: "UNPAID", status: "PENDING", date: "2026-06-22" },
  { id: "#ORD-1010", customer: "Deepak Singh", email: "deepak@gmail.com", items: 1, total: 499, payment: "PAID", status: "PROCESSING", date: "2026-06-22" },
  { id: "#ORD-1011", customer: "Pooja Agarwal", email: "pooja@outlook.com", items: 5, total: 2995, payment: "PAID", status: "SHIPPED", date: "2026-06-21" },
  { id: "#ORD-1012", customer: "Suresh Babu", email: "suresh@gmail.com", items: 2, total: 1598, payment: "REFUNDED", status: "CANCELLED", date: "2026-06-21" },
  { id: "#ORD-1013", customer: "Lakshmi Iyer", email: "lakshmi@gmail.com", items: 1, total: 399, payment: "PAID", status: "DELIVERED", date: "2026-06-20" },
  { id: "#ORD-1014", customer: "Nikhil Gupta", email: "nikhil@gmail.com", items: 3, total: 1797, payment: "PAID", status: "SHIPPED", date: "2026-06-20" },
  { id: "#ORD-1015", customer: "Swati Mishra", email: "swati@yahoo.com", items: 2, total: 798, payment: "PAID", status: "DELIVERED", date: "2026-06-19" },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
  PAID: { label: "Paid", className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  PROCESSING: { label: "Processing", className: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
  SHIPPED: { label: "Shipped", className: "bg-purple-500/10 text-accent-purple border border-purple-500/20" },
  DELIVERED: { label: "Delivered", className: "bg-green-500/10 text-green-400 border border-green-500/20" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { className: string }> = {
  PAID: { className: "text-green-400" },
  UNPAID: { className: "text-yellow-400" },
  REFUNDED: { className: "text-red-400" },
};

const PAGE_SIZE = 8;
type DateFilter = "all" | "today" | "week" | "month";

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const today = new Date("2026-06-26");
  const todayStr = today.toISOString().split("T")[0];
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today); monthAgo.setDate(monthAgo.getDate() - 30);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
      const orderDate = new Date(o.date);
      const matchDate =
        dateFilter === "all" ? true :
        dateFilter === "today" ? o.date === todayStr :
        dateFilter === "week" ? orderDate >= weekAgo :
        orderDate >= monthAgo;
      return matchSearch && matchStatus && matchDate;
    });
  }, [orders, search, statusFilter, dateFilter, todayStr, weekAgo, monthAgo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    shipped: orders.filter(o => o.status === "SHIPPED").length,
    delivered: orders.filter(o => o.status === "DELIVERED").length,
  };

  function updateStatus(id: string, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setStatusDropdownOpen(null);
  }

  const dateButtons: { label: string; value: DateFilter }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-jakarta mb-2">Order Management</h1>
        <p className="text-text-muted">Track, update, and manage all customer orders in one place.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "text-accent-purple", bg: "bg-purple-500/10" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Shipped", value: stats.shipped, icon: Truck, color: "text-accent-purple", bg: "bg-purple-500/10" },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
        ].map(s => (
          <div key={s.label} className="glass p-5 rounded-2xl border border-purple-500/20 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-text-muted text-xs mb-0.5">{s.label}</p>
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="glass rounded-2xl border border-purple-500/20 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by Order ID or customer name…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 text-sm"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as OrderStatus | "ALL"); setPage(1); }}
            className="input-field text-sm md:w-48 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>

          {/* Date Buttons */}
          <div className="flex gap-2">
            {dateButtons.map(b => (
              <button
                key={b.value}
                onClick={() => { setDateFilter(dateFilter === b.value ? "all" : b.value); setPage(1); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  dateFilter === b.value
                    ? "bg-accent-purple text-white"
                    : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-2xl border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase border-b border-purple-500/20 bg-white/[0.02]">
              <tr>
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="py-3.5 px-4 font-semibold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-text-muted">
                    No orders match your filters.
                  </td>
                </tr>
              ) : paginated.map(order => (
                <tr key={order.id} className="border-b border-purple-500/10 hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-accent-purple">{order.id}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-text-primary">{order.customer}</p>
                      <p className="text-xs text-text-muted">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-text-muted">{order.items} item{order.items !== 1 ? "s" : ""}</td>
                  <td className="py-4 px-4 font-semibold">{formatPrice(order.total)}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-semibold ${PAYMENT_CONFIG[order.payment].className}`}>
                      ● {order.payment}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 px-4 text-text-muted text-xs whitespace-nowrap">{formatDate(order.date)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg bg-white/5 hover:bg-accent-purple/20 hover:text-accent-purple transition-colors" title="View Order">
                        <Eye size={14} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdownOpen(statusDropdownOpen === order.id ? null : order.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 text-text-muted hover:text-text-primary"
                          title="Update Status"
                        >
                          <RefreshCw size={14} />
                          <ChevronDown size={10} />
                        </button>
                        {statusDropdownOpen === order.id && (
                          <div className="absolute right-0 top-8 z-50 glass-card rounded-xl overflow-hidden min-w-[140px] shadow-2xl shadow-black/50">
                            {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
                              <button
                                key={s}
                                onClick={() => updateStatus(order.id, s)}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-2 ${
                                  order.status === s ? "text-accent-purple font-semibold" : "text-text-muted"
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].className.split(" ")[1]}`} />
                                {STATUS_CONFIG[s].label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-purple-500/20">
          <p className="text-xs text-text-muted">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  page === n
                    ? "bg-accent-purple text-white"
                    : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
