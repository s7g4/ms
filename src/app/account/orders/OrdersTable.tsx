"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "lucide-react";

export type OrderData = {
  id: string;
  createdAt: Date;
  total: number;
  status: string;
  itemCount: number;
};

const columns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-muted">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "MMM d, yyyy");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusColor = (s: string) => {
        switch (s) {
          case "DELIVERED": return "text-green-400 bg-green-400/10 border-green-400/20";
          case "PENDING": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
          case "SHIPPED": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
          case "CANCELLED": return "text-red-400 bg-red-400/10 border-red-400/20";
          default: return "text-purple-400 bg-purple-400/10 border-purple-400/20";
        }
      };
      
      return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(status)}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "itemCount",
    header: "Items",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      return <span className="font-semibold">{formatPrice(row.getValue("total"))}</span>;
    },
  },
];

export function OrdersTable({ data }: { data: OrderData[] }) {
  return (
    <DataTable columns={columns} data={data} searchKey="id" />
  );
}
