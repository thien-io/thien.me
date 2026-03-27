import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize inside handlers so env vars are always resolved at request time,
// not at module load time (which breaks in some production environments).
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("guestbook")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

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
    const { name, message } = body;

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name and message are required." },
        { status: 400 }
      );
    }

    if (name.length > 60 || message.length > 300) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("guestbook")
      .insert([{ name: name.trim(), message: message.trim() }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ entry: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
