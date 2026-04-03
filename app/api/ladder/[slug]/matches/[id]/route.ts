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

// DELETE /api/ladder/[slug]/matches/[id]  (admin)
// Note: does NOT undo win/loss counters — admin should adjust manually if needed
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const supabase = getSupabase();
    const { error } = await supabase.from("ladder_matches").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
