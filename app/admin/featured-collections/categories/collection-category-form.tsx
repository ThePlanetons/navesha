// app/admin/featured-collections/categories/collection-category-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Category name is required"),

  slug: z
    .string()
    .min(2, "Slug is required"),

  sort_order: z.coerce.number(),

  is_active: z.boolean(),
});

type CollectionCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order?: number;
  is_active?: boolean;
};

type CollectionCategoryFormProps = {
  initialData?: CollectionCategory;

  onSuccess?: () => void;
};

type FormValues =
  z.input<typeof formSchema>;

export default function AddCollectionCategoryForm({ initialData, onSuccess, }: CollectionCategoryFormProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      sort_order: initialData?.sort_order || 0,
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
      .replace(/\s+/g, "-");
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(
        isEdit
          ? `/api/admin/featured-collections/collection-categories/${initialData.id}`
          : "/api/admin/featured-collections/collection-categories",
        {
          method: isEdit ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save category"
        );
      }

      if (!isEdit) {
        reset();
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldSet className="space-y-4 gap-0">
        <FieldGroup>
          {/* Name */}
          <Field>
            <FieldLabel>
              Category Name
            </FieldLabel>

            <FieldContent>
              <Input
                placeholder="Featured Universes"
                {...register("name")}
                onChange={(e) => {
                  const value = e.target.value;

                  setValue("name", value);

                  setValue("slug", generateSlug(value)
                  );
                }}
              />

              <FieldDescription className="!mt-0.5">
                Category display name
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
                placeholder="featured-universes"
                {...register(
                  "slug"
                )}
              />

              <FieldDescription className="!mt-0.5">
                Used in URLs
              </FieldDescription>

              {errors.slug && (
                <FieldError>
                  {errors.slug.message}
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
                  {errors.sort_order.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Active */}
          <FieldLabel htmlFor="is_active">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>
                  Active Status
                </FieldTitle>

                <FieldDescription className="!mt-0.5">
                  Enable or
                  disable this
                  category
                </FieldDescription>
              </FieldContent>

              <Switch
                id="is_active"
                checked={
                  isActive
                }
                onCheckedChange={(
                  checked
                ) =>
                  setValue(
                    "is_active",
                    checked
                  )
                }
              />
            </Field>
          </FieldLabel>
        </FieldGroup>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="rounded-xl">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEdit ? "Update Category" : "Create Category"}
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}