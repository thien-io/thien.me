import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });
  return res.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();
    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (res.status === 204 || res.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await res.json();
    if (!song || !song.item) {
      return NextResponse.json({ isPlaying: false });
    }

    return NextResponse.json({
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((a: { name: string }) => a.name).join(", "),
      album: song.item.album.name,
      albumArt: song.item.album.images[0]?.url,
      songUrl: song.item.external_urls.spotify,
    });
  } catch {
    return NextResponse.json({ isPlaying: false });
  }
}
