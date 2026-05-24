// app/api/admin/featured-collections/collection-products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Params = Promise<{
  id: string;
}>;

export async function GET(
  _request: NextRequest,
  context: {
    params: Params;
  }
) {
  try {
    const { id } =
      await context.params;

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "collection_products"
      )
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new Error(
        "Product not found"
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

export async function PUT(
  request: NextRequest,
  context: {
    params: Params;
  }
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const {
      name,
      slug,
      description,
      price,
      is_active,
    } = body;

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "collection_products"
      )
      .update({
        name,
        slug,
        description,
        price,
        is_active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(
        error.message
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Product updated successfully",
      data,
    });
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

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Params;
  }
) {
  try {
    const { id } =
      await context.params;

    const { error } =
      await supabaseAdmin
        .from(
          "collection_products"
        )
        .delete()
        .eq("id", id);

    if (error) {
      throw new Error(
        error.message
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Product deleted successfully",
    });
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