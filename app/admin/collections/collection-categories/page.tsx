"use client";

import { useState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AddCategoryForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sort_order: 0,
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/admin/collections/collection-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      console.log("Category Created:", data);

      setFormData({
        name: "",
        slug: "",
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
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card className="rounded-2xl shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FolderPlus className="w-6 h-6" />
            Add Category
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Category Name</Label>

              <Input
                placeholder="Featured Universes"
                name="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;

                  setFormData((prev) => ({
                    ...prev,
                    name: value,
                    slug: value
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")
                      .trim(),
                  }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>

              <Input
                placeholder="featured-universes"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>

              <Input
                type="number"
                placeholder="1"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-medium">Active Status</p>
                <p className="text-sm text-muted-foreground">
                  Enable or disable this category
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
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Add Category
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}