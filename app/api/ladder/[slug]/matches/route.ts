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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getLocationId(supabase: any, slug: string) {
  const { data, error } = await supabase
    .from("ladder_locations")
    .select("id")
    .eq("slug", slug)
    .single();
  if (error || !data) throw new Error("Location not found");
  return data.id as string;
}

// GET /api/ladder/[slug]/matches
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = getSupabase();
    const locationId = await getLocationId(supabase, slug);
    const { data, error } = await supabase
      .from("ladder_matches")
      .select(`
        id, score, played_at, created_at,
        winner:winner_id(id, name, rank),
        loser:loser_id(id, name, rank)
      `)
      .eq("location_id", locationId)
      .order("played_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ matches: data });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/ladder/[slug]/matches  (admin)
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await params;
    const { winner_id, loser_id, score, played_at } = await request.json();
    if (!winner_id || !loser_id || !score?.trim()) {
      return NextResponse.json({ error: "winner_id, loser_id, and score are required" }, { status: 400 });
    }
    if (winner_id === loser_id) {
      return NextResponse.json({ error: "Winner and loser must be different players" }, { status: 400 });
    }
    const supabase = getSupabase();
    const locationId = await getLocationId(supabase, slug);

    // Insert match
    const { data: match, error: matchErr } = await supabase
      .from("ladder_matches")
      .insert([{
        location_id: locationId,
        winner_id,
        loser_id,
        score: score.trim().slice(0, 80),
        played_at: played_at ?? new Date().toISOString().split("T")[0],
      }])
      .select()
      .single();
    if (matchErr) throw matchErr;

    // Update win/loss tallies
    await Promise.all([
      supabase.rpc("increment_player_wins",   { player_id: winner_id }),
      supabase.rpc("increment_player_losses", { player_id: loser_id }),
    ]);

    return NextResponse.json({ match }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
