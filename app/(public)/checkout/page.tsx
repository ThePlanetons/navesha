"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useCart } from "@/context/cart-provider";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Product } from "../featured-collections/[slug]/_components/collection-products-view";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email(),
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
          `/api/landing/cart/products?skus=${encodeURIComponent(skuList)}`,
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

  const onSubmit = async (values: FormValues) => {
    const payload = {
      customer: values,
      items: cartItems,
      total: subtotal,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return;
    }

    console.log("Order placed:", data);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Complete your order details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* FORM */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Customer Information
                </h2>

                <FieldSet className="gap-0 space-y-4">
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
                      <FieldLabel>Last Name</FieldLabel>
                      <FieldContent>
                        <Input {...register("last_name")} />
                        {errors.last_name && (
                          <FieldError>
                            {errors.last_name.message}
                          </FieldError>
                        )}
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

            {/* Shipping */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Shipping Address
                </h2>

                <FieldSet className="gap-0 space-y-4">
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
                      <FieldLabel>Country</FieldLabel>
                      <FieldContent>
                        <Input defaultValue="India" {...register("country")} />
                        {errors.country && (
                          <FieldError>{errors.country.message}</FieldError>
                        )}
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Postal Code</FieldLabel>
                      <FieldContent>
                        <Input {...register("postal_code")} />
                        {errors.postal_code && (
                          <FieldError>{errors.postal_code.message}</FieldError>
                        )}
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <Card className="sticky top-24 rounded-3xl">
              <CardContent className="space-y-5 p-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                {loadingCart ? (
                  <p className="text-muted-foreground">Loading cart...</p>
                ) : cartItems.length === 0 ? (
                  <p className="text-muted-foreground">Cart is empty</p>
                ) : (
                  cartItems.map((item) => (
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
                  ))
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString()}</span>
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
  );
}