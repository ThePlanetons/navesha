"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Category = {
  id: string;
  name: string;
};

export type PopularCollection = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  is_active: boolean;
  sort_order: number;

  collection_categories?: {
    name: string;
  };
};

const formSchema = z.object({
  category_id: z.string().uuid(
    "Please select a category"
  ),
  title: z
    .string()
    .min(2, "Title is required")
    .max(150),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers and hyphens allowed"
    ),
  sort_order: z.coerce.number(),
  is_active: z.boolean(),
});

type FormValues = z.input<typeof formSchema>;

type CollectionFormProps = {
  initialData?: PopularCollection;

  onSuccess?: () => void;
};

export default function CollectionForm({ initialData, onSuccess, }: CollectionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      category_id: initialData?.category_id || "",
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      sort_order: initialData?.sort_order || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  const isActive = watch("is_active");
  const selectedCategoryId = watch("category_id");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "/api/admin/featured-collections/collection-categories"
      );

      const data = await response.json();

      setCategories(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const generateSlug = (
    value: string
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(/\s+/g, "-");
  };

  const onSubmit = async (
    values: FormValues
  ) => {
    try {
      const response = await fetch(
        isEdit
          ? `/api/admin/featured-collections/${initialData.id}`
          : "/api/admin/featured-collections",
        {
          method: isEdit
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
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
          {/* Category */}
          <Field>
            <FieldLabel>
              Category
            </FieldLabel>

            <FieldContent>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) =>
                  setValue(
                    "category_id",
                    value
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map(
                    (category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <FieldDescription className="!mt-0.5">
                Select parent category
              </FieldDescription>

              {errors.category_id && (
                <FieldError>
                  {errors.category_id.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Title */}
          <Field>
            <FieldLabel>
              Title
            </FieldLabel>

            <FieldContent>
              <Input
                placeholder="Marvel Collection"
                {...register("title")}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("title", value);
                  setValue("slug", generateSlug(value));
                }}
              />

              <FieldDescription className="!mt-0.5">
                Collection display title
              </FieldDescription>

              {errors.title && (
                <FieldError>
                  {errors.title.message}
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
                placeholder="marvel-collection"
                {...register("slug")}
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
                Lower numbers appear first
              </FieldDescription>

              {errors.sort_order && (
                <FieldError>
                  {errors.sort_order.message}
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
                  Enable or disable this collection
                </FieldDescription>
              </FieldContent>

              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={
                  (checked) => setValue("is_active", checked)
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
                {isEdit ? "Update Collection" : "Create Collection"}
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}