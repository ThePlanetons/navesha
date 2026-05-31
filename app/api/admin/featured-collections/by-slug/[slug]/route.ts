import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    // -------------------------
    // Get collection
    // -------------------------
    const { data: collection, error: collectionError, } = await supabaseAdmin
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .single();

    if (collectionError || !collection) {
      throw new Error("Collection not found");
    }

    return NextResponse.json(collection || []
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