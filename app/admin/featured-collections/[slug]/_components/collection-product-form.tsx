"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type CollectionProduct = {
  id: string;
  collection_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  is_active: boolean;
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(200),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers and hyphens allowed"
    ),

  description:
    z.string().optional(),

  price: z.coerce
    .number()
    .min(
      1,
      "Price must be greater than 0"
    ),

  is_active: z.boolean(),
});

type FormValues = z.input<typeof formSchema>;

type CollectionProductFormProps = {
  collectionId: string;

  initialData?: CollectionProduct;

  onSuccess?: () => void;
};

export default function CollectionProductForm({ collectionId, initialData, onSuccess, }: CollectionProductFormProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver:
      zodResolver(formSchema),

    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  const isActive = watch("is_active");

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(
        isEdit
          ? `/api/admin/featured-collections/collection-products/${initialData.id}`
          : "/api/admin/featured-collections/collection-products",
        {
          method: isEdit ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...values,
            collection_id: collectionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success(data.message);

      if (!isEdit) {
        reset();
      }

      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet className="space-y-5 gap-0">
        <FieldGroup>
          {/* Name */}
          <Field>
            <FieldLabel>
              Product Name
            </FieldLabel>

            <FieldContent>
              <Input
                placeholder="Spider Man with MJ"
                {...register("name")}
                onChange={(e) => {
                  const value = e.target.value;

                  setValue("name", value);

                  setValue("slug", generateSlug(value));
                }}
              />

              <FieldDescription className="!mt-0.5">
                Product display
                name
              </FieldDescription>

              {errors.name && (
                <FieldError>
                  {errors.name.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Slug */}
          <Field>
            <FieldLabel>
              Slug
            </FieldLabel>

            <FieldContent>
              <Input
                placeholder="spider-man-with-mj"
                {...register("slug")}
              />

              <FieldDescription className="!mt-0.5">
                Used in product
                URLs
              </FieldDescription>

              {errors.slug && (
                <FieldError>
                  {errors.slug.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>
              Description
            </FieldLabel>

            <FieldContent>
              <Textarea
                rows={5}
                placeholder="Write product description..."
                {...register("description")}
              />

              <FieldDescription className="!mt-0.5">
                Optional product
                description
              </FieldDescription>

              {errors.description && (
                <FieldError>
                  {errors.description.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Price */}
          <Field>
            <FieldLabel>
              Price
            </FieldLabel>

            <FieldContent>
              <Input
                type="number"
                placeholder="499"
                {...register("price")}
              />

              <FieldDescription className="!mt-0.5">
                Product selling
                price
              </FieldDescription>

              {errors.price && (
                <FieldError>
                  {errors.price.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Active Status */}
          <FieldLabel htmlFor="is_active">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>
                  Active Status
                </FieldTitle>

                <FieldDescription className="!mt-0.5">
                  Enable or
                  disable this
                  product
                </FieldDescription>
              </FieldContent>

              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) =>
                  setValue("is_active", checked)
                }
              />
            </Field>
          </FieldLabel>
        </FieldGroup>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="rounded-xl">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEdit ? "Update Product" : "Create Product"}
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}