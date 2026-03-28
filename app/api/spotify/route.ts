import { NextResponse } from "next/server";

// Force dynamic — prevents Next.js from caching this route at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

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
    // Tell Next.js fetch cache to never cache this token request
    cache: "no-store",
  });
  return res.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      // Never cache the now-playing response
      cache: "no-store",
    });

    if (res.status === 204 || res.status > 400) {
      return NextResponse.json(
        { isPlaying: false },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    const song = await res.json();
    if (!song || !song.item) {
      return NextResponse.json(
        { isPlaying: false },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    return NextResponse.json(
      {
        isPlaying: song.is_playing,
        title: song.item.name,
        artist: song.item.artists
          .map((a: { name: string }) => a.name)
          .join(", "),
        album: song.item.album.name,
        albumArt: song.item.album.images[0]?.url,
        songUrl: song.item.external_urls.spotify,
      },
      // Tell browsers and CDNs never to cache this response
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { isPlaying: false },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
