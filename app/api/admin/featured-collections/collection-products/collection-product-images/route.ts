// app/api/admin/collections/collection-products/collection-product-images/route.ts

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest
) {
  try {
    const productId =
      request.nextUrl.searchParams.get(
        "product_id"
      );

    if (!productId) {
      throw new Error(
        "Product id is required"
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "collection_product_images"
        )
        .select("*")
        .eq(
          "product_id",
          productId
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        );

    if (error) {
      throw new Error(
        error.message
      );
    }

    return NextResponse.json(
      data
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      product_id,
      image_url,
      image_role,
      sort_order,
    } = body;

    if (!product_id) {
      throw new Error(
        "Product id is required"
      );
    }

    if (!image_url) {
      throw new Error(
        "Image URL is required"
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "collection_product_images"
        )
        .insert({
          product_id,
          image_url,
          image_role,
          sort_order,
        })
        .select()
        .single();

    if (error) {
      throw new Error(
        error.message
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Image created successfully",
        data,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}