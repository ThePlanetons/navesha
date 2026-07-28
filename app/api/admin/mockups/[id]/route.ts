import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Params = Promise<{
  id: string;
}>;

// =========================
// UPDATE MOCKUP
// =========================

export async function PUT(request: NextRequest, context: { params: Params; }) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const { data, error, } = await supabaseAdmin
      .from("mockups")
      .update({
        image_url: body.image_url,
        name: body.name,
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

    const path = data.image_url.split(
      "/storage/v1/object/public/uploads/"
    )[1];

    const folder = path.split("/").slice(0, -1).join("/");

    const filename = path.split("/").pop();

    const { data: storageData } = await supabaseAdmin.storage
      .from("uploads")
      .list(folder, {
        search: filename,
      });

    return NextResponse.json({
      ...data, image_exists: !!storageData?.length,
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

// =========================
// DELETE MOCKUP
// =========================

export async function DELETE(_request: NextRequest, context: { params: Params; }) {
  try {
    const { id } = await context.params;

    // -------------------------
    // Get image
    // -------------------------

    const { data: mockup, error: fetchError, } = await supabaseAdmin
      .from("mockups")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError || !mockup) {
      throw new Error("Mockup not found");
    }

    // -------------------------
    // Extract storage path
    // -------------------------

    const path = mockup.image_url.split("/storage/v1/object/public/uploads/")[1];

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
      .from("mockups")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Mockup deleted successfully",
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