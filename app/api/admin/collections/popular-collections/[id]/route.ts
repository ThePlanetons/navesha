// app/api/admin/collections/popular-collections/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest, { params, }: { params: Promise<{ id: string; }>; }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const supabase = await createClient();

    const { data, error } =
      await supabase
        .from(
          "popular_collections"
        )
        .update(body)
        .eq("id", id)

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