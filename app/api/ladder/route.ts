import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

// GET /api/ladder — list all locations with player count and last match date
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data: locations, error } = await supabase
      .from("ladder_locations")
      .select("id, slug, name");
    if (error) throw error;

    // Enforce display order
    const ORDER = ["twin-lakes", "lakeridge", "farmington-valley", "fern-park"];
    locations?.sort((a, b) => {
      const ai = ORDER.indexOf(a.slug);
      const bi = ORDER.indexOf(b.slug);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    // For each location, get all players (sorted by rank) + most recent match
    const enriched = await Promise.all(
      (locations ?? []).map(async (loc) => {
        const [playersRes, matchRes] = await Promise.all([
          supabase
            .from("ladder_players")
            .select("id, name, rank")
            .eq("location_id", loc.id)
            .order("rank", { ascending: true }),
          supabase
            .from("ladder_matches")
            .select("id, played_at")
            .eq("location_id", loc.id)
            .order("played_at", { ascending: false })
            .limit(1),
        ]);

        const players = playersRes.data ?? [];
        return {
          ...loc,
          top3: players.slice(0, 3),
          playerCount: players.length,
          lastMatchDate: matchRes.data?.[0]?.played_at ?? null,
        };
      })
    );

    return NextResponse.json({ locations: enriched }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
