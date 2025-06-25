"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Users,
  Activity,
  UserPlus,
  Crown,
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  ShoppingBag,
  MapPin,
  Gift,
  Star,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

type CustomerStatus = "Active" | "Suspended";

interface MiniOrder {
  id: string;
  date: string;
  total: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joined: string;
  status: CustomerStatus;
  loyaltyPoints: number;
  referralCode: string;
  address: string;
  recentOrders: MiniOrder[];
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "U001", name: "Priya Sharma", email: "priya@gmail.com", phone: "+91 98765 43210",
    totalOrders: 12, totalSpent: 8749, joined: "2025-03-15", status: "Active",
    loyaltyPoints: 2620, referralCode: "PRIYA8X2K",
    address: "42, Koramangala 4th Block, Bengaluru – 560034",
    recentOrders: [
      { id: "#ORD-1001", date: "2026-06-25", total: 1197, status: "PENDING" },
      { id: "#ORD-0987", date: "2026-06-10", total: 799, status: "DELIVERED" },
      { id: "#ORD-0876", date: "2026-05-28", total: 399, status: "DELIVERED" },
    ],
  },
  {
    id: "U002", name: "Rahul Mehta", email: "rahul@gmail.com", phone: "+91 97654 32109",
    totalOrders: 5, totalSpent: 2499, joined: "2025-08-22", status: "Active",
    loyaltyPoints: 745, referralCode: "RAHUL7PQR",
    address: "15, Andheri West, Mumbai – 400058",
    recentOrders: [
      { id: "#ORD-1002", date: "2026-06-25", total: 399, status: "SHIPPED" },
      { id: "#ORD-0950", date: "2026-06-05", total: 649, status: "DELIVERED" },
      { id: "#ORD-0821", date: "2026-05-12", total: 999, status: "DELIVERED" },
    ],
  },
  {
    id: "U003", name: "Anjali Kumar", email: "anjali@outlook.com", phone: "+91 96543 21098",
    totalOrders: 18, totalSpent: 14320, joined: "2024-12-01", status: "Active",
    loyaltyPoints: 5210, referralCode: "ANJU5KMR",
    address: "88, Jubilee Hills, Hyderabad – 500033",
    recentOrders: [
      { id: "#ORD-1003", date: "2026-06-24", total: 1598, status: "DELIVERED" },
      { id: "#ORD-0990", date: "2026-06-12", total: 899, status: "DELIVERED" },
      { id: "#ORD-0940", date: "2026-06-01", total: 749, status: "DELIVERED" },
    ],
  },
  {
    id: "U004", name: "Vikram Das", email: "vikram@yahoo.com", phone: "+91 95432 10987",
    totalOrders: 2, totalSpent: 399, joined: "2026-06-01", status: "Suspended",
    loyaltyPoints: 0, referralCode: "VKRM3DSW",
    address: "32, Salt Lake City, Kolkata – 700091",
    recentOrders: [
      { id: "#ORD-1004", date: "2026-06-24", total: 199, status: "CANCELLED" },
      { id: "#ORD-0912", date: "2026-06-08", total: 199, status: "CANCELLED" },
    ],
  },
  {
    id: "U005", name: "Sneha Patel", email: "sneha@gmail.com", phone: "+91 94321 09876",
    totalOrders: 9, totalSpent: 6120, joined: "2025-05-11", status: "Active",
    loyaltyPoints: 1830, referralCode: "SNHA6PTL",
    address: "7, Navrangpura, Ahmedabad – 380009",
    recentOrders: [
      { id: "#ORD-1005", date: "2026-06-24", total: 2396, status: "PROCESSING" },
      { id: "#ORD-0965", date: "2026-06-08", total: 799, status: "DELIVERED" },
      { id: "#ORD-0900", date: "2026-05-25", total: 499, status: "DELIVERED" },
    ],
  },
  {
    id: "U006", name: "Arjun Nair", email: "arjun@gmail.com", phone: "+91 93210 98765",
    totalOrders: 7, totalSpent: 4899, joined: "2025-07-30", status: "Active",
    loyaltyPoints: 1470, referralCode: "ARJN4NR8",
    address: "22, Kakkanad, Kochi – 682030",
    recentOrders: [
      { id: "#ORD-1006", date: "2026-06-23", total: 798, status: "SHIPPED" },
      { id: "#ORD-0930", date: "2026-05-30", total: 999, status: "DELIVERED" },
      { id: "#ORD-0870", date: "2026-05-15", total: 599, status: "DELIVERED" },
    ],
  },
  {
    id: "U007", name: "Kavya Reddy", email: "kavya@gmail.com", phone: "+91 92109 87654",
    totalOrders: 15, totalSpent: 11250, joined: "2024-10-20", status: "Active",
    loyaltyPoints: 3375, referralCode: "KVYA2RDY",
    address: "56, Banjara Hills, Hyderabad – 500034",
    recentOrders: [
      { id: "#ORD-1007", date: "2026-06-23", total: 799, status: "DELIVERED" },
      { id: "#ORD-0980", date: "2026-06-11", total: 1199, status: "DELIVERED" },
      { id: "#ORD-0920", date: "2026-05-28", total: 649, status: "DELIVERED" },
    ],
  },
  {
    id: "U008", name: "Ravi Krishnan", email: "ravi@yahoo.com", phone: "+91 91098 76543",
    totalOrders: 3, totalSpent: 1497, joined: "2026-04-14", status: "Active",
    loyaltyPoints: 450, referralCode: "RAVI9KSN",
    address: "11, T. Nagar, Chennai – 600017",
    recentOrders: [
      { id: "#ORD-1008", date: "2026-06-23", total: 1197, status: "PENDING" },
      { id: "#ORD-0845", date: "2026-05-10", total: 199, status: "DELIVERED" },
    ],
  },
  {
    id: "U009", name: "Meera Joshi", email: "meera@gmail.com", phone: "+91 90987 65432",
    totalOrders: 4, totalSpent: 2196, joined: "2026-05-05", status: "Active",
    loyaltyPoints: 660, referralCode: "MERA3JSI",
    address: "4, Shivaji Nagar, Pune – 411005",
    recentOrders: [
      { id: "#ORD-1009", date: "2026-06-22", total: 998, status: "PENDING" },
      { id: "#ORD-0935", date: "2026-06-01", total: 799, status: "DELIVERED" },
    ],
  },
  {
    id: "U010", name: "Deepak Singh", email: "deepak@gmail.com", phone: "+91 89876 54321",
    totalOrders: 6, totalSpent: 3594, joined: "2025-11-18", status: "Active",
    loyaltyPoints: 1080, referralCode: "DPAK5SGH",
    address: "78, Karol Bagh, New Delhi – 110005",
    recentOrders: [
      { id: "#ORD-1010", date: "2026-06-22", total: 499, status: "PROCESSING" },
      { id: "#ORD-0960", date: "2026-06-06", total: 999, status: "DELIVERED" },
      { id: "#ORD-0850", date: "2026-05-12", total: 749, status: "DELIVERED" },
    ],
  },
  {
    id: "U011", name: "Pooja Agarwal", email: "pooja@outlook.com", phone: "+91 88765 43210",
    totalOrders: 21, totalSpent: 19800, joined: "2024-08-03", status: "Active",
    loyaltyPoints: 5940, referralCode: "PUJA7AGR",
    address: "33, Vaishali Nagar, Jaipur – 302021",
    recentOrders: [
      { id: "#ORD-1011", date: "2026-06-21", total: 2995, status: "SHIPPED" },
      { id: "#ORD-0975", date: "2026-06-10", total: 1199, status: "DELIVERED" },
      { id: "#ORD-0910", date: "2026-05-25", total: 899, status: "DELIVERED" },
    ],
  },
  {
    id: "U012", name: "Nikhil Gupta", email: "nikhil@gmail.com", phone: "+91 87654 32109",
    totalOrders: 8, totalSpent: 5992, joined: "2025-09-09", status: "Active",
    loyaltyPoints: 1800, referralCode: "NKHL2GUP",
    address: "19, Gomti Nagar, Lucknow – 226010",
    recentOrders: [
      { id: "#ORD-1014", date: "2026-06-20", total: 1797, status: "SHIPPED" },
      { id: "#ORD-0955", date: "2026-06-04", total: 799, status: "DELIVERED" },
      { id: "#ORD-0888", date: "2026-05-20", total: 649, status: "DELIVERED" },
    ],
  },
];

