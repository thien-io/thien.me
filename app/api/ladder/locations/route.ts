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

// GET /api/ladder/locations — list all locations (id, slug, name only)
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("ladder_locations")
      .select("id, slug, name")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ locations: data ?? [] });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/ladder/locations — create a new ladder location (admin)
export async function POST(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, slug } = await request.json();
    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }
    // Sanitize slug: lowercase, only letters/numbers/hyphens
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (!cleanSlug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("ladder_locations")
      .insert([{ name: name.trim().slice(0, 100), slug: cleanSlug }])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ location: data }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
