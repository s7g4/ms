"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import Image from "next/image";

export type InventoryData = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  isActive: boolean;
};

const columns: ColumnDef<InventoryData>[] = [
  {
    accessorKey: "sku",
    header: "SKU / Barcode",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold px-2 py-1 bg-black/40 border border-white/10 rounded">
        {row.getValue("sku") || row.getValue("id").substring(0, 8)}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-medium text-text-primary">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Current Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      if (stock <= 0) {
        return <span className="text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded">OUT OF STOCK (0)</span>;
      }
      if (stock < 20) {
        return <span className="text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded">LOW ({stock})</span>;
      }
      return <span className="text-green-400 font-bold">{stock}</span>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("isActive") as boolean;
      return active ? (
        <span className="text-accent-teal text-xs">Active</span>
      ) : (
        <span className="text-text-muted text-xs">Inactive</span>
      );
    }
  },
  {
    id: "actions",
    cell: () => {
      return (
        <button 
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-colors border border-white/10"
        >
          Update Stock
        </button>
      );
    }
  }
];

export function InventoryTable({ data }: { data: InventoryData[] }) {
  return (
    <DataTable columns={columns} data={data} searchKey="name" />
  );
}
