"use client";

import { useEffect, useMemo, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import ProductCard from "./product-card";

export type ProductImage = {
  id: string;
  image_url: string;
  image_role: "thumbnail" | "gallery" | "zoom";
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  // compare_price?: number;
  collection_product_images: ProductImage[];
};

type Collection = {
  id: string;
  title: string;
  slug: string;
  collection_products: Product[];
};

export default function CollectionProductsView({ slug, }: {
  slug: string;
}) {
  const [collection, setCollection] = useState<Collection | null>(null);

  const [sortBy, setSortBy] = useState("featured");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection();
  }, [slug]);

  const fetchCollection = async () => {
    try {
      const response = await fetch(
        `/api/landing/featured-collections/collection-products/by-slug/${slug}`
      );

      const data = await response.json();

      setCollection(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!collection) {
      return [];
    }

    const products = [
      ...collection.collection_products,
    ];

    switch (sortBy) {
      case "price_low":
        products.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "price_high":
        products.sort(
          (a, b) => b.price - a.price
        );
        break;

      default:
        break;
    }

    return products;
  }, [
    collection,
    sortBy,
  ]);

  if (loading) {
    return (
      <div className="container py-10">
        Loading...
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  return (
    <div className="flex flex-col px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-4.5">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">
            {collection.title}
          </h1>

          <p className="text-muted-foreground">
            {filteredProducts.length}{" "} products
          </p>
        </div>

        {/* Filters */}
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="featured">
              Featured
            </SelectItem>

            <SelectItem value="price_low">
              Price: Low to High
            </SelectItem>

            <SelectItem value="price_high">
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )
        )}
      </div>
    </div>
  );
}