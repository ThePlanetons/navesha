// app/api/admin/featured-collections/collections/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type Params = Promise<{
  id: string;
}>;

export async function GET(
  request: Request,
  context: {
    params: Params;
  }
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();

    const { data, error } =
      await supabase
        .from(
          "collections"
        )
        .select("*")
        .eq(
          "collection_id",
          id
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        );

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

    return NextResponse.json(
      data
    );
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

export async function PUT(request: NextRequest, { params, }: { params: Promise<{ id: string; }>; }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const supabase = await createClient();

    const { data, error } =
      await supabase
        .from(
          "collections"
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