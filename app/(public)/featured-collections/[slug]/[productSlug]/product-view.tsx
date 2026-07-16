"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useCart } from "@/contexts/cart-provider";

import { Product } from "../_components/collection-products-view";

export default function ProductView({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const thumbnail = product.collection_product_images.find(
    (img) => img.image_role === "thumbnail"
  ) ?? product.collection_product_images[0];

  if (!thumbnail) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-0.5 text-sm text-muted-foreground">
        <Link
          href="/"
          className="hover:text-foreground transition-colors"
        >
          Home
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          href={`/featured-collections/${product.collections.slug}`}
        >
          {product.collections.title}
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground font-medium">
          {product.name}
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <Image
            src={thumbnail.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold">
            ₹{product.price}
          </p>

          {product.description && (
            <p className="text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              size="lg"
              className="rounded-xl"
              onClick={() => {
                addToCart(product.sku, selectedSize);

                toast.success(
                  "Added to cart"
                );
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}