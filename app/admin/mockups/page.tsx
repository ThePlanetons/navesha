"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import MockupForm from "./mockup-form";

export type Mockup = {
  id: string;
  name: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;

  image_exists?: boolean;
};

export default function Page() {
  const [mockups, setMockups] = useState<Mockup[]>([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editData, setEditData] = useState<Mockup | undefined>();

  useEffect(() => {
    fetchMockups();
  }, []);

  const fetchMockups = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/mockups"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setMockups(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `/api/admin/mockups/${id}`,
        { method: "DELETE", }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setMockups((prev) =>
        prev.filter((mockup) => mockup.id !== id)
      );

      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Mockups
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your collection of product mockup templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Mockup */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4" />

                Add Mockup
              </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
              <DialogHeader className="shrink-0 px-4 py-3 text-left">
                <DialogTitle className="text-xl">
                  Create Mockup
                </DialogTitle>
              </DialogHeader>

              <Separator />

              <div className="flex-1 overflow-y-auto p-4">
                <MockupForm
                  onSuccess={(newMockup) => {
                    setMockups((prev) =>
                      [...prev, newMockup].sort(
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockups.map((mockup) => (
          <Card className="rounded-3xl py-0 gap-0 border-dashed"
            key={mockup.id}
          >
            <div className="relative overflow-hidden rounded-t-3xl">
              {/* Image */}
              <div className="relative h-56 w-full">
                {mockup.image_exists ? (
                  <Image
                    src={mockup.image_url}
                    alt={mockup.name}
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
                    variant={mockup.is_active ? "default" : "secondary"}
                    className="rounded-full shadow-md"
                  >
                    {mockup.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="absolute inset-x-0 top-0 z-10 flex justify-end p-4">
                  <Badge
                  variant="secondary"
                  className="rounded-full border bg-white text-black hover:bg-white"
                >
                  #{mockup.sort_order}
                </Badge>
                </div>
              </div>
            </div>

            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex text-sm">
                  <div className="font-medium">
                    {mockup.name}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Edit */}
                  <Dialog
                    open={open && editData?.id === mockup.id}
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
                        onClick={() => { setEditData(mockup); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg gap-0 [&>button]:top-3 [&>button]:right-4">
                      <DialogHeader className="shrink-0 px-4 py-3 text-left">
                        <DialogTitle className="text-xl">
                          Update Mockup
                        </DialogTitle>
                      </DialogHeader>

                      <Separator />

                      <div className="flex-1 overflow-y-auto p-4">
                        {editData && (
                          <MockupForm
                            initialData={editData}
                            onSuccess={(updatedMockup) => {
                              setMockups((prev) =>
                                prev.map((mockup) => mockup.id === updatedMockup.id ? updatedMockup : mockup)
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

                        <AlertDialogTitle>Delete Mockup?</AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this mockup.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleDelete(mockup.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}