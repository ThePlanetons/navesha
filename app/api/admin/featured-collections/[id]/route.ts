// app/api/admin/featured-collections/collections/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Params = Promise<{
  id: string;
}>;

export async function GET(
  _request: Request,
  context: {
    params: Params;
  }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
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

export async function PUT(request: NextRequest, { params, }: { params: Promise<{ id: string; }>; }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from(
        "collections"
      )
      .update(body)
      .eq("id", id)

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