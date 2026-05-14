"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import {
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CollectionImage = {
  id: string;

  image_url: string;

  image_type:
  | "banner"
  | "thumbnail"
  | "gallery";

  sort_order: number;
};

type Props = {
  collection: {
    id: string;
    title: string;
  };
};

export default function CollectionImagesManager({
  collection,
}: Props) {
  const [images, setImages] = useState<CollectionImage[]>([]);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `/api/admin/collections/popular-collections/${collection.id}`
      );

      const data = await response.json();

      setImages(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      formData.append("collection_id", collection.id);

      const response = await fetch(
        "/api/admin/collections/upload",
        {
          method: "POST",

          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Upload failed"
        );
      }

      fetchImages();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const updateImageType =
    async (
      imageId: string,
      imageType: string
    ) => {
      try {
        await fetch(
          `/api/admin/collections/collection-images/${imageId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              image_type:
                imageType,
            }),
          }
        );

        fetchImages();
      } catch (error) {
        console.error(error);
      }
    };

  const deleteImage = async (
    imageId: string
  ) => {
    try {
      await fetch(
        `/api/admin/collections/collection-images/${imageId}`,
        {
          method: "DELETE",
        }
      );

      fetchImages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      <Card className="rounded-3xl border-dashed py-0 gap-0">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
          <div className="rounded-full border p-4">
            <Upload className="h-6 w-6" />
          </div>

          <div className="text-center">
            <h3 className="font-medium">
              Upload Image
            </h3>

            <p className="text-sm text-muted-foreground">
              Banner, thumbnail,
              or gallery image
            </p>
          </div>

          <label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={
                uploadImage
              }
            />

            <Button
              type="button"
              className="rounded-xl"
              disabled={
                uploading
              }
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload Image
                  </>
                )}
              </span>
            </Button>
          </label>
        </CardContent>
      </Card>

      {/* Images */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden rounded-3xl py-0 gap-0"
          >
            <div className="relative aspect-square">
              <Image
                src={
                  image.image_url
                }
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <CardContent className="space-y-3 p-4">
              <Select
                value={
                  image.image_type
                }
                onValueChange={(
                  value
                ) =>
                  updateImageType(
                    image.id,
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="banner">
                    Banner
                  </SelectItem>

                  <SelectItem value="thumbnail">
                    Thumbnail
                  </SelectItem>

                  <SelectItem value="gallery">
                    Gallery
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="destructive"
                className="w-full rounded-xl"
                onClick={() =>
                  deleteImage(
                    image.id
                  )
                }
              >
                <Trash2 className="h-4 w-4" />

                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}