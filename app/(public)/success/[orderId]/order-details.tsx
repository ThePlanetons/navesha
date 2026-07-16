import Link from "next/link";
import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase/admin";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrderDetails({ params, }: { params: Promise<{ orderId: string; }>; }) {
  const { orderId } = await params;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(`
        id,
        order_number,
        status,
        total,
        first_name,
        last_name,
        order_items (
          id,
          product_sku,
          product_name,
          price,
          quantity
        )
      `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card className="rounded-3xl py-0 gap-0 border-dashed">
        <CardContent className="space-y-6 p-6 py-7">
          <div className="text-center">
            <div className="mb-4 text-5xl">
              🎉
            </div>

            <h1 className="text-3xl font-bold">
              Payment Successful
            </h1>

            <p className="text-muted-foreground mt-2">
              Thank you for your order.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border p-4">
            <p>
              <strong>Order Number:</strong>{" "}
              {order.order_number}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{order.status}</span>
            </p>

            <p>
              <strong>Customer:</strong>{" "}
              {order.first_name}{" "}
              {order.last_name}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Items
            </h2>

            <div className="space-y-3">
              {order.order_items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.product_name}
                      </p>

                      <p className="text-muted-foreground text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold">
            <span>Total</span>

            <span>
              ₹
              {Number(
                order.total
              ).toLocaleString()}
            </span>
          </div>

          <Button asChild className="w-full">
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}