"use client";

import { useEffect, useState } from "react";

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

import { Textarea } from "@/components/ui/textarea";

import { Switch } from "@/components/ui/switch";

import { Label } from "@/components/ui/label";

type Category = {
  id: string;
  name: string;
};

export default function AddPopularCollectionPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/collections/collection-categories");

      const data = await response.json();

      setCategories(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const title = e.target.value;

    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/collections/popular-collections",
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

      alert("Popular collection added");

      setFormData({
        category_id: "",
        title: "",
        slug: "",
        description: "",
        sort_order: 0,
        is_active: true,
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
            Add Popular Collection
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="w-full space-y-2">
              <Label>Category</Label>

              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>

              <Input
                placeholder="Enter title"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>

              <Input
                placeholder="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>

              <Textarea
                placeholder="Enter description"
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
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

            <div className="flex items-center justify-between border rounded-xl p-4">
              <div>
                <Label>Active Status</Label>

                <p className="text-sm text-muted-foreground">
                  Enable or disable this collection
                </p>
              </div>

              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: checked,
                  }))
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Collection"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}