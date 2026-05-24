// app/api/admin/upload/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request
) {
  try {
    const formData = await request.formData();

    const file =
      formData.get(
        "file"
      ) as File;

    if (!file) {
      throw new Error(
        "File is required"
      );
    }

    // -------------------------
    // File validation
    // -------------------------

    if (!file.type.startsWith("image/")
    ) {
      throw new Error(
        "Only image files are allowed"
      );
    }

    // -------------------------
    // Generate filename
    // -------------------------

    const extension = file.name.split(".").pop();

    const fileName = `collection-products/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    // -------------------------
    // Upload to storage
    // -------------------------

    const {
      error: uploadError,
    } =
      await supabaseAdmin.storage
        .from("uploads")
        .upload(
          fileName,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
          }
        );

    if (uploadError) {
      throw new Error(
        uploadError.message
      );
    }

    // -------------------------
    // Get public URL
    // -------------------------

    const {
      data: publicUrlData,
    } =
      supabaseAdmin.storage
        .from("uploads")
        .getPublicUrl(
          fileName
        );

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
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