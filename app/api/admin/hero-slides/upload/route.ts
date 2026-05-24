import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request
) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "File is required",
        },
        {
          status: 400,
        }
      );
    }

    const fileExt =
      file.name
        .split(".")
        .pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const filePath = `hero-slides/${fileName}`;

    const {
      error: uploadError,
    } = await supabaseAdmin.storage
      .from("uploads")
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "3600",

          upsert: false,
        }
      );

    if (uploadError) {
      return NextResponse.json(
        {
          error:
            uploadError.message,
        },
        {
          status: 400,
        }
      );
    }

    const { data } =
      supabaseAdmin.storage
        .from(
          "uploads"
        )
        .getPublicUrl(
          filePath
        );

    return NextResponse.json({
      publicUrl:
        data.publicUrl,
    });
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