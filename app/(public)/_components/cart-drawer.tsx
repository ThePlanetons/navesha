"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Minus, Plus, Trash2 } from "lucide-react";

import { PosterSize, useCart } from "@/contexts/cart-provider";

import { Button } from "@/components/ui/button";
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";

import { Product } from "../featured-collections/[slug]/_components/collection-products-view";
import { PosterPrices, usePosterPrices } from "@/contexts/poster-prices-provider";
import { Separator } from "@/components/ui/separator";

type CartDrawerProps = {
  onCheckout: () => void;
};

export default function CartDrawer({ onCheckout, }: CartDrawerProps) {
  const router = useRouter();

  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);

  const { prices } = usePosterPrices();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (cart.length === 0) {
          setProducts([]);
          return;
        }

        setLoading(true);

        const skus =
          cart
            .map(
              (item) =>
                item.sku
            )
            .join(",");

        const response = await fetch(
          `/api/landing/checkout/cart?skus=${skus}`
        );

        const data = await response.json();

        setProducts(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cart]);

  const cartItems = useMemo(() => {
    return cart
      .map(
        (cartItem) => {
          const product = products.find((product) => product.sku === cartItem.sku);

          if (!product) {
            return null;
          }

          return {
            ...cartItem,
            product,
          };
        }
      )
      .filter(
        Boolean
      ) as {
        sku: string;
        size: PosterSize,
        quantity: number;
        product: Product;
      }[];
  }, [
    cart,
    products,
  ]);

  const quantityBySize = cartItems.reduce(
    (acc, item) => {
      acc[item.size] = (acc[item.size] ?? 0) + item.quantity;
      return acc;
    },
    {} as Record<PosterSize, number>
  );

  const freeBySize = Object.fromEntries(
    Object.entries(quantityBySize).map(([size, quantity]) => [
      size,
      Math.floor(quantity / 5),
    ])
  ) as Record<PosterSize, number>;

  const discount = Object.entries(freeBySize).reduce(
    (total, [size, freeItems]) =>
      total + freeItems * prices[size as PosterSize],
    0
  );

  const subtotal = cartItems.reduce((total, item) => {
    const price =
      prices[item.size as keyof PosterPrices];

    return total + price * item.quantity;
  }, 0);

  const finalSubtotal = subtotal - discount;

  return (
    <DrawerContent className="ml-auto flex h-full w-full max-w-md flex-col">
      <DrawerHeader className="border-b">
        <DrawerTitle>
          Shopping Cart
        </DrawerTitle>
      </DrawerHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({
              length: 3,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="flex gap-3 rounded-2xl border p-3"
                >
                  <div className="h-20 w-20 animate-pulse rounded-xl bg-muted" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 animate-pulse rounded bg-muted" />

                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />

                    <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : cartItems.length === 0 ? (
          <Card className="rounded-3xl py-0 gap-0 border-dashed">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="text-4xl">
                🛒
              </div>

              <h1 className="text-2xl font-bold">
                Your cart is empty
              </h1>

              <p className="text-muted-foreground">
                Add some products before proceeding to checkout.
              </p>

              <Button
                onClick={() => {
                  onCheckout();

                  router.push("/");
                }}
                className="rounded-xl"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartItems.map(
              (item) => {
                const thumbnail = item.product.collection_product_images?.find(
                  (image) => image.image_role === "thumbnail"
                )?.image_url;

                const itemPrice = prices[item.size as keyof PosterPrices];

                const itemComparePrice = Math.round(itemPrice * 1.5);

                const compareLineTotal = itemComparePrice * item.quantity;

                const lineTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={`${item.sku}-${item.size}`}
                    className="flex gap-3 rounded-2xl border p-3"
                  >
                    <div className="relative h-[6rem] w-24 overflow-hidden rounded-xl bg-muted">
                      {thumbnail && (
                        <Image
                          src={thumbnail}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <h4 className="line-clamp-2 font-semibold">
                          {item.product.name}
                        </h4>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            removeFromCart(item.sku, item.size)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Size: <span className="font-medium text-foreground">{item.size}</span>
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8"
                            onClick={() =>
                              decreaseQuantity(item.sku, item.size)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="min-w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8"
                            onClick={() =>
                              addToCart(item.sku, item.size)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm line-through">
                            ₹{compareLineTotal}
                          </span>

                          <span className="text-lg font-bold">
                            ₹{lineTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems.length >
        0 && (
          <div className="space-y-4 border-t p-4">
            {Object.entries(freeBySize).some(([, free]) => free > 0) && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                <p className="mb-2 text-sm font-semibold text-green-700">
                  🎉 Buy 4 Get 1 Free Applied
                </p>

                {Object.entries(freeBySize).map(([size, free]) =>
                  free > 0 ? (
                    <p
                      key={size}
                      className="text-sm text-green-700"
                    >
                      {size}: {free} free poster{free > 1 ? "s" : ""}
                    </p>
                  ) : null
                )}
              </div>
            )}

            <div className="space-y-2 text-right">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span>
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-green-600 text-sm">
                  <span>Buy 4 Get 1 Discount</span>

                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>

                <span>₹{finalSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <Button className="w-full rounded-xl"
              onClick={() => {
                onCheckout();

                router.push("/checkout");
              }}
            >
              Checkout
            </Button>

            {/* <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={
                clearCart
              }
            >
              Clear Cart
            </Button> */}
          </div>
        )
      }
    </DrawerContent >
  );
}