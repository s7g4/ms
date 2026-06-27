"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface RarityData {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  salesData: SalesData[];
  rarityData: RarityData[];
}

export function AnalyticsCharts({ salesData, rarityData }: AnalyticsChartsProps) {
  const COLORS = ["#4A1E35", "#E05A7A", "#FFC0CB", "#FFA07A"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Over Time (Line Chart) */}
      <div className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white space-y-4">
        <h3 className="text-lg font-bold text-[oklch(0.4_0.1_350)]">Revenue & Orders (Last 30 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.1 350 / 0.05)" />
              <XAxis dataKey="date" stroke="oklch(0.45 0.03 350)" fontSize={11} />
              <YAxis stroke="oklch(0.45 0.03 350)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid oklch(0.4 0.1 350 / 0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#E05A7A" strokeWidth={3} dot={false} name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Volume (Bar Chart) */}
      <div className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white space-y-4">
        <h3 className="text-lg font-bold text-[oklch(0.4_0.1_350)]">Orders Daily Volume</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.1 350 / 0.05)" />
              <XAxis dataKey="date" stroke="oklch(0.45 0.03 350)" fontSize={11} />
              <YAxis stroke="oklch(0.45 0.03 350)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid oklch(0.4 0.1 350 / 0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="orders" fill="#4A1E35" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Box Rarity Distribution (Pie Chart) */}
      <div className="glass p-6 rounded-2xl border border-[oklch(0.4_0.1_350_/_0.1)] bg-white space-y-4 lg:col-span-2">
        <h3 className="text-lg font-bold text-[oklch(0.4_0.1_350)]">Product Catalog Rarity Split</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rarityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rarityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid oklch(0.4 0.1 350 / 0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {rarityData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center justify-between border-b border-[oklch(0.4_0.1_350_/_0.05)] pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-semibold text-sm text-[oklch(0.4_0.1_350)]">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-[oklch(0.25_0.05_350)]">{entry.value} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
