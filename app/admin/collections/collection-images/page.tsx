"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

type Collection = {
  id: string;
  title: string;
};

export default function AddCollectionImagePage() {
  const [collections, setCollections] = useState<
    Collection[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    collection_id: "",
    image_url: "",
    image_type: "gallery",
    sort_order: 0,
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(
        "/api/admin/collections/popular-collections"
      );

      const data = await response.json();

      setCollections(data || []);
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

      const response = await fetch(
        "/api/admin/collections/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setPreview(data.url);

      setFormData((prev) => ({
        ...prev,
        image_url: data.url,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Something went wrong");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/collections/collection-images",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert("Collection image added");

      setPreview("");

      setFormData({
        collection_id: "",
        image_url: "",
        image_type: "gallery",
        sort_order: 0,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Upload Collection Image
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label>Collection</Label>

              <Select
                value={formData.collection_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    collection_id: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>

                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem
                      key={collection.id}
                      value={collection.id}
                    >
                      {collection.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Image</Label>

              <Input
                type="file"
                accept="image/*"
                onChange={uploadImage}
              />
            </div>

            <div className="space-y-2">
              <Label>Image Type</Label>

              <Select
                value={formData.image_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    image_type: value,
                  }))
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
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>

              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sort_order: Number(e.target.value),
                  }))
                }
              />
            </div>

            {preview && (
              <div className="space-y-2">
                <Label>Preview</Label>

                <div className="relative w-full h-72 rounded-xl overflow-hidden border">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || uploading}
            >
              {uploading
                ? "Uploading..."
                : loading
                  ? "Saving..."
                  : "Save Image"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}