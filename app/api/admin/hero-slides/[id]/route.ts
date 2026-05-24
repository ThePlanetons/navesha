import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Params = Promise<{
  id: string;
}>;

// =========================
// UPDATE HERO SLIDE
// =========================

export async function PUT(request: NextRequest, context: { params: Params; }) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const { data, error, } = await supabaseAdmin
      .from("hero_slides")
      .update({
        image_url: body.image_url,
        sort_order: body.sort_order,
        is_active: body.is_active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      data
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// DELETE HERO SLIDE
// =========================

export async function DELETE(_request: NextRequest, context: { params: Params; }) {
  try {
    const { id } = await context.params;

    // -------------------------
    // Get image
    // -------------------------

    const { data: slide, error: fetchError, } = await supabaseAdmin
      .from("hero_slides")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError || !slide) {
      throw new Error("Slide not found");
    }

    // -------------------------
    // Extract storage path
    // -------------------------

    const path = slide.image_url.split("/storage/v1/object/public/uploads/")[1];

    // -------------------------
    // Delete image
    // -------------------------

    if (path) {
      await supabaseAdmin.storage
        .from("uploads")
        .remove([path]);
    }

    // -------------------------
    // Delete DB row
    // -------------------------

    const { error: deleteError, } = await supabaseAdmin
      .from("hero_slides")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Slide deleted successfully",
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