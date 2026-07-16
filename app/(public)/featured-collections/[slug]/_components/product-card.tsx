"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useCart } from "@/contexts/cart-provider";
import { PosterPrices, usePosterPrices } from "@/contexts/poster-prices-provider";

import { Product } from "./collection-products-view";
import PillTabs from "@/app/(public)/_components/pill-tabs";

type ProductCardProps = {
  product: Product;
  collectionSlug: string;
};

export default function ProductCard({ product, collectionSlug }: ProductCardProps) {
  const thumbnail = product.collection_product_images.find(
    (image) => image.image_role === "thumbnail"
  )?.image_url;

  const { addToCart } = useCart();

  const { prices } = usePosterPrices();
  const [selectedSize, setSelectedSize] = useState<keyof PosterPrices>("A3");

  const comparePrice = Math.round(prices[selectedSize] * 1.5);

  const sizeItems = [
    {
      label: "A3",
      value: "A3",
    },
    {
      label: "A4",
      value: "A4",
    },
    {
      label: "A5",
      value: "A5",
    },
  ];

  return (
    <Link href={`/featured-collections/${collectionSlug}/${product.slug}`}>
      <div className="overflow-hidden rounded-3xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer">
        <div className="relative h-90">
          <Image
            src={thumbnail!}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 font-medium">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm line-through">
                ₹{comparePrice}
              </span>

              <span className="text-lg font-bold">
                ₹{prices[selectedSize]}
              </span>
            </div>

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
          </div>

          <Button
            className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

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
    </Link>
  );
}