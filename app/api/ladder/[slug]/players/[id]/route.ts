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
// When rank changes, all other players at >= new rank shift down by 1 first.
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug, id } = await params;
    const body = await request.json();
    const supabase = getSupabase();

    if (body.rank != null) {
      const newRank = parseInt(body.rank);
      if (isNaN(newRank) || newRank < 1) {
        return NextResponse.json({ error: "Invalid rank" }, { status: 400 });
      }

      // Find the location_id for this slug
      const { data: loc, error: locErr } = await supabase
        .from("ladder_locations")
        .select("id")
        .eq("slug", slug)
        .single();
      if (locErr || !loc) throw new Error("Location not found");

      // Get the player's current rank so we know which direction they moved
      const { data: current, error: curErr } = await supabase
        .from("ladder_players")
        .select("rank")
        .eq("id", id)
        .single();
      if (curErr || !current) throw new Error("Player not found");

      const oldRank = current.rank;

      if (newRank !== oldRank) {
        // Temporarily move player out of the way to avoid unique constraint conflicts
        await supabase.from("ladder_players").update({ rank: -1 }).eq("id", id);

        if (newRank < oldRank) {
          // Moving up: shift everyone between newRank and oldRank-1 down by 1
          const { data: toShift } = await supabase
            .from("ladder_players")
            .select("id, rank")
            .eq("location_id", loc.id)
            .neq("id", id)
            .gte("rank", newRank)
            .lt("rank", oldRank)
            .order("rank", { ascending: false });

          for (const p of toShift ?? []) {
            await supabase.from("ladder_players").update({ rank: p.rank + 1 }).eq("id", p.id);
          }
        } else {
          // Moving down: shift everyone between oldRank+1 and newRank up by 1
          const { data: toShift } = await supabase
            .from("ladder_players")
            .select("id, rank")
            .eq("location_id", loc.id)
            .neq("id", id)
            .gt("rank", oldRank)
            .lte("rank", newRank)
            .order("rank", { ascending: true });

          for (const p of toShift ?? []) {
            await supabase.from("ladder_players").update({ rank: p.rank - 1 }).eq("id", p.id);
          }
        }
      }

      // Place the player at the target rank
      const updates: Record<string, unknown> = { rank: newRank };
      if (body.name != null) updates.name = body.name.trim().slice(0, 60);

      const { data, error } = await supabase
        .from("ladder_players")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      // Repack all ranks to be perfectly sequential 1..N, preserving order
      const { data: all } = await supabase
        .from("ladder_players")
        .select("id, rank")
        .eq("location_id", loc.id)
        .order("rank", { ascending: true });

      for (let i = 0; i < (all ?? []).length; i++) {
        const p = all![i];
        if (p.rank !== i + 1) {
          await supabase.from("ladder_players").update({ rank: i + 1 }).eq("id", p.id);
        }
      }

      return NextResponse.json({ player: data });
    }

    // Name-only update
    const { data, error } = await supabase
      .from("ladder_players")
      .update({ name: body.name.trim().slice(0, 60) })
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
