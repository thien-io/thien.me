import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

function checkAdmin(request: Request) {
  const key = request.headers.get("x-admin-key");
  const secret = process.env.ADMIN_SECRET;
  return secret && key === secret;
}

// PATCH /api/ladder/[slug]/players/[id] — update rank and/or name  (admin)
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.rank != null) updates.rank = body.rank;
    if (body.name != null) updates.name = body.name.trim().slice(0, 60);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("ladder_players")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ player: data });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/ladder/[slug]/players/[id]  (admin)
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const supabase = getSupabase();
    const { error } = await supabase.from("ladder_players").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
