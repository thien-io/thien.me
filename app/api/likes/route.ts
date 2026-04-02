import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("site_likes")
    .select("count")
    .eq("id", 1)
    .single();

  if (error) return NextResponse.json({ count: 0 });
  return NextResponse.json({ count: data.count });
}

export async function POST() {
  const { data, error } = await supabase.rpc("increment_likes");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: data });
}
