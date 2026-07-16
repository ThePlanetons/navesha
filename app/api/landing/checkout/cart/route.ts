import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const skus = request.nextUrl.searchParams.get("skus");

    if (!skus) {
      return NextResponse.json([]);
    }

    const skuList = skus.split(",");

    const { data, error, } = await supabaseAdmin
      .from("collection_products")
      .select(`
        id,
        sku,
        name,
        collection_product_images (
          id,
          image_url,
          image_role
        )
      `)
      .in(
        "sku",
        skuList
      );

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