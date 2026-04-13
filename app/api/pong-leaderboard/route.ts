import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("pong_leaderboard")
      .select("id, name, score, created_at")
      .order("score", { ascending: false })
      .limit(20);
    if (error) throw error;
    return NextResponse.json({ entries: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, score } = body;
    if (!name?.trim() || typeof score !== "number" || score < 0) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("pong_leaderboard")
      .insert([{ name: name.trim().slice(0, 30), score }])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ entry: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
