"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { Product } from "./collection-products-view";

import { useCart } from "@/context/cart-provider";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product, }: ProductCardProps) {
  const thumbnail = product.collection_product_images.find(
    (image) => image.image_role === "thumbnail"
  )?.image_url;

  const { addToCart } = useCart();

  return (
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

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            ₹{product.price}
          </span>

          {/* {product.compare_price && (
            <span className="text-muted-foreground text-sm line-through">
              ₹
              {
                product.compare_price
              }
            </span>
          )} */}
        </div>

        <Button
          className="w-full rounded-xl"
          onClick={() => {
            addToCart(product.sku);

            toast.success(
              "Added to cart"
            );
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}