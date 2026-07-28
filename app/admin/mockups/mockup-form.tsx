"use client";

import { useState } from "react";

import Image from "next/image";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Loader2, Upload, } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { toast } from "sonner";

import { Mockup } from "./page";

const formSchema = z.object({
  image_url: z.string().min(1, "Image is required"),
  name: z
    .string()
    .min(2, "Mockup name is required"),
  sort_order: z.coerce.number().min(1),
  is_active: z.boolean(),
});

type FormValues = z.input<typeof formSchema>;

type MockupFormProps = {
  initialData?: {
    id: string;
    image_url: string;
    name: string;
    sort_order: number;
    is_active: boolean;
  };
  defaultSortOrder?: number;
  onSuccess?: (mockup: Mockup) => void;
};

export default function MockupForm({ initialData, defaultSortOrder = 1, onSuccess }: MockupFormProps) {
  const isEdit = !!initialData;

  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_url: initialData?.image_url || "",
      name: initialData?.name || "",
      sort_order: initialData?.sort_order ?? defaultSortOrder,
      is_active: initialData?.is_active ?? true,
    },
  });

  const imageUrl = watch("image_url");

  const isActive = watch("is_active");

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/admin/mockups/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setValue(
        "image_url",
        data.publicUrl,
        {
          shouldValidate: true,
        }
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(
        isEdit
          ? `/api/admin/mockups/${initialData?.id}`
          : "/api/admin/mockups",
        {
          method: isEdit ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      onSuccess?.(result);

      toast.success(isEdit ? 'Mockup updated successfully' : 'Mockup created successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet className="space-y-4 gap-0">
        <FieldGroup>
          {/* Upload */}
          <Field>
            <FieldLabel>
              Mockup
            </FieldLabel>

            <FieldContent>
              <Input
                type="file"
                accept="image/*"
                onChange={
                  uploadImage
                }
              />

              <FieldDescription className="!mt-0.5">
                Upload mockup image
              </FieldDescription>

              {errors.image_url && (
                <FieldError>
                  {errors.image_url.message}
                </FieldError>
              )}

              {uploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </FieldContent>
          </Field>

          {/* Preview */}
          {imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Name */}
          <Field>
            <FieldLabel>
              Mockup Name
            </FieldLabel>

            <FieldContent>
              <Input
                placeholder="Living Room"
                {...register("name")}
                onChange={(e) => {
                  const value = e.target.value;

                  setValue("name", value);
                }}
              />

              <FieldDescription className="!mt-0.5">
                Mockup display name
              </FieldDescription>

              {errors.name && (
                <FieldError>
                  {errors.name.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {/* Sort */}
          <Field>
            <FieldLabel>
              Sort Order
            </FieldLabel>

            <FieldContent>
              <Input
                type="number"
                placeholder="1"
                {...register(
                  "sort_order"
                )}
              />

              <FieldDescription className="!mt-0.5">
                Lower number appears first
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
            <Field
              orientation="horizontal"
            >
              <FieldContent>
                <FieldTitle>
                  Active Status
                </FieldTitle>

                <FieldDescription className="!mt-0.5">
                  Make this mockup available for use.
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
          <Button type="submit" disabled={isSubmitting || uploading} className="rounded-xl">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Upload className="mr-0.5 h-4 w-4" />

                {isEdit ? "Update Mockup" : "Create Mockup"}
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}