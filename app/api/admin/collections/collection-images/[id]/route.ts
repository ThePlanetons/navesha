import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type Params = Promise<{
  id: string;
}>;

export async function PUT(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const supabase =
      await createClient();

    const { data, error } =
      await supabase
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
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();

    // -----------------------------------
    // Get image first
    // -----------------------------------

    const {
      data: image,
      error: fetchError,
    } = await supabase
      .from(
        "collection_images"
      )
      .select(
        "image_url"
      )
      .eq("id", id)
      .single();

    if (
      fetchError ||
      !image
    ) {
      return NextResponse.json(
        {
          error: "Image not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------
    // Extract storage path
    // -----------------------------------

    const imageUrl = image.image_url;

    /**
     * Example:
     * https://xxxxx.supabase.co/storage/v1/object/public/uploads/collection-images/test.png
     *
     * Need:
     * collection-images/test.png
     */

    const path =
      imageUrl.split(
        "/storage/v1/object/public/uploads/"
      )[1];

    // -----------------------------------
    // Delete storage file
    // -----------------------------------

    const {
      error: storageError,
    } = await supabase.storage
      .from(
        "uploads"
      )
      .remove([path]);

    if (storageError) {
      return NextResponse.json(
        {
          error: storageError.message,
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------
    // Delete DB row
    // -----------------------------------

    const {
      error: deleteError,
    } = await supabase
      .from(
        "collection_images"
      )
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        {
          error: deleteError.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
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