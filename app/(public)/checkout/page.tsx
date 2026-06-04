"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RazorpayConstructor, RazorpayResponse } from "@/types/razorpay";

import { useCart } from "@/context/cart-provider";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Product } from "../featured-collections/[slug]/_components/collection-products-view";

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  phone: z.string().min(10, "Phone number is required"),
  address_line_1: z.string().min(1, "Address is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postal_code: z.string().min(1, "Postal code is required"),
});

type FormValues = z.input<typeof formSchema>;

type CartItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const { clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const { cart } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);

        if (!cart.length) {
          setCartItems([]);
          return;
        }

        // Convert cart -> SKU list
        const skuList = cart.map((item) => item.sku).join(",");

        const res = await fetch(
          `/api/landing/checkout/cart?skus=${encodeURIComponent(skuList)}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();

        // Merge API product data + quantity
        const merged = data.map((product: Product) => {
          const cartItem = cart.find((c) => c.sku === product.sku);

          return {
            sku: product.sku,
            name: product.name,
            price: product.price,
            quantity: cartItem?.quantity || 0,
            image: product.collection_product_images?.[0]?.image_url,
          };
        });

        setCartItems(merged);
      } catch (err) {
        console.error("Cart fetch error:", err);
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [cart]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 1. LOADING STATE
  if (loadingCart) {
    return (
      <div className="mx-auto max-w-[60rem] px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-7">
          {/* FORM SKELETON */}
          <div className="space-y-6 lg:col-span-4">
            <Card className="rounded-3xl border-dashed py-0 gap-0">
              <CardContent className="space-y-4 p-6 py-7">
                <div className="bg-muted h-7 w-52 animate-pulse rounded" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted h-10 animate-pulse rounded" />
                  <div className="bg-muted h-10 animate-pulse rounded" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted h-10 animate-pulse rounded" />
                  <div className="bg-muted h-10 animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-dashed py-0 gap-0">
              <CardContent className="space-y-4 p-6 py-7">
                <div className="bg-muted h-7 w-48 animate-pulse rounded" />

                <div className="bg-muted h-10 animate-pulse rounded" />
                <div className="bg-muted h-10 animate-pulse rounded" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted h-10 animate-pulse rounded" />
                  <div className="bg-muted h-10 animate-pulse rounded" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted h-10 animate-pulse rounded" />
                  <div className="bg-muted h-10 animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SUMMARY SKELETON */}
          <div className="lg:col-span-3">
            <Card className="rounded-3xl border-dashed py-0 gap-0">
              <CardContent className="space-y-4 p-6 py-7">
                <div className="bg-muted h-7 w-40 animate-pulse rounded" />

                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-muted h-12 w-12 animate-pulse rounded-lg" />

                    <div className="flex-1 space-y-2">
                      <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-16 animate-pulse rounded" />
                    </div>

                    <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <Card className="rounded-3xl border-dashed py-0 gap-0">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="text-6xl">
              🛒
            </div>

            <h1 className="text-2xl font-bold">
              Your cart is empty
            </h1>

            <p className="text-muted-foreground">
              Add some products before proceeding to checkout.
            </p>

            <Button
              onClick={() => router.push("/")}
              className="rounded-xl"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    const payload = {
      customer: values,
      items: cartItems,
    };

    const res = await fetch("/api/landing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return;
    }

    // ---------------------------
    // OPEN RAZORPAY HERE
    // ---------------------------
    const options = {
      key: data.key,
      amount: data.amount * 100,
      currency: data.currency,
      order_id: data.razorpay_order_id,

      name: "Your Store",

      handler: async function (response: RazorpayResponse) {
        const verifyRes = await fetch("/api/landing/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            order_id: data.order_id,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok) {
          clearCart();

          router.push(`/success/${data.order_id}`);
        } else {
          console.error("Payment verification failed", verifyData);
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-[60rem] px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your order details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-7">
            {/* CHECKOUT */}
            <div className="space-y-6 lg:col-span-4">
              {/* Customer Information */}
              <Card className="rounded-3xl py-0 gap-0 border-dashed">
                <CardContent className="p-6 py-7">
                  <h2 className="mb-6 text-xl font-semibold">
                    Customer Information
                  </h2>

                  <FieldSet className="space-y-4 gap-0">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>First Name</FieldLabel>
                        <FieldContent>
                          <Input {...register("first_name")} />
                          {errors.first_name && (
                            <FieldError>
                              {errors.first_name.message}
                            </FieldError>
                          )}
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>Last Name (optional)</FieldLabel>
                        <FieldContent>
                          <Input {...register("last_name")} />
                        </FieldContent>
                      </Field>
                    </FieldGroup>

                    <FieldGroup>
                      <Field>
                        <FieldLabel>Email</FieldLabel>
                        <FieldContent>
                          <Input type="email" {...register("email")} />
                          {errors.email && (
                            <FieldError>{errors.email.message}</FieldError>
                          )}
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>Phone</FieldLabel>
                        <FieldContent>
                          <Input {...register("phone")} />
                          {errors.phone && (
                            <FieldError>{errors.phone.message}</FieldError>
                          )}
                        </FieldContent>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="rounded-3xl py-0 gap-0 border-dashed">
                <CardContent className="p-6 py-7">
                  <h2 className="mb-6 text-xl font-semibold">
                    Shipping Address
                  </h2>

                  <FieldSet className="space-y-4 gap-0">
                    <Field>
                      <FieldLabel>Address Line 1</FieldLabel>
                      <FieldContent>
                        <Input {...register("address_line_1")} />
                        {errors.address_line_1 && (
                          <FieldError>
                            {errors.address_line_1.message}
                          </FieldError>
                        )}
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Address Line 2</FieldLabel>
                      <FieldContent>
                        <Input {...register("address_line_2")} />
                      </FieldContent>
                    </Field>

                    <FieldGroup>
                      <Field>
                        <FieldLabel>City</FieldLabel>
                        <FieldContent>
                          <Input {...register("city")} />
                          {errors.city && (
                            <FieldError>{errors.city.message}</FieldError>
                          )}
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>State</FieldLabel>
                        <FieldContent>
                          <Input {...register("state")} />
                          {errors.state && (
                            <FieldError>{errors.state.message}</FieldError>
                          )}
                        </FieldContent>
                      </Field>
                    </FieldGroup>

                    <FieldGroup>
                      <Field>
                        <FieldLabel>Postal Code</FieldLabel>
                        <FieldContent>
                          <Input {...register("postal_code")} />
                          {errors.postal_code && (
                            <FieldError>{errors.postal_code.message}</FieldError>
                          )}
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>Country</FieldLabel>
                        <FieldContent>
                          <Input defaultValue="India" disabled {...register("country")} />
                          {errors.country && (
                            <FieldError>{errors.country.message}</FieldError>
                          )}
                        </FieldContent>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-3">
              <Card className="sticky top-24 rounded-3xl py-0 gap-0 border-dashed">
                <CardContent className="space-y-5 p-6 py-7">
                  <h2 className="text-xl font-semibold">Order Summary</h2>

                  {cartItems.map((item) => (
                    <div
                      key={item.sku}
                      className="flex items-center justify-between gap-3"
                    >
                      {/* LEFT SIDE (IMAGE + INFO) */}
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}

                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* PRICE */}
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>₹50</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{Number(subtotal + 50).toLocaleString()}</span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || loadingCart}
                    className="w-full rounded-xl"
                  >
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}