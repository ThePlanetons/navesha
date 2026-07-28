import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";


export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } = await params;


    const body = await req.json();


    const {
      frame_x,
      frame_y,
      frame_width,
      frame_height,
    } = body;


    if (
      frame_x === undefined ||
      frame_y === undefined ||
      frame_width === undefined ||
      frame_height === undefined
    ) {
      return NextResponse.json(
        {
          message: "Frame coordinates are required",
        },
        {
          status: 400,
        }
      );
    }


    const {
      data,
      error,
    } = await supabaseAdmin
      .from("mockups")
      .update({
        frame_x,
        frame_y,
        frame_width,
        frame_height
      })
      .eq(
        "id",
        id
      )
      .select()
      .single();


    if (error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        mockup: data,
      },
      {
        status: 200,
      }
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