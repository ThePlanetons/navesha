"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { FolderKanban, ImageIcon, Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import CollectionForm, { PopularCollection } from "./collection-form";
import ImagesManager from "./images-manager";

export default function Page() {
  const router = useRouter();

  const [collections, setCollections] = useState<PopularCollection[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/featured-collections"
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
            Featured Collections
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your storefront featured collections
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Manage Categories */}
          <Button
            asChild
            variant="outline"
            className="rounded-xl"
          >
            <Link href="/admin/featured-collections/categories">
              Manage Categories
            </Link>
          </Button>

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
                <CollectionForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <Card className="flex flex-col items-center justify-center text-center rounded-3xl py-0 gap-0 border-dashed">
          <CardContent className="flex max-w-md flex-col items-center justify-center space-y-6 p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <FolderKanban className="text-muted-foreground h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                No collections found
              </h2>

              <p className="text-muted-foreground text-sm">
                Create your first popular collection to
                organize products and showcase categories.
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-xl">
                  <Plus className="h-4 w-4" />

                  Create First Collection
                </Button>
              </DialogTrigger>

              <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden gap-0 p-0 sm:max-w-lg [&>button]:top-3 [&>button]:right-4">
                <DialogHeader className="shrink-0 px-4 py-3 text-left">
                  <DialogTitle className="text-xl">
                    Create Slide
                  </DialogTitle>
                </DialogHeader>

                <Separator />

                <div className="flex-1 overflow-y-auto p-4">
                  <CollectionForm />
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card className="rounded-3xl py-0 gap-0 border-dashed"
              key={index}
            >
              <CardContent className="space-y-3 p-4">
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
            <Card className="rounded-3xl py-0 gap-0 border-dashed cursor-pointer group overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
              key={collection.id}
              onClick={() => router.push(`/admin/featured-collections/${collection.slug}`)}
            >
              {/* Banner */}
              <div className="relative h-24 overflow-hidden bg-gradient-to-br from-muted to-muted/40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderKanban className="h-14 w-14 text-muted-foreground/40" />
                </div>

                <div className="absolute left-4 top-4">
                  <Badge
                    variant={collection.is_active ? "default" : "secondary"}
                    className="rounded-full"
                  >
                    {collection.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="absolute right-4 top-4">
                  <Badge variant="secondary" className="rounded-full border bg-white text-black hover:bg-white">
                    #{collection.sort_order}
                  </Badge>
                </div>
              </div>

              <CardContent className="space-y-3 p-4">
                {/* Content */}
                <div>
                  <h2 className="line-clamp-1 text-xl font-semibold">
                    {collection.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    /{collection.slug}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full"
                    >
                      {collection.collection_categories?.name}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    {/* Edit Collection */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="size-12 rounded-full" onClick={(e) => { e.stopPropagation(); }}>
                          <Pencil className="!h-6 !w-6" />
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
                          <CollectionForm
                            initialData={collection}
                            onSuccess={() => {
                              fetchCollections();
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="size-12 rounded-full" onClick={(e) => { e.stopPropagation(); }}>
                          <ImageIcon className="!h-6 !w-6" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="flex h-[95vh] flex-col overflow-hidden p-0 sm:max-w-6xl gap-0 [&>button]:top-3 [&>button]:right-4">
                        <DialogHeader className="shrink-0 px-4 py-3 text-left">
                          <DialogTitle className="text-xl">
                            Manage Featured Collections Images
                          </DialogTitle>
                        </DialogHeader>

                        <Separator />

                        <div className="flex-1 overflow-y-auto p-4">
                          <ImagesManager
                            entityId={collection.id}
                            entityKey="collection_id"
                            title={collection.title}
                            fetchUrl={`/api/admin/featured-collections/collection-images?collection_id=${collection.id}`}
                            createUrl="/api/admin/featured-collections/collection-images"
                            uploadUrl="/api/admin/featured-collections/collection-images/upload"
                            deleteBaseUrl="/api/admin/featured-collections/collection-images"
                            updateBaseUrl="/api/admin/featured-collections/collection-images"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Manage Products */}
                    <Button asChild variant="outline" className="size-12 rounded-full">
                      <Link href={`/admin/featured-collections/${collection.slug}`}>
                        <FolderKanban className="!h-6 !w-6" />
                      </Link>
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