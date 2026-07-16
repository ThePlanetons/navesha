"use client";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CreditCard,
  CalendarDays,
  Receipt,
  ShieldCheck,
} from "lucide-react";

type Props = {
  order: {
    payment_method?: string | null;
    razorpay_payment_id?: string | null;
    razorpay_order_id?: string | null;
    paid_at?: string | null;
    status: string;
  };
};

export function PaymentCard({
  order,
}: Props) {
  const isPaid = !!order.paid_at;

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-red-500" />

          Payment Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Payment Status */}
        <div className="flex items-center justify-between rounded-2xl border bg-muted/30 p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Payment Status
            </p>

            <p className="mt-1 font-semibold">
              {isPaid
                ? "Payment Received"
                : "Awaiting Payment"}
            </p>
          </div>

          <Badge
            className="rounded-full"
            variant={
              isPaid
                ? "default"
                : "secondary"
            }
          >
            {isPaid
              ? "Paid"
              : "Pending"}
          </Badge>
        </div>

        {/* Payment Method */}
        <div className="flex gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />

          <div>
            <p className="text-sm text-muted-foreground">
              Payment Method
            </p>

            <p className="font-medium">
              {order.payment_method ??
                "Razorpay"}
            </p>
          </div>
        </div>

        {/* Razorpay Payment ID */}
        <div className="flex gap-3">
          <Receipt className="mt-1 h-5 w-5 text-muted-foreground" />

          <div>
            <p className="text-sm text-muted-foreground">
              Razorpay Payment ID
            </p>

            <p className="break-all font-mono text-sm">
              {order.razorpay_payment_id ??
                "-"}
            </p>
          </div>
        </div>

        {/* Razorpay Order ID */}
        <div className="flex gap-3">
          <Receipt className="mt-1 h-5 w-5 text-muted-foreground" />

          <div>
            <p className="text-sm text-muted-foreground">
              Razorpay Order ID
            </p>

            <p className="break-all font-mono text-sm">
              {order.razorpay_order_id ??
                "-"}
            </p>
          </div>
        </div>

        {/* Paid Date */}
        <div className="flex gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-muted-foreground" />

          <div>
            <p className="text-sm text-muted-foreground">
              Paid On
            </p>

            <p className="font-medium">
              {order.paid_at
                ? new Date(order.paid_at).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}