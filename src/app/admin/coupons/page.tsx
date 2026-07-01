import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";


export const dynamic = "force-dynamic";

// Server action to create a new coupon
async function createCoupon(formData: FormData) {
  "use server";

  const code = formData.get("code")?.toString().toUpperCase().trim();
  const type = formData.get("type")?.toString();
  const value = parseFloat(formData.get("value")?.toString() || "0");
  const minOrderVal = formData.get("minOrder")?.toString();
  const maxDiscountVal = formData.get("maxDiscount")?.toString();
  const usageLimitVal = formData.get("usageLimit")?.toString();
  const expiresAtVal = formData.get("expiresAt")?.toString();

  if (!code || !type || isNaN(value)) return;

  const minOrder = minOrderVal ? parseFloat(minOrderVal) : null;
  const maxDiscount = maxDiscountVal ? parseFloat(maxDiscountVal) : null;
  const usageLimit = usageLimitVal ? parseInt(usageLimitVal) : null;
  const expiresAt = expiresAtVal ? new Date(expiresAtVal) : null;

  await prisma.coupon.create({
    data: {
      code,
      type: type as "PERCENT" | "FIXED" | "FREE_SHIPPING",
      value,
      minOrder,
      maxDiscount,
      usageLimit,
      expiresAt,
      isActive: true,
    },
  });

  revalidatePath("/admin/coupons");
}

// Server action to delete/archive a coupon
async function toggleCoupon(id: string, active: boolean) {
  "use server";
  await prisma.coupon.update({
    where: { id },
    data: { isActive: active },
  });
  revalidatePath("/admin/coupons");
}

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[oklch(0.4_0.1_350)]">Coupons Management</h1>
          <p className="text-sm text-[oklch(0.45_0.03_350)] mt-1">
            Create and monitor discount coupons for your customer orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form */}
        <div className="lg:col-span-1 glass border border-[oklch(0.4_0.1_350_/_0.1)] rounded-2xl p-6 space-y-6 h-fit bg-white">
          <h2 className="text-xl font-bold text-[oklch(0.4_0.1_350)]">Create New Coupon</h2>
          
          <form action={createCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                name="code"
                placeholder="e.g. SUMMER50"
                required
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider mb-2">
                  Discount Type
                </label>
                <select
                  name="type"
                  required
                  className="input-field text-sm"
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider mb-2">
                  Value
                </label>
                <input
                  type="number"
                  name="value"
                  placeholder="10"
                  step="0.01"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider mb-2">
                  Min Order (₹)
                </label>
                <input
                  type="number"
                  name="minOrder"
                  placeholder="Optional"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider mb-2">
                  Max Discount (₹)
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  placeholder="Optional"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  placeholder="Unlimited"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiresAt"
                  className="input-field text-sm"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              Add Coupon
            </button>
          </form>
        </div>

        {/* Coupon Listings Table */}
        <div className="lg:col-span-2 glass border border-[oklch(0.4_0.1_350_/_0.1)] rounded-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[oklch(0.4_0.1_350_/_0.08)] bg-[oklch(0.92_0.05_15_/_0.3)]">
                  <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Code</th>
                  <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Discount</th>
                  <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Redeemed</th>
                  <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Expiry</th>
                  <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-[oklch(0.45_0.03_350)]">
                      No coupons created yet.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                    return (
                      <tr
                        key={coupon.id}
                        className="border-b border-[oklch(0.4_0.1_350_/_0.04)] hover:bg-[oklch(0.92_0.05_15_/_0.25)] transition-colors"
                      >
                        <td className="p-4 font-mono font-bold text-[oklch(0.4_0.1_350)]">{coupon.code}</td>
                        <td className="p-4 text-sm text-[oklch(0.25_0.05_350)]">{coupon.type}</td>
                        <td className="p-4 text-sm text-[oklch(0.25_0.05_350)] font-semibold">
                          {coupon.type === "PERCENT" ? `${coupon.value}%` : `₹${coupon.value}`}
                        </td>
                        <td className="p-4 text-sm text-[oklch(0.25_0.05_350)]">
                          {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ""}
                        </td>
                        <td className="p-4 text-sm text-[oklch(0.25_0.05_350)]">
                          {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                        </td>
                        <td className="p-4 text-sm">
                          {isExpired ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                              Expired
                            </span>
                          ) : coupon.isActive ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                              Paused
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-right">
                          <form action={toggleCoupon.bind(null, coupon.id, !coupon.isActive)}>
                            <button
                              type="submit"
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                                coupon.isActive
                                  ? "border-red-200 text-red-600 hover:bg-red-50"
                                  : "border-green-200 text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {coupon.isActive ? "Pause" : "Activate"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
