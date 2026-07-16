import CollectionsView from "./collections-view";

import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function Collections() {
  const [{ data: categories }, { data: collections }] =
    await Promise.all([
      supabaseAdmin
        .from("collection_categories")
        .select(`
          id,
          name,
          slug,
          sort_order
        `)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),

      supabaseAdmin
        .from("collections")
        .select(`
          id,
          title,
          slug,
          category_id,
          collection_images (
            id,
            image_url,
            image_role
          )
        `),
    ]);

  return (
    <CollectionsView
      categories={
        categories?.map((item) => ({
          id: item.id,
          label: item.name,
          value: item.id,
        })) ?? []
      }
      collections={collections ?? []}
    />
  );
}