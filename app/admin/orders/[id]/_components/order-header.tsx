"use client";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Printer,
} from "lucide-react";
import { Order } from "./customer-card";

type Props = {
  order: Order;
};

const statusVariant = (
  status: string
):
  | "default"
  | "secondary"
  | "destructive"
  | "outline" => {
  switch (status) {
    case "paid":
    case "processing":
    case "shipped":
    case "delivered":
      return "default";

    case "cancelled":
      return "destructive";

    default:
      return "secondary";
  }
};

export function OrderHeader({
  order,
}: Props) {
  return (
    <div className="rounded-3xl border bg-background p-8 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

        {/* Left */}
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              NAVESHA
            </h1>

            <p className="text-muted-foreground mt-1">
              Premium Personalized Posters
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">
              Order Number
            </p>

            <p className="text-xl font-semibold">
              {order.order_number}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start gap-6 lg:items-end">

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" />

            Print
          </Button>

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="min-w-36 text-left lg:text-right">
              <p className="text-muted-foreground text-sm">
                Created
              </p>

              <p className="font-medium">
                {new Date(order.created_at).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="min-w-36 text-left lg:text-right">
              <p className="text-muted-foreground text-sm">
                Payment
              </p>

              <Badge
                variant={
                  order.paid_at
                    ? "default"
                    : "secondary"
                }
                className="mt-1 rounded-full"
              >
                {order.paid_at
                  ? "Paid"
                  : "Pending"}
              </Badge>
            </div>

            <div className="min-w-36 text-left lg:text-right">
              <p className="text-muted-foreground text-sm">
                Order Status
              </p>

              <Badge
                variant={statusVariant(
                  order.status
                )}
                className="mt-1 rounded-full capitalize"
              >
                {order.status}
              </Badge>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}