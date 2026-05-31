"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/context/cart-provider";

import { Button } from "@/components/ui/button";
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import { Product } from "../featured-collections/[slug]/_components/collection-products-view";

export default function CartDrawer() {
  const router = useRouter();

  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);

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
          `/api/landing/cart/products?skus=${skus}`
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

  const cartItems =
    useMemo(() => {
      return cart
        .map(
          (cartItem) => {
            const product =
              products.find(
                (product) => product.sku === cartItem.sku
              );

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
          quantity: number;
          product: Product;
        }[];
    }, [
      cart,
      products,
    ]);

  const subtotal =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        item.product.price *
        item.quantity,
      0
    );

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
        ) : cartItems.length ===
          0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="text-muted-foreground h-12 w-12" />

            <div>
              <h3 className="font-semibold">
                Your cart is
                empty
              </h3>

              <p className="text-muted-foreground text-sm">
                Add products
                to get
                started
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map(
              (
                item
              ) => {
                const thumbnail =
                  item.product.collection_product_images?.find(
                    (
                      image
                    ) =>
                      image.image_role ===
                      "thumbnail"
                  )
                    ?.image_url;

                return (
                  <div
                    key={
                      item.sku
                    }
                    className="flex gap-3 rounded-2xl border p-3"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted">
                      {thumbnail && (
                        <Image
                          src={
                            thumbnail
                          }
                          alt={
                            item
                              .product
                              .name
                          }
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h4 className="line-clamp-2 font-medium">
                        {
                          item
                            .product
                            .name
                        }
                      </h4>

                      <p className="mt-1 font-semibold">
                        ₹
                        {item.product.price.toLocaleString()}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8"
                            onClick={() =>
                              decreaseQuantity(
                                item.sku
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="min-w-6 text-center text-sm font-medium">
                            {
                              item.quantity
                            }
                          </span>

                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8"
                            onClick={() =>
                              addToCart(
                                item.sku
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            removeFromCart(
                              item.sku
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
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
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>
                Subtotal
              </span>

              <span>
                ₹
                {subtotal.toLocaleString()}
              </span>
            </div>

            <Button className="w-full rounded-xl"
              onClick={() =>
                router.push(`/checkout`)
              }
            >
              Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={
                clearCart
              }
            >
              Clear Cart
            </Button>
          </div>
        )}
    </DrawerContent>
  );
}