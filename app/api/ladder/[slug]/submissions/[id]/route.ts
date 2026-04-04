import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

// PATCH /api/ladder/[slug]/submissions/[id]  (admin — approve or deny)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { action } = await request.json(); // 'approve' | 'deny'
    if (action !== "approve" && action !== "deny") {
      return NextResponse.json({ error: "action must be 'approve' or 'deny'" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Fetch the submission
    const { data: sub, error: subErr } = await supabase
      .from("ladder_score_submissions")
      .select("*")
      .eq("id", id)
      .single();
    if (subErr || !sub) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    if (action === "approve") {
      // Insert as a real match
      const { error: matchErr } = await supabase
        .from("ladder_matches")
        .insert([{
          location_id: sub.location_id,
          winner_id: sub.winner_id,
          loser_id: sub.loser_id,
          score: sub.score,
          played_at: sub.played_at,
        }]);
      if (matchErr) throw matchErr;

      // Update win/loss tallies
      await Promise.all([
        supabase.rpc("increment_player_wins",   { player_id: sub.winner_id }),
        supabase.rpc("increment_player_losses", { player_id: sub.loser_id }),
      ]);
    }

    // Mark submission as approved or denied
    const { error: updateErr } = await supabase
      .from("ladder_score_submissions")
      .update({ status: action === "approve" ? "approved" : "denied" })
      .eq("id", id);
    if (updateErr) throw updateErr;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/ladder/[slug]/submissions/[id]  (admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const supabase = getSupabase();
    const { error } = await supabase.from("ladder_score_submissions").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
