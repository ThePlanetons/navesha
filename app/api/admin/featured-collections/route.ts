// app/api/admin/featured-collections/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("collections")
      .select("*, collection_categories(name)")
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
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

export async function POST(request: Request) {
  const body = await request.json();

  const title = body.title?.trim();

  const words = title.split(/[\s-]+/).filter(Boolean);

  const firstLetter = words[0]?.[0]?.toUpperCase() || "X";

  const secondLetter =
    words[1]?.[0]?.toUpperCase() ||
    words[0]?.[1]?.toUpperCase() ||
    "X";

  const remainingChars = title
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .split("")
    .filter(
      (char: string) => char !== firstLetter && char !== secondLetter
    );

  const thirdLetter =
    remainingChars[
    Math.floor(
      Math.random() *
      remainingChars.length
    )
    ] || "X";

  const sku_prefix = `${firstLetter}${secondLetter}${thirdLetter}`;

  const { data, error } = await supabaseAdmin
    .from("collections")
    .insert([
      {
        ...body,
        sku_prefix,
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
        status: 500,
      }
    );
  }

  return NextResponse.json(data);
}
