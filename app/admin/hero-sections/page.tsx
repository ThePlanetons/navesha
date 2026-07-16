"use client";

import { useEffect, useState, } from "react";

import Image from "next/image";

import { AlertTriangle, Pencil, Plus, Trash2, } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { toast } from "sonner";

import HeroSlideForm from "./hero-slide-form";

export type HeroSlide = {
  id: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  image_exists: boolean;
};

export default function HeroSectionsPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState<HeroSlide | undefined>();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/hero-slides"
      );

      const data = await response.json();

      setSlides(data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `/api/admin/hero-slides/${id}`,
        { method: "DELETE", }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setSlides((prev) =>
        prev.filter((slide) => slide.id !== id)
      );

      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const nextSortOrder = slides.length > 0
    ? Math.max(...slides.map((slide) => slide.sort_order)) + 1
    : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Hero Sections
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your storefront hero sections
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Slide */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4" />

                Add Slide
              </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
              <DialogHeader className="shrink-0 px-4 py-3 text-left">
                <DialogTitle className="text-xl">
                  Create Slide
                </DialogTitle>
              </DialogHeader>

              <Separator />

              <div className="flex-1 overflow-y-auto p-4">
                <HeroSlideForm
                  defaultSortOrder={nextSortOrder}
                  onSuccess={(newSlide) => {
                    setSlides((prev) =>
                      [...prev, newSlide].sort(
                        (a, b) => a.sort_order - b.sort_order
                      )
                    );

                    setOpen(false);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Empty State */}
      {!loading && slides.length === 0 && (
        <Card className="flex flex-col items-center justify-center text-center rounded-3xl py-0 gap-0 border-dashed">
          <CardContent className="flex max-w-md flex-col items-center justify-center space-y-6 p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <Plus className="text-muted-foreground h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                No Hero Slides
              </h2>

              <p
                className="text-muted-foreground text-sm">
                Create your first hero slide to showcase banners,
                promotions, or featured content on your storefront.
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-xl">
                  <Plus className="h-4 w-4" />

                  Create First Slide
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
                  <HeroSlideForm
                    defaultSortOrder={nextSortOrder}
                    onSuccess={(newSlide) => {
                      setSlides((prev) =>
                        [...prev, newSlide].sort(
                          (a, b) => a.sort_order - b.sort_order
                        )
                      );

                      setOpen(false);
                    }}
                  />
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

      {/* Slides */}
      {!loading && slides.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map(
            (slide) => (
              <Card className="rounded-3xl py-0 gap-0 border-dashed"
                key={slide.id}
              >
                <div className="relative overflow-hidden rounded-t-3xl">
                  {/* Image */}
                  <div className="relative h-56 w-full">
                    {slide.image_exists ? (
                      <Image
                        src={slide.image_url}
                        alt="Hero Slide"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/40 px-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                          <AlertTriangle className="h-6 w-6" />
                        </div>

                        <div className="space-y-1">
                          <p className="font-medium">
                            Missing Image
                          </p>

                          <p className="text-muted-foreground text-sm">
                            File not found in storage bucket
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-x-0 top-0 z-10 flex justify-start p-4">
                      <Badge
                        variant={slide.is_active ? "default" : "secondary"}
                        className="rounded-full shadow-md"
                      >
                        {slide.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex text-sm">
                      <div className="text-muted-foreground">Sort Order&nbsp;</div>

                      <div className="font-medium">
                        {slide.sort_order || 0}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit */}
                      <Dialog
                        open={open && editData?.id === slide.id}
                        onOpenChange={(value) => {
                          setOpen(value);

                          if (!value) {
                            setEditData(undefined);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => { setEditData(slide); }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden gap-0 p-0 sm:max-w-lg [&>button]:right-4 [&>button]:top-3">
                          <DialogHeader className="shrink-0 px-4 py-3 text-left">
                            <DialogTitle className="text-xl">
                              Update Slide
                            </DialogTitle>
                          </DialogHeader>

                          <Separator />

                          <div className="flex-1 overflow-y-auto p-4">
                            {editData && (
                              <HeroSlideForm
                                initialData={editData}
                                onSuccess={(updatedSlide) => {
                                  setSlides((prev) =>
                                    prev.map((slide) =>
                                      slide.id === updatedSlide.id
                                        ? updatedSlide
                                        : slide
                                    )
                                  );

                                  setOpen(false);

                                  setEditData(undefined);
                                }}
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="destructive" className="rounded-xl">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent size="sm">
                          <AlertDialogHeader>
                            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                              <Trash2 />
                            </AlertDialogMedia>

                            <AlertDialogTitle>Delete Slide?</AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this slide.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => handleDelete(slide.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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