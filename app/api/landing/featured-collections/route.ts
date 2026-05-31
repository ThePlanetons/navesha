import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
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
      `)
      .eq("is_active", true)
      .order("sort_order", { ascending: true, })
      .order("sort_order", { foreignTable: "collection_images", ascending: true, });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}