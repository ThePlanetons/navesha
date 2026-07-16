"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { OrderHeader } from "./order-header";
import { CustomerCard, Order } from "./customer-card";
import { ShippingCard } from "./shipping-card";
import { ProductsTable } from "./products-table";
import { OrderSummary } from "./order-summary";
import { PaymentCard } from "./payment-card";
import { OrderActions } from "./order-actions";

type Props = {
  id: string;
};

export default function OrderDetailsPage({ id, }: Props) {
  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `/api/admin/orders/${id}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.message
        );
      }

      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderHeader order={order} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CustomerCard order={order} />

        <ShippingCard
          address={order.order_addresses?.[0]}
        />
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-0">
          <ProductsTable
            items={order.order_items}
          />

          <Separator />

          <OrderSummary order={order} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <PaymentCard order={order} />

        <OrderActions order={order} />
      </div>
    </div>
  );
}