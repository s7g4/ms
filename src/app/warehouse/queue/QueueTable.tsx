"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { format } from "date-fns";

export type QueueData = {
  id: string;
  createdAt: Date;
  itemCount: number;
  priority: boolean;
};

const columns: ColumnDef<QueueData>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-text-primary">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Order Time",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "MMM d, h:mm a");
    },
  },
  {
    accessorKey: "itemCount",
    header: "Items to Pack",
  },
  {
    accessorKey: "priority",
    header: "SLA / Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as boolean;
      if (priority) {
        return <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">Express / Priority</span>;
      }
      return <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-white/5 text-text-muted border border-white/10">Standard</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <a 
          href={`/warehouse/scan?order=${row.getValue("id")}`}
          className="px-4 py-1.5 bg-accent-purple hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors"
        >
          Start Packing
        </a>
      );
    }
  }
];

export function QueueTable({ data }: { data: QueueData[] }) {
  return (
    <DataTable columns={columns} data={data} searchKey="id" />
  );
}
