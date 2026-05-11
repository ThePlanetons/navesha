import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

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

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const filePath = `collection-images/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from("uploads")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    const { data } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: data.publicUrl,
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