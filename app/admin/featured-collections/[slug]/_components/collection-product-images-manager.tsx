// collection-product-images-manager.tsx

"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  image_url: string;
  image_role: "thumbnail" | "gallery" | "zoom";
  sort_order: number;
};

type Props = {
  product: Product;
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

  onSuccess?: () => void;
};

function ImageUpdateForm({
  image,
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

  const onSubmit = async (
    values: FormValues
  ) => {
    try {
      const response = await fetch(
        `/api/admin/featured-collections/collection-products/collection-product-images/${image.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const result =
        await response.json();

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
      onSubmit={handleSubmit(onSubmit)}
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
                value={watch("image_role")}
                onValueChange={(value) =>
                  setValue(
                    "image_role",
                    value as "thumbnail" | "gallery" | "zoom"
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
                Select how this image is used
              </FieldDescription>

              {errors.image_role && (
                <FieldError>
                  {errors.image_role.message}
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
                {...register("sort_order")}
              />

              <FieldDescription className="!mt-0.5">
                Lower numbers appear first
              </FieldDescription>

              {errors.sort_order && (
                <FieldError>
                  {errors.sort_order.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>
        </FieldGroup>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default function CollectionProductImagesManager({
  product,
}: Props) {
  const [images, setImages] = useState<ProductImage[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/featured-collections/collection-products/collection-product-images?product_id=${product.id}`
      );

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

  const handleUpload = async (
    files: FileList | null
  ) => {
    if (!files || files.length === 0) {
      return;
    }

    try {
      setUploading(true);

      let nextSortOrder =
        images.length > 0
          ? Math.max(
            ...images.map(
              (image) => image.sort_order
            )
          ) + 1
          : 1;

      for (const file of Array.from(files)) {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const uploadResponse =
          await fetch(
            "/api/admin/featured-collections/collection-products/collection-product-images/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        const uploadResult =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.error
          );
        }

        const imageResponse =
          await fetch(
            "/api/admin/featured-collections/collection-products/collection-product-images",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                product_id: product.id,
                image_url: uploadResult.url,
                image_role:
                  nextSortOrder === 1
                    ? "thumbnail"
                    : "gallery",
                sort_order: nextSortOrder,
              }),
            }
          );

        const imageResult =
          await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(
            imageResult.error
          );
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

  const handleDelete = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `/api/admin/featured-collections/collection-products/collection-product-images/${id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error
        );
      }

      toast.success(
        result.message
      );

      fetchImages();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {product.name}
          </h2>

          <p className="text-muted-foreground text-sm">
            Manage collection product images
          </p>
        </div>

        <Button asChild disabled={uploading} size="lg" className="rounded-xl">
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
              onChange={(e) =>
                handleUpload(
                  e.target.files
                )
              }
            />
          </label>
        </Button>
      </div>

      {/* Images */}
      {!loading &&
        images.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {images.map(
              (image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden rounded-3xl py-0 gap-0"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-muted">
                    <Image
                      src={image.image_url}
                      alt="Product Image"
                      fill
                      className="object-cover"
                    />

                    <div className="absolute left-4 top-4">
                      <Badge className="rounded-full capitalize">
                        {image.image_role}
                      </Badge>
                    </div>

                    <div className="absolute right-4 top-4">
                      <Badge variant="secondary" className="rounded-full">
                        #{image.sort_order}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-4">
                    <ImageUpdateForm
                      image={image}
                      onSuccess={() => {
                        fetchImages();
                      }}
                    />

                    <div className="flex justify-end">
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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