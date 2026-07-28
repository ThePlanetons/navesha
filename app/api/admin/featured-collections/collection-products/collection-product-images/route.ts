// app/api/admin/featured-collections/collection-products/collection-product-images/route.ts

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("product_id");

    if (!productId) {
      throw new Error(
        "Product id is required"
      );
    }

    const { data, error } = await supabaseAdmin
      .from("collection_product_images")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      product_id,
      image_url,
      image_role,
      sort_order,
    } = body;

    if (!product_id) {
      throw new Error("Product id is required");
    }

    if (!image_url) {
      throw new Error("Image URL is required");
    }

    let nextSortOrder = sort_order;

    if (nextSortOrder == null) {
      const { data: lastImage, error: lastImageError } = await supabaseAdmin
        .from("collection_product_images")
        .select("sort_order")
        .eq("product_id", product_id)
        .order("sort_order", { ascending: false, })
        .limit(1)
        .maybeSingle();

      if (lastImageError) {
        throw new Error(lastImageError.message);
      }

      nextSortOrder = lastImage ? lastImage.sort_order + 1 : 1;
    }

    const nextImageRole = image_role ?? (nextSortOrder === 1 ? "thumbnail" : "gallery");

    const { data, error } = await supabaseAdmin
      .from("collection_product_images")
      .insert({
        product_id,
        image_url,
        image_role: nextImageRole,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Image created successfully",
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