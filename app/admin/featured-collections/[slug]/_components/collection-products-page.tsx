// app/admin/featured-collections/[slug]/collection-products-page.tsx

"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ImageIcon, Package2, Pencil, Plus, Trash2, } from "lucide-react";

import { Badge, } from "@/components/ui/badge";
import { Button, } from "@/components/ui/button";
import { Card, CardContent, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Skeleton, } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import CollectionProductForm from "./collection-product-form";
import { PopularCollection } from "../../collection-form";
import CollectionProductImagesManager from "./collection-product-images-manager";

type CollectionProduct = {
  id: string;
  collection_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  is_active: boolean;
};

type Props = {
  slug: string;
};

export default function CollectionProductsPage({ slug, }: Props) {
  const router = useRouter();

  const [collection, setCollection,] = useState<PopularCollection | null>(null);
  const [products, setProducts] = useState<CollectionProduct[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection();
    fetchProducts();
  }, []);

  const fetchCollection = async () => {
    const response =
      await fetch(
        `/api/admin/collections/collection-products/by-slug/${slug}`
      );

    const data = await response.json();

    setCollection(data);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/admin/collections/collection-products/by-slug/${slug}`
        );

      const data = await response.json();

      setProducts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!collection) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Collection Products
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your collection
            products
          </p>
        </div>

        {/* Create Product */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4" />

              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
            <DialogHeader className="shrink-0 px-4 py-3 text-left">
              <DialogTitle className="text-xl">
                Create Product
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex-1 overflow-y-auto p-4">
              <CollectionProductForm
                collectionId={collection.id}
                onSuccess={() => {
                  fetchProducts();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <Card key={index} className="rounded-3xl py-0 gap-0">
              <CardContent className="space-y-4 p-4">
                <Skeleton className="h-32 w-full rounded-2xl" />

                <Skeleton className="h-6 w-40" />

                <Skeleton className="h-4 w-full" />

                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <Card className="flex flex-col items-center justify-center text-center rounded-3xl py-0 gap-0 border-dashed">
          <CardContent className="flex max-w-md flex-col items-center justify-center space-y-6 p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <Package2 className="text-muted-foreground h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className=" text-2xl font-semibold">
                No Products
              </h2>

              <p className="text-muted-foreground text-sm">
                Create your first collection product
                to start managing your storefront.
              </p>
            </div>

            {/* Create Product */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-xl">
                  <Plus className="h-4 w-4" />

                  Add Product
                </Button>
              </DialogTrigger>

              <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
                <DialogHeader className="shrink-0 px-4 py-3 text-left">
                  <DialogTitle className="text-xl">
                    Create Product
                  </DialogTitle>
                </DialogHeader>

                <Separator />

                <div className="flex-1 overflow-y-auto p-4">
                  <CollectionProductForm
                    collectionId={collection.id}
                    onSuccess={() => {
                      fetchProducts();
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Products */}
      {!loading &&
        products.length >
        0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map(
              (product) => (
                <Card
                  key={product.id}
                  className="rounded-3xl py-0 gap-0 cursor-pointer group overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
                  onClick={() =>
                    router.push(
                      `/admin/featured-collections/${product.id}`
                    )
                  }
                >
                  {/* Banner */}
                  <div
                    className="
                      relative flex
                      h-32 items-center
                      justify-center
                      overflow-hidden
                      bg-gradient-to-br
                      from-muted
                      to-muted/40
                    "
                  >
                    <Package2 className="h-16 w-16 text-muted-foreground/30" />

                    <div className="absolute left-4 top-4">
                      <Badge variant={product.is_active ? "default" : "secondary"} className="rounded-full">
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent
                    className="
                      space-y-4 p-4
                    "
                  >
                    {/* Content */}
                    <div
                      className="
                        space-y-2
                      "
                    >
                      <div>
                        <h2
                          className="
                            line-clamp-1
                            text-lg
                            font-semibold
                          "
                        >
                          {product.name}
                        </h2>

                        <p
                          className="
                            text-muted-foreground
                            mt-1 text-sm
                          "
                        >
                          /{product.slug}
                        </p>
                      </div>

                      {product.description && (
                        <p
                          className="
                            text-muted-foreground
                            line-clamp-2
                            text-sm
                          "
                        >
                          {
                            product.description
                          }
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div
                      className="
                        flex items-center
                        justify-between
                      "
                    >
                      <div>
                        <p
                          className="
                            text-muted-foreground
                            text-xs
                          "
                        >
                          Price
                        </p>

                        <p
                          className="
                            text-lg
                            font-semibold
                          "
                        >
                          ₹
                          {product.price}
                        </p>
                      </div>

                      <div
                        className="flex items-center gap-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {/* Edit Product */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="size-12 rounded-full" onClick={(e) => { e.stopPropagation(); }}>
                              <Pencil className="!h-6 !w-6" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
                            <DialogHeader className="shrink-0 px-4 py-3 text-left">
                              <DialogTitle className="text-xl">
                                Edit Product
                              </DialogTitle>
                            </DialogHeader>

                            <Separator />

                            <div className="flex-1 overflow-y-auto p-4">
                              <CollectionProductForm
                                collectionId={collection.id}
                                initialData={product}
                                onSuccess={() => {
                                  fetchProducts();
                                }}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Images */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="size-12 rounded-full" onClick={(e) => { e.stopPropagation(); }}>
                              <ImageIcon className="!h-6 !w-6" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="flex h-[95vh] flex-col overflow-hidden p-0 sm:max-w-6xl gap-0 [&>button]:top-3 [&>button]:right-4">
                            <DialogHeader className="shrink-0 px-4 py-3 text-left">
                              <DialogTitle className="text-xl">
                                Manage Product Images
                              </DialogTitle>
                            </DialogHeader>

                            <Separator />

                            <div className="flex-1 overflow-y-auto p-4">
                              <CollectionProductImagesManager
                                product={product}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <Button variant="destructive" className="size-12 rounded-full">
                          <Trash2 className="!h-6 !w-6" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}
    </div>
  );
}