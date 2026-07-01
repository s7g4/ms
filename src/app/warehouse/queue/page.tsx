import { prisma } from "@/lib/db";
import { QueueTable } from "./QueueTable";
import { ListTodo } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WarehouseQueuePage() {
  const pendingOrders = await prisma.order.findMany({
    where: { 
      status: { in: ["CONFIRMED", "PACKING"] }
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const formattedQueue = pendingOrders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
    // A simplistic priority simulation: orders older than 24 hours are marked priority
    priority: (new Date().getTime() - order.createdAt.getTime()) > (24 * 60 * 60 * 1000)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
          <ListTodo size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-jakarta">Packing Queue</h1>
          <p className="text-sm text-text-muted">Orders waiting to be fulfilled, sorted by oldest first.</p>
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl p-2 border border-white/5 shadow-xl">
        <QueueTable data={formattedQueue} />
      </div>
    </div>
  );
}
