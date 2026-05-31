// app/admin/featured-collections/categories/page.tsx

"use client";

import { useEffect, useState } from "react";

import { Pencil, Plus, Shapes, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import AddCollectionCategoryForm from "./collection-category-form";

type CollectionCategory = {
  id: string;
  name: string;
  slug: string;
};

export default function CollectionCategoriesPage() {
  const [categories, setCategories] = useState<CollectionCategory[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/featured-collections/collection-categories"
      );

      const data = await response.json();

      setCategories(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Collection Categories
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage storefront collection categories
          </p>
        </div>

        {/* Add Category */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4" />

              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
            <DialogHeader className="shrink-0 px-4 py-3 text-left">
              <DialogTitle className="text-xl">
                Create Category
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex-1 overflow-y-auto p-4">
              <AddCollectionCategoryForm
                onSuccess={() => {
                  fetchCategories();
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
            <Card
              key={index}
              className="rounded-3xl py-0 gap-0 overflow-hidden border-dashed"
            >
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-12 w-12 rounded-2xl" />

                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />

                  <Skeleton className="h-4 w-32" />
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24 rounded-xl" />

                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        categories.length === 0 && (
          <Card className="rounded-3xl py-0 gap-0 border-dashed">
            <CardContent className="flex flex-col items-center justify-center space-y-6 p-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
                <Shapes className="text-muted-foreground h-10 w-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  No Categories
                </h2>

                <p className="text-muted-foreground text-sm">
                  Create your first collection category to organize your storefront.
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-xl">
                    <Plus className="h-4 w-4" />

                    Add Category
                  </Button>
                </DialogTrigger>

                <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
                  <DialogHeader className="shrink-0 px-4 py-3 text-left">
                    <DialogTitle className="text-xl">
                      Create Category
                    </DialogTitle>
                  </DialogHeader>

                  <Separator />

                  <div className="flex-1 overflow-y-auto p-4">
                    <AddCollectionCategoryForm
                      onSuccess={() => {
                        fetchCategories();
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

      {/* Categories */}
      {!loading &&
        categories.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="rounded-3xl py-0 gap-0 overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Banner */}
                <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-muted/40">
                  <Shapes className="h-16 w-16 text-muted-foreground/30" />

                  <div className="absolute left-4 top-4">
                    <Badge className="rounded-full">
                      Category
                    </Badge>
                  </div>
                </div>

                <CardContent className="space-y-5 p-5">
                  {/* Content */}
                  <div className="space-y-1">
                    <h2 className="line-clamp-1 text-xl font-semibold">
                      {category.name}
                    </h2>

                    <p className="text-muted-foreground text-sm">
                      /{category.slug}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {/* Edit */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="size-11 rounded-full"
                        >
                          <Pencil className="!h-5 !w-5" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
                        <DialogHeader className="shrink-0 px-4 py-3 text-left">
                          <DialogTitle className="text-xl">
                            Edit Category
                          </DialogTitle>
                        </DialogHeader>

                        <Separator />

                        <div className="flex-1 overflow-y-auto p-4">
                          <AddCollectionCategoryForm
                            initialData={category}
                            onSuccess={() => {
                              fetchCategories();
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}
                    <Button
                      variant="destructive"
                      className="size-11 rounded-full"
                    >
                      <Trash2 className="!h-5 !w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}