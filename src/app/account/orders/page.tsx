import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrdersTable } from "./OrdersTable";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    total: order.total,
    status: order.status,
    itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-500/10 text-accent-purple rounded-xl flex items-center justify-center">
          <Package size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-jakarta">My Orders</h1>
          <p className="text-sm text-text-muted">Track, return, or view invoices for your past purchases.</p>
        </div>
      </div>

      <OrdersTable data={formattedOrders} />
    </div>
  );
}
