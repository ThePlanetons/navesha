"use client";

import { Suspense, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

type Order = {
  id: string;
  order_number: string;

  first_name: string;
  last_name: string | null;

  email: string | null;
  phone: string;

  total: number;

  status: string;

  payment_method: string | null;

  paid_at: string | null;

  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "/api/admin/orders"
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <p className="text-muted-foreground">
            Manage customer orders and track statuses.
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Search order..."
            className="max-w-sm"
          />

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="pending">
                Pending
              </SelectItem>

              <SelectItem value="paid">
                Paid
              </SelectItem>

              <SelectItem value="shipped">
                Shipped
              </SelectItem>

              <SelectItem value="delivered">
                Delivered
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Suspense>
        <DataTable
          columns={columns}
          data={orders}
        />
      </Suspense>
    </div>
  );
}