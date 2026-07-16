import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
        id,
        order_number,
        first_name,
        last_name,
        email,
        phone,
        total,
        status,
        paid_at,
        created_at
      `)
    .order("created_at", {
      ascending: false,
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

  return NextResponse.json(data);
}