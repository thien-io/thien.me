import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=20";

function getBasic() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Missing Spotify credentials");
  return Buffer.from(`${id}:${secret}`).toString("base64");
}

async function getAccessToken() {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refreshToken) throw new Error("Missing Spotify refresh token");
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getBasic()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  return res.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();
    const res = await fetch(PLAYLISTS_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ playlists: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    const data = await res.json();
    const playlists = (data.items || [])
      .filter((p: { public: boolean; name: string }) => p.public && p.name)
      .map((p: {
        id: string;
        name: string;
        description: string;
        tracks: { total: number };
        images: { url: string }[];
        external_urls: { spotify: string };
        owner: { display_name: string };
      }) => ({
        id: p.id,
        name: p.name,
        description: p.description
          ? p.description.replace(/<[^>]+>/g, "") // strip HTML entities Spotify sometimes adds
          : "",
        tracks: p.tracks.total,
        image: p.images?.[0]?.url || "",
        url: p.external_urls.spotify,
        owner: p.owner.display_name,
      }));

    return NextResponse.json(
      { playlists },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({ playlists: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
