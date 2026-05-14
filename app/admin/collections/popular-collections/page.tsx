"use client";

import { useEffect, useState } from "react";

import { FolderKanban, Pencil, Trash2, Plus, ImageIcon, } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import AddCollectionCategoryForm from "../collection-categories/add-collection-category-form";
import PopularCollectionForm, { PopularCollection } from "./popular-collection-form";
import CollectionImagesManager from "../collection-images/collection-images-manager";

export default function PopularCollections() {
  const [collections, setCollections] = useState<PopularCollection[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/collections/popular-collections"
      );

      const data = await response.json();

      setCollections(data || []);
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
            Popular Collections
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your storefront collections
          </p>
        </div>

        <div className="flex items-center gap-3">
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
                <AddCollectionCategoryForm />
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Collection */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4" />
                Add Collection
              </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
              <DialogHeader className="shrink-0 px-4 py-3 text-left">
                <DialogTitle className="text-xl">
                  Create Collection
                </DialogTitle>
              </DialogHeader>

              <Separator />

              <div className="flex-1 overflow-y-auto p-4">
                <PopularCollectionForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <Card className="rounded-3xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-2xl bg-muted p-4">
              <FolderKanban className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              No collections found
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create your first popular collection to
              organize products and showcase categories.
            </p>

            <Button className="mt-6 rounded-xl">
              Create Collection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="rounded-3xl py-0"
            >
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-40 w-full rounded-2xl" />

                <Skeleton className="h-6 w-40" />

                <Skeleton className="h-4 w-full" />

                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Collections Grid */}
      {!loading && collections.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="group overflow-hidden rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-lg py-0 gap-0"
            >
              {/* Banner */}
              <div className="relative h-24 overflow-hidden bg-gradient-to-br from-muted to-muted/40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderKanban className="h-14 w-14 text-muted-foreground/40" />
                </div>

                <div className="absolute left-5 top-5">
                  <Badge
                    variant={
                      collection.is_active
                        ? "default"
                        : "secondary"
                    }
                    className="rounded-full"
                  >
                    {collection.is_active
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
              </div>

              <CardContent className="space-y-3 p-5">
                {/* Content */}
                <div>
                  <h2 className="line-clamp-1 text-xl font-semibold">
                    {collection.title}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    /{collection.slug}
                  </p>
                </div>

                {/* Description */}
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {collection.description ||
                    "No description added"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Sort:{" "}
                    {collection.sort_order || 0}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit Collection */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="outline" className="rounded-xl">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
                        <DialogHeader className="shrink-0 px-4 py-3 text-left">
                          <DialogTitle className="text-xl">
                            Edit Collection
                          </DialogTitle>
                        </DialogHeader>

                        <Separator />

                        <div className="flex-1 overflow-y-auto p-4">
                          <PopularCollectionForm
                            initialData={collection}
                            onSuccess={() => {
                              fetchCollections();
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Manage Images */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-xl"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 xl:min-w-7xl gap-0 [&>button]:top-3 [&>button]:right-4">
                        <DialogHeader className="shrink-0 px-4 py-3 text-left">
                          <DialogTitle className="text-xl">
                            Manage Collection Images
                          </DialogTitle>
                        </DialogHeader>

                        <Separator />

                        <div className="flex-1 overflow-y-auto p-4">
                          <CollectionImagesManager
                            collection={collection}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}