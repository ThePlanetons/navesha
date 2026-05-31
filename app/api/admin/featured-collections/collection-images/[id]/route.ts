// app/api/admin/featured-collections/collection-images/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Params = Promise<{
  id: string;
}>;

export async function PUT(request: NextRequest, context: { params: Params }) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("collection_images")
      .update({ image_type: body.image_type, })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message,
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

export async function DELETE(_request: NextRequest, context: { params: Params; }) {
  try {
    const { id } = await context.params;

    // -----------------------------------
    // Get image first
    // -----------------------------------
    const { data: image, error: fetchError, } = await supabaseAdmin
      .from("collection_images")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !image) {
      throw new Error("Image not found");
    }

    // -------------------------
    // Delete storage file
    // -------------------------
    const path = image.image_url.split("/storage/v1/object/public/uploads/")[1];

    if (path) {
      const { error: storageError, } = await supabaseAdmin.storage
        .from("uploads")
        .remove([path]);

      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    // -----------------------------------
    // Delete DB row
    // -----------------------------------
    const { error: deleteError, } = await supabaseAdmin
      .from("collection_images")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image deleted successfully",
      }
    );
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