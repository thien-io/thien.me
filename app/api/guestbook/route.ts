import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entries: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, message } = body;

  if (!name || !message) {
    return NextResponse.json(
      { error: "Name and message are required." },
      { status: 400 }
    );
  }

  if (name.length > 60 || message.length > 300) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("guestbook")
    .insert([{ name: name.trim(), message: message.trim() }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entry: data }, { status: 201 });
}
