"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useCart } from "@/contexts/cart-provider";

import { Product } from "../_components/collection-products-view";
import { PosterPrices, usePosterPrices } from "@/contexts/poster-prices-provider";
import { useState } from "react";
import PillTabs from "@/app/(public)/_components/pill-tabs";
import { sizeItems } from "../_components/product-card";

export default function ProductView({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { prices } = usePosterPrices();

  const [selectedSize, setSelectedSize] = useState<keyof PosterPrices>("A3");

  const comparePrice = Math.round(prices[selectedSize] * 1.5);

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

        <div className="space-y-5">
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-lg line-through">
              ₹{comparePrice}
            </span>

            <span className="text-2xl font-bold">
              ₹{prices[selectedSize]}
            </span>
          </div>
          {/* <p className="text-3xl font-semibold">
            ₹{product.price}
          </p> */}

          {product.description && (
            <p className="text-muted-foreground">
              {product.description}
            </p>
          )}

          {/* Size Selection */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <PillTabs
              items={sizeItems}
              value={selectedSize}
              onChange={(value) =>
                setSelectedSize(value as "A3" | "A4" | "A5")
              }
              size="sm"
              id={`product-size-${product.sku}`}
            />
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
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