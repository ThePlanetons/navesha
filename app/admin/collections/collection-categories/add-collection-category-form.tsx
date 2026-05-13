"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

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

export default function AddCollectionCategoryForm() {
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
  } = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      slug: "",
      sort_order: 0,
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  const onSubmit = async (
    values: z.input<typeof formSchema>
  ) => {
    try {
      const response = await fetch(
        "/api/admin/collections/collection-categories",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create category"
        );
      }

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldSet className="space-y-5 gap-0">
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
                  const value =
                    e.target.value;

                  setValue(
                    "name",
                    value
                  );

                  setValue(
                    "slug",
                    value
                      .toLowerCase()
                      .replace(
                        /[^a-z0-9\s-]/g,
                        ""
                      )
                      .replace(
                        /\s+/g,
                        "-"
                      )
                      .trim()
                  );
                }}
              />

              <FieldDescription>
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
            <FieldLabel>Slug</FieldLabel>

            <FieldContent>
              <Input
                placeholder="featured-universes"
                {...register("slug")}
              />

              <FieldDescription>
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

              <FieldDescription>
                Lower numbers appear first
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

                <FieldDescription>
                  Enable or disable this category
                </FieldDescription>
              </FieldContent>

              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) =>
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Category
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}