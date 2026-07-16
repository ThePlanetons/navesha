// app/api/admin/featured-collections/collection-products/collection-product-images/[id]/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

import { z } from "zod";

type Params = { params: Promise<{ id: string; }>; };

const formSchema = z.object({
  image_role: z.enum(["thumbnail", "gallery", "zoom"]),

  sort_order: z.coerce.number(),
});

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const body = await request.json();

    const validatedData = formSchema.parse(body);

    // -------------------------
    // Check image exists
    // -------------------------

    const { data: existingImage, error: fetchError, } = await supabaseAdmin
      .from(
        "collection_product_images"
      )
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existingImage) {
      throw new Error("Image not found");
    }

    // -------------------------
    // Update image
    // -------------------------

    const { error: updateError, } = await supabaseAdmin
      .from(
        "collection_product_images"
      )
      .update({
        image_role: validatedData.image_role,
        sort_order: validatedData.sort_order,
      })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
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

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    // -------------------------
    // Get image first
    // -------------------------
    const { data: image, error: fetchError, } = await supabaseAdmin
      .from("collection_product_images")
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

    // -------------------------
    // Delete DB row
    // -------------------------
    const { error: deleteError, } = await supabaseAdmin
      .from("collection_product_images")
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