const STATUS_ORDER_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400",
  PROCESSING: "text-orange-400",
  SHIPPED: "text-accent-purple",
  DELIVERED: "text-green-400",
  CANCELLED: "text-red-400",
};

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const gradients = [
    "linear-gradient(135deg, #b06cf0, #ff6eb4)",
    "linear-gradient(135deg, #00d4aa, #00b4d8)",
    "linear-gradient(135deg, #ffd166, #ff6eb4)",
    "linear-gradient(135deg, #ff6eb4, #b06cf0)",
    "linear-gradient(135deg, #6366f1, #00d4aa)",
  ];
  const gradient = gradients[name.charCodeAt(0) % gradients.length];
  const cls = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${cls} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ background: gradient }}>
      {initials}
    </div>
  );
}

function loyaltyTier(points: number) {
  if (points >= 5000) return { label: "Platinum", color: "text-slate-300" };
  if (points >= 2000) return { label: "Gold", color: "text-yellow-400" };
  if (points >= 500) return { label: "Silver", color: "text-text-muted" };
  return { label: "Bronze", color: "text-orange-400" };
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  const filtered = useMemo(() =>
    customers.filter(c =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    ), [customers, search]);

  const stats = {
    total: customers.length,
    activeToday: customers.filter(c => c.status === "Active").length,
    newThisMonth: customers.filter(c => new Date(c.joined) >= new Date("2026-06-01")).length,
    vip: customers.filter(c => c.loyaltyPoints >= 2000).length,
  };

  function toggleSuspend(id: string) {
    setCustomers(prev => prev.map(c => c.id === id
      ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" }
      : c
    ));
  }

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-jakarta mb-2">Customer Management</h1>
        <p className="text-text-muted">View and manage your customer base, loyalty tiers, and order history.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-accent-purple", bg: "bg-purple-500/10" },
          { label: "Active Today", value: stats.activeToday, icon: Activity, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "New This Month", value: stats.newThisMonth, icon: UserPlus, color: "text-accent-teal", bg: "bg-teal-500/10" },
          { label: "VIP Customers", value: stats.vip, icon: Crown, color: "text-yellow-400", bg: "bg-yellow-500/10" },
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name, email, or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Customer Table */}
      <div className="glass rounded-2xl border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase border-b border-purple-500/20 bg-white/[0.02]">
              <tr>
                {["Customer", "Contact", "Orders", "Total Spent", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="py-3.5 px-4 font-semibold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-text-muted">No customers match your search.</td>
                </tr>
              ) : filtered.map(c => {
                const tier = loyaltyTier(c.loyaltyPoints);
                const isExpanded = expandedId === c.id;
                return (
                  <>
                    <tr
                      key={c.id}
                      className={`border-b border-purple-500/10 cursor-pointer transition-colors ${isExpanded ? "bg-purple-500/5" : "hover:bg-white/[0.03]"}`}
                      onClick={() => toggleExpand(c.id)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.name} />
                          <div>
                            <p className="font-medium text-text-primary">{c.name}</p>
                            <span className={`text-[10px] font-bold ${tier.color}`}>
                              ★ {tier.label}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-text-primary text-xs">{c.email}</p>
                        <p className="text-text-muted text-xs">{c.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag size={13} className="text-text-muted" />
                          <span className="font-medium">{c.totalOrders}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-accent-purple">{formatPrice(c.totalSpent)}</td>
                      <td className="py-4 px-4 text-text-muted text-xs whitespace-nowrap">{formatDate(c.joined)}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs font-semibold ${c.status === "Active" ? "text-green-400" : "text-red-400"}`}>
                          ● {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-accent-purple/20 hover:text-accent-purple text-text-muted transition-colors" title="View Profile">
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-text-muted transition-colors" title="Send Email">
                            <Mail size={14} />
                          </button>
                          <button
                            onClick={() => toggleSuspend(c.id)}
                            className={`p-1.5 rounded-lg transition-colors ${c.status === "Active" ? "bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-text-muted" : "bg-green-500/10 text-green-400"}`}
                            title={c.status === "Active" ? "Suspend" : "Activate"}
                          >
                            {c.status === "Active" ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                          </button>
                          <span className="text-text-muted ml-1">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr key={`${c.id}-expanded`} className="bg-purple-500/[0.03] border-b border-purple-500/10">
                        <td colSpan={7} className="px-6 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Recent Orders */}
                            <div className="md:col-span-2 space-y-3">
                              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent Orders</p>
                              <div className="space-y-2">
                                {c.recentOrders.map(o => (
                                  <div key={o.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                                    <span className="font-mono text-xs text-accent-purple">{o.id}</span>
                                    <span className="text-xs text-text-muted">{formatDate(o.date)}</span>
                                    <span className="text-xs font-semibold">{formatPrice(o.total)}</span>
                                    <span className={`text-[10px] font-bold uppercase ${STATUS_ORDER_COLORS[o.status] ?? "text-text-muted"}`}>{o.status}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Address on File</p>
                                <div className="flex gap-2">
                                  <MapPin size={13} className="text-text-muted shrink-0 mt-0.5" />
                                  <p className="text-xs text-text-primary">{c.address}</p>
                                </div>
                              </div>
                              <div className="flex gap-6">
                                <div>
                                  <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><Gift size={11} /> Referral</p>
                                  <p className="font-mono text-xs font-bold text-accent-pink">{c.referralCode}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><Star size={11} /> Loyalty</p>
                                  <p className={`text-xs font-bold ${loyaltyTier(c.loyaltyPoints).color}`}>{c.loyaltyPoints.toLocaleString("en-IN")} pts</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
