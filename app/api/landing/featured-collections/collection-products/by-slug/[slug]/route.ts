import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    const { data, error, } = await supabaseAdmin
      .from("collections")
      .select(`
        id,
        title,
        slug,
        collection_products (
          id,
          sku,
          name,
          slug,
          price,
          collection_product_images (
            id,
            image_url,
            image_role,
            sort_order
          )
        )
      `)
      .eq("slug", slug)
      .single();

    if (error || !data) {
      throw new Error("Collection not found");
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