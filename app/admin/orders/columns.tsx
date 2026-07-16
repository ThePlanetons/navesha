"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type Order = {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  total: number;
  status: string;
  paid_at: string | null;
  created_at: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_number",
    header: "Order Number",
    cell: ({ row }) => (
      <Link
        href={`/admin/orders/${row.original.id}`}
        className="font-medium text-red-500 hover:underline"
      >
        {row.original.order_number}
      </Link>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) =>
      `${row.original.first_name} ${row.original.last_name ?? ""}`,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `₹${Number(row.original.total).toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "paid"
            ? "default"
            : "secondary"
        }
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "payment",
    header: "Payment",
    cell: ({ row }) => row.original.paid_at ? "Paid" : "Pending",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
];