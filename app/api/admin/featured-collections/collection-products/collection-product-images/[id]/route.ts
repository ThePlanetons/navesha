// app/api/admin/collections/collection-products/collection-product-images/[id]/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  { params }: Props
) {
  try {
    const { id } =
      await params;

    // -------------------------
    // Get image
    // -------------------------

    const {
      data: image,
      error: fetchError,
    } =
      await supabaseAdmin
        .from(
          "collection_product_images"
        )
        .select("*")
        .eq("id", id)
        .single();

    if (
      fetchError ||
      !image
    ) {
      throw new Error(
        "Image not found"
      );
    }

    // -------------------------
    // Delete storage file
    // -------------------------

    const path =
      image.image_url.split(
        "/storage/v1/object/public/uploads/"
      )[1];

    if (path) {
      const {
        error: storageError,
      } =
        await supabaseAdmin.storage
          .from("uploads")
          .remove([path]);

      if (storageError) {
        throw new Error(
          storageError.message
        );
      }
    }

    // -------------------------
    // Delete DB row
    // -------------------------

    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from(
          "collection_product_images"
        )
        .delete()
        .eq("id", id);

    if (deleteError) {
      throw new Error(
        deleteError.message
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Image deleted successfully",
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