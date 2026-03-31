import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10";

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
    const res = await fetch(TOP_TRACKS_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ tracks: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    const data = await res.json();
    const tracks = (data.items || []).map((item: {
      name: string;
      artists: { name: string }[];
      album: { name: string; images: { url: string }[] };
      duration_ms: number;
      external_urls: { spotify: string };
    }, i: number) => ({
      rank: i + 1,
      title: item.name,
      artist: item.artists.map((a) => a.name).join(", "),
      album: item.album.name,
      albumArt: item.album.images[1]?.url || item.album.images[0]?.url,
      duration: `${Math.floor(item.duration_ms / 60000)}:${String(Math.floor((item.duration_ms % 60000) / 1000)).padStart(2, "0")}`,
      url: item.external_urls.spotify,
    }));

    return NextResponse.json(
      { tracks },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({ tracks: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
