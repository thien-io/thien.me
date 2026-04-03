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

// GET /api/ladder/[slug]/players
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = getSupabase();
    const locationId = await getLocationId(supabase, slug);
    const { data, error } = await supabase
      .from("ladder_players")
      .select("id, name, rank, wins, losses, created_at")
      .eq("location_id", locationId)
      .order("rank", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ players: data });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/ladder/[slug]/players  (admin)
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await params;
    const { name, rank } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const supabase = getSupabase();
    const locationId = await getLocationId(supabase, slug);

    // If no rank given, place at bottom
    let finalRank = rank;
    if (finalRank == null) {
      const { count } = await supabase
        .from("ladder_players")
        .select("id", { count: "exact", head: true })
        .eq("location_id", locationId);
      finalRank = (count ?? 0) + 1;
    }

    const { data, error } = await supabase
      .from("ladder_players")
      .insert([{ location_id: locationId, name: name.trim().slice(0, 60), rank: finalRank }])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ player: data }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
