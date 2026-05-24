import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request
) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    const collectionId = formData.get("collection_id") as string;

    const imageType = (formData.get("image_type") as string) || "gallery";

    if (!file) {
      return NextResponse.json(
        {
          error: "File is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!collectionId) {
      return NextResponse.json(
        {
          error: "Collection ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const filePath = `collection-images/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    /* Upload */
    const {
      error: uploadError,
    } =
      await supabaseAdmin.storage
        .from("uploads")
        .upload(
          filePath,
          buffer,
          {
            contentType: file.type,

            upsert: false,
          }
        );

    if (uploadError) {
      return NextResponse.json(
        {
          error: uploadError.message,
        },
        {
          status: 500,
        }
      );
    }

    /* Public URL */
    const { data } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(
        filePath
      );

    /* Insert DB Record */
    const { data: imageRecord, error: dbError, } = await supabaseAdmin
      .from(
        "collection_images"
      )
      .insert({
        collection_id: collectionId,
        image_url: data.publicUrl,
        image_type: imageType,
        sort_order: 0,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json(
        {
          error: dbError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      image: imageRecord,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}