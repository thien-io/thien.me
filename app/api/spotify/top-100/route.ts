import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOP_TRACKS_BASE = "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50";

function getBasic() {
  const id     = process.env.SPOTIFY_CLIENT_ID;
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

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  external_urls: { spotify: string };
};

function mapTrack(item: SpotifyTrack, i: number) {
  return {
    rank:          i + 1,
    title:         item.name,
    artist:        item.artists.map((a) => a.name).join(", "),
    album:         item.album.name,
    albumArt:      item.album.images[0]?.url || "",
    albumArtSmall: item.album.images[1]?.url || item.album.images[0]?.url || "",
    duration:      `${Math.floor(item.duration_ms / 60000)}:${String(Math.floor((item.duration_ms % 60000) / 1000)).padStart(2, "0")}`,
    url:           item.external_urls.spotify,
  };
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const [res1, res2] = await Promise.all([
      fetch(`${TOP_TRACKS_BASE}&offset=0`,  { headers: { Authorization: `Bearer ${access_token}` }, cache: "no-store" }),
      fetch(`${TOP_TRACKS_BASE}&offset=50`, { headers: { Authorization: `Bearer ${access_token}` }, cache: "no-store" }),
    ]);

    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

    const items = [
      ...(data1.items || []),
      ...(data2.items || []),
    ] as SpotifyTrack[];

    const tracks = items.map(mapTrack);

    return NextResponse.json(
      { tracks },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ tracks: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
