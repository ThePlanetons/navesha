// images-manager.tsx

"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import MockupSelectorDialog from "./mockup-selector-dialog";
import { Mockup } from "./type";
import PosterEditor from "./poster";

type ProductImage = {
  id: string;
  image_url: string;
  image_role: "thumbnail" | "gallery" | "zoom";
  sort_order: number;
};

type ImagesManagerProps = {
  entityId: string;
  entityKey: "collection_id" | "product_id";
  title: string;
  fetchUrl: string;
  createUrl: string;
  uploadUrl: string;
  deleteBaseUrl: string;
  updateBaseUrl: string;
};

const formSchema = z.object({
  image_role: z.enum([
    "thumbnail",
    "gallery",
    "zoom",
  ]),

  sort_order: z.coerce.number(),
});

type FormValues = z.input<typeof formSchema>;

type ImageUpdateFormProps = {
  image: ProductImage;

  updateBaseUrl: string;

  deleteBaseUrl: string;

  onSuccess?: () => void;
};

function ImageUpdateForm({
  image,
  updateBaseUrl,
  deleteBaseUrl,
  onSuccess,
}: ImageUpdateFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      image_role: image.image_role,
      sort_order: image.sort_order,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(
        `${updateBaseUrl}/${image.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            values
          ),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error
        );
      }

      toast.success(
        result.message
      );

      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  const handleDelete =
    async () => {
      try {
        const response = await fetch(
          `${deleteBaseUrl}/${image.id}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error
          );
        }

        toast.success(
          result.message
        );

        onSuccess?.();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      }
    };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-4"
    >
      <FieldSet className="space-y-4 gap-0">
        <FieldGroup>
          {/* Image Role */}
          <Field>
            <FieldLabel>
              Image Role
            </FieldLabel>

            <FieldContent>
              <Select
                value={watch(
                  "image_role"
                )}
                onValueChange={(
                  value
                ) =>
                  setValue(
                    "image_role",
                    value as
                    | "thumbnail"
                    | "gallery"
                    | "zoom"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select image role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="thumbnail">
                    Thumbnail
                  </SelectItem>

                  <SelectItem value="gallery">
                    Gallery
                  </SelectItem>

                  <SelectItem value="zoom">
                    Zoom
                  </SelectItem>
                </SelectContent>
              </Select>

              <FieldDescription className="!mt-0.5">
                Select how this
                image is used
              </FieldDescription>

              {errors.image_role && (
                <FieldError>
                  {
                    errors
                      .image_role
                      .message
                  }
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Sort Order */}
          <Field>
            <FieldLabel>
              Sort Order
            </FieldLabel>

            <FieldContent>
              <Input
                type="number"
                {...register(
                  "sort_order"
                )}
              />

              <FieldDescription className="!mt-0.5">
                Lower numbers
                appear first
              </FieldDescription>

              {errors.sort_order && (
                <FieldError>
                  {
                    errors
                      .sort_order
                      .message
                  }
                </FieldError>
              )}
            </FieldContent>
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-between">
          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                className="rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2 />
                </AlertDialogMedia>

                <AlertDialogTitle>
                  Delete Image?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action
                  cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  variant="destructive"
                  onClick={
                    handleDelete
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Update */}
          <Button
            type="submit"
            disabled={
              isSubmitting
            }
            className="rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Updating...
              </>
            ) : (
              <>
                Update Image
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}

export default function ImagesManager({
  entityId,
  entityKey,
  title,
  fetchUrl,
  createUrl,
  uploadUrl,
  deleteBaseUrl,
  updateBaseUrl,
}: ImagesManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);

      const response = await fetch(fetchUrl);

      const data = await response.json();

      setImages(data || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch images"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    try {
      setUploading(true);

      let nextSortOrder = images.length > 0
        ? Math.max(
          ...images.map(
            (
              image
            ) =>
              image.sort_order
          )
        ) + 1
        : 1;

      for (const file of Array.from(files)) {
        const formData = new FormData();

        formData.append("file", file);
        // formData.append("mockup_id", selectedMockup);

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error);
        }

        const imageResponse = await fetch(createUrl,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(
              {
                [entityKey]: entityId,
                image_url: uploadResult.url,
                image_role: nextSortOrder === 1 ? "thumbnail" : "gallery",
                sort_order: nextSortOrder,
              }
            ),
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(imageResult.error);
        }

        nextSortOrder++;
      }

      toast.success(
        "Images uploaded successfully"
      );

      fetchImages();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  };

  const [editorOpen, setEditorOpen] = useState(false);

  const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);

  const [posterFile, setPosterFile] = useState<File | null>(null);

  const [posterPreview, setPosterPreview] = useState("");

  const [selectorOpen, setSelectorOpen] = useState(false);

  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);

  const [mockups, setMockups] = useState<Mockup[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const response = await fetch("/api/admin/mockups");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch mockups");
        }

        setMockups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMockups();
  }, []);

  const [posterTransform, setPosterTransform] = useState({
    x: 100,
    y: 100,
    width: 250,
    height: 350,
  });

  return (
    <div className="space-y-6">
      {editingMockup && (
        <PosterEditor
          mockup={editingMockup}
          posterPreview={posterPreview}
          transform={posterTransform}
          onTransformChange={setPosterTransform}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <p className="text-muted-foreground text-sm">
            Manage images
          </p>
        </div>

        {/* <Button
          onClick={() => setSelectorOpen(true)}
        >
          Upload Images
        </Button>

        <MockupSelectorDialog
          open={selectorOpen}
          onOpenChange={setSelectorOpen}
          mockups={mockups}
          selectedMockup={selectedMockup}
          onSelect={setSelectedMockup}
          onPosterSelected={(mockup, file) => {

            setEditingMockup(mockup);

            setPosterFile(file);

            setPosterPreview(
              URL.createObjectURL(file)
            );

            setSelectorOpen(false);

            setEditorOpen(true);

          }}
        /> */}

        {/* <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) {
              return;
            }

            setSelectedFile(file);

            setSelectorOpen(false);

            setEditorOpen(true);
          }}
        /> */}

        {/* Upload */}
        {/* <Dialog open={mockupDialogOpen} onOpenChange={setMockupDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Upload className="h-4 w-4" />

              Upload Images
            </Button>
          </DialogTrigger>

          <DialogContent className="flex h-[95vh] flex-col overflow-hidden p-0 sm:max-w-6xl gap-0 [&>button]:top-3 [&>button]:right-4">
            <DialogHeader className="shrink-0 px-4 py-3 text-left">
              <DialogTitle className="text-xl">
                Choose Mockup
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockups.map((mockup) => (
                  <div
                    key={mockup.id}
                    onClick={() => setSelectedMockup(mockup.id)}
                    className={`w-full rounded-xl border overflow-hidden cursor-pointer ${selectedMockup === mockup.id
                      ? "border-red-500 ring-2 ring-red-500"
                      : "border-gray-200"
                      }`
                    }
                  >
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={mockup.image_url}
                        alt={mockup.name}
                        fill
                        className="object-cover"
                        sizes="250px"
                      />
                    </div>

                    <div className="h-14 flex items-center justify-center px-3 text-center font-medium">
                      {mockup.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="shrink-0 px-4 py-3">
              <div className="flex justify-end">
                <Button
                  disabled={!selectedMockup}
                  onClick={() => {
                    const selected = mockups.find(
                      (m) => m.id === selectedMockup
                    );

                    if (!selected) return;

                    setEditingMockup(selected);

                    setMockupDialogOpen(false);

                    fileInputRef.current?.click();
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        /> */}

        <Button
          asChild
          disabled={uploading}
          size="lg"
          className="rounded-xl"
        >
          <label>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />

                Upload Images
              </>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </Button>
      </div>

      {/* Content */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Loading */}
        {loading &&
          Array.from({
            length: 8,
          }).map((_, index) => (
            <Card
              key={`loading-${index}`}
              className="overflow-hidden rounded-3xl py-0 gap-0 border-dashed"
            >
              <div className="h-64 animate-pulse bg-muted" />

              <CardContent className="space-y-3 p-4">
                <div className="h-5 w-full animate-pulse rounded bg-muted" />

                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}

        {/* Images */}
        {!loading && images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden rounded-3xl py-0 gap-0 border-dashed"
          >
            <div className="relative h-64 bg-muted">
              <Image
                src={image.image_url}
                alt="Image"
                fill
                className="object-cover"
              />

              <div className="absolute left-4 top-4">
                <Badge className="rounded-full capitalize">
                  {image.image_role}
                </Badge>
              </div>

              <div className="absolute right-4 top-4">
                <Badge
                  variant="secondary"
                  className="rounded-full border bg-white text-black hover:bg-white"
                >
                  #{image.sort_order}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <ImageUpdateForm
                image={image}
                updateBaseUrl={updateBaseUrl}
                deleteBaseUrl={deleteBaseUrl}
                onSuccess={() => {
                  fetchImages();
                }}
              />
            </CardContent>
          </Card>
        ))}

        {/* Uploading */}
        {uploading &&
          Array.from({
            length: 4,
          }).map((_, index) => (
            <Card
              key={`uploading-${index}`}
              className="overflow-hidden rounded-3xl py-0 gap-0 border-dashed"
            >
              <div className="relative flex h-64 items-center justify-center bg-muted/50">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm">
                    <Loader2 className="text-muted-foreground h-7 w-7 animate-spin" />
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium">
                      Uploading
                      Image
                    </p>

                    <p className="text-muted-foreground text-xs">
                      Please
                      wait...
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-3 p-4">
                <div className="h-5 w-full animate-pulse rounded bg-muted" />

                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Empty */}
      {!loading && !uploading && images.length === 0 && (
        <Card className="rounded-3xl py-0 gap-0 border-dashed">
          <CardContent className="flex flex-col items-center justify-center space-y-6 p-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <ImageIcon className="text-muted-foreground h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                No Images
              </h2>

              <p className="text-muted-foreground text-sm">
                Upload images to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}