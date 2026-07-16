"use client";

import { useState, useTransition } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import {
  Label,
} from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Printer,
  Save,
  Truck,
  PackageCheck,
} from "lucide-react";

import { toast } from "sonner";

type Props = {
  order: {
    id: string;
    status: string;
  };
};

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderActions({
  order,
}: Props) {
  const [status, setStatus] =
    useState(order.status);

  const [isPending, startTransition] =
    useTransition();

  const saveStatus = () => {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/orders/${order.id}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

        if (!res.ok) {
          throw new Error();
        }

        toast.success(
          "Order status updated"
        );
      } catch {
        toast.error(
          "Failed to update order"
        );
      }
    });
  };

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackageCheck className="h-5 w-5 text-red-500" />

          Order Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="space-y-2">

          <Label>
            Order Status
          </Label>

          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>

              {STATUSES.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="capitalize"
                >
                  {item}
                </SelectItem>
              ))}

            </SelectContent>
          </Select>

        </div>

        <Button
          onClick={saveStatus}
          disabled={isPending}
          className="w-full rounded-xl bg-red-500 hover:bg-red-600"
        >
          <Save className="mr-2 h-4 w-4" />

          {isPending
            ? "Saving..."
            : "Save Status"}
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-xl"
          onClick={() =>
            window.print()
          }
        >
          <Printer className="mr-2 h-4 w-4" />

          Print Order
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-xl"
          disabled
        >
          <Truck className="mr-2 h-4 w-4" />

          Generate Shipping Label
          <span className="ml-2 text-xs text-muted-foreground">
            Soon
          </span>
        </Button>

      </CardContent>
    </Card>
  );
}