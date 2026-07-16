"use client";

import {
  CardContent,
} from "@/components/ui/card";

import {
  Separator,
} from "@/components/ui/separator";

type Props = {
  order: {
    subtotal: number;
    discount_amount?: number | null;
    shipping_amount: number;
    total: number;
  };
};

export function OrderSummary({
  order,
}: Props) {
  const subtotal = Number(order.subtotal);

  const discount = Number(
    order.discount_amount ?? 0
  );

  const shipping = Number(
    order.shipping_amount
  );

  const total = Number(order.total);

  return (
    <CardContent className="flex justify-end p-6">
      <div className="w-full max-w-md space-y-4">

        <h3 className="text-lg font-semibold">
          Order Summary
        </h3>

        <Separator />

        <div className="space-y-3">

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Subtotal
            </span>

            <span>
              ₹{subtotal.toLocaleString()}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span>
                Buy 4 Get 1 Discount
              </span>

              <span>
                -₹{discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Shipping
            </span>

            <span>
              {shipping === 0
                ? "FREE"
                : `₹${shipping.toLocaleString()}`}
            </span>
          </div>

        </div>

        <Separator />

        <div className="flex items-center justify-between text-xl font-bold">
          <span>
            Grand Total
          </span>

          <span className="text-red-500">
            ₹{total.toLocaleString()}
          </span>
        </div>

      </div>
    </CardContent>
  );
}