"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Order Number
              </TableHead>

              <TableHead>
                Customer
              </TableHead>

              <TableHead>
                Phone
              </TableHead>

              <TableHead>
                Total
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Payment
              </TableHead>

              <TableHead>
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
              >
                <TableCell className="font-medium">
                  {order.order_number}
                </TableCell>

                <TableCell>
                  {order.first_name}{" "}
                  {order.last_name}
                </TableCell>

                <TableCell>
                  {order.phone}
                </TableCell>

                <TableCell>
                  ₹{Number(order.total).toLocaleString()}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={order.status === "paid" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  {order.paid_at
                    ? "Paid"
                    : "Pending"}
                </TableCell>

                <TableCell>
                  {new Date(
                    order.created_at
                  ).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}