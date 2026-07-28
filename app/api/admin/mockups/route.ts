import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("mockups")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const mockups = await Promise.all(
      data.map(
        async (mockup) => {
          const path = mockup.image_url.split(
            "/storage/v1/object/public/uploads/"
          )[1];

          const folder = path.split("/").slice(0, -1).join("/");

          const filename = path.split("/").pop();

          const { data: storageData, } = await supabaseAdmin.storage
            .from("uploads")
            .list(folder, {
              search: filename,
            });

          return {
            ...mockup, image_exists: !!storageData?.length,
          };
        }
      )
    );

    return NextResponse.json(mockups);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error, } = await supabaseAdmin
      .from("mockups")
      .insert([
        {
          image_url: body.image_url,
          name: body.name,
          sort_order: body.sort_order,
          is_active: body.is_active,
        },
      ])
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

    const { data: storageData } =
      await supabaseAdmin.storage
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
