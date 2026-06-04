import CollectionsView from "./collections-view";

import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function Collections() {
  const [{ data: categories }, { data: collections }] =
    await Promise.all([
      supabaseAdmin
        .from("collection_categories")
        .select("id, name, slug")
        .order("name"),

      supabaseAdmin
        .from("collections")
        .select(`
          id,
          title,
          slug,
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
          value: item.slug,
        })) ?? []
      }
      collections={collections ?? []}
    />
  );
}