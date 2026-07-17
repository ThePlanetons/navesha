"use client";

import Image from "next/image";

import {
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Separator,
} from "@/components/ui/separator";

import {
  Package,
} from "lucide-react";

type OrderItem = {
  id: string;
  product_name: string;
  product_sku: string;
  size: "A3" | "A4" | "A5";
  price: number;
  quantity: number;
  image?: string;
};

type Props = {
  items: OrderItem[];
};

export function ProductsTable({
  items,
}: Props) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="h-5 w-5 text-red-500" />

          Ordered Products
        </CardTitle>
      </CardHeader>

      <div className="px-6 pb-6">

        <div className="rounded-2xl border">

          {/* Header */}

          <div className="grid grid-cols-12 gap-4 border-b bg-muted/40 px-5 py-4 text-sm font-semibold">

            <div className="col-span-6">
              Product
            </div>

            <div className="col-span-1 text-center">
              Size
            </div>

            <div className="col-span-2 text-right">
              Price
            </div>

            <div className="col-span-1 text-center">
              Qty
            </div>

            <div className="col-span-2 text-right">
              Total
            </div>

          </div>

          {items.map((item, index) => {

            const total =
              item.price * item.quantity;

            return (
              <div
                key={item.id}
              >

                <div className="grid grid-cols-12 gap-4 px-5 py-5">

                  {/* Product */}

                  <div className="col-span-6 flex gap-4">

                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border bg-muted">

                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}

                    </div>

                    <div className="space-y-1">

                      <h3 className="font-semibold">
                        {item.product_name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        SKU: {item.product_sku}
                      </p>

                    </div>

                  </div>

                  {/* Size */}

                  <div className="col-span-1 flex items-center justify-center">

                    <Badge
                      variant="secondary"
                      className="rounded-full"
                    >
                      {item.size}
                    </Badge>

                  </div>

                  {/* Price */}

                  <div className="col-span-2 flex items-center justify-end font-medium">

                    ₹{item.price.toLocaleString()}

                  </div>

                  {/* Qty */}

                  <div className="col-span-1 flex items-center justify-center">

                    {item.quantity}

                  </div>

                  {/* Total */}

                  <div className="col-span-2 flex items-center justify-end font-semibold">

                    ₹{total.toLocaleString()}

                  </div>

                </div>

                {index !== items.length - 1 && (
                  <Separator />
                )}

              </div>
            );
          })}

        </div>

      </div>
    </>
  );
}