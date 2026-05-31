// app/api/admin/featured-collections/collection-products/route.ts

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("collection_products")
      .select("*");

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      collection_id,
      name,
      slug,
      description,
      price,
      is_active,
    } = body;

    // Get collection SKU prefix
    const { data: collection, error: collectionError, } = await supabaseAdmin
      .from("collections")
      .select("sku_prefix")
      .eq("id", collection_id)
      .single();

    if (collectionError || !collection) {
      throw new Error("Collection not found");
    }

    // Count existing products in this collection
    const { count, error: countError, } = await supabaseAdmin
      .from("collection_products")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("collection_id", collection_id);

    if (countError) {
      throw new Error(countError.message);
    }

    const sku = `${collection.sku_prefix}-${String(
      (count || 0) + 1
    ).padStart(3, "0")}`;

    const { data, error, } = await supabaseAdmin
      .from("collection_products")
      .insert({
        collection_id,
        sku,
        name,
        slug,
        description,
        price,
        is_active,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data,
    });
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