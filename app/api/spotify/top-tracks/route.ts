import { getTopTracks } from "@/lib/spotify"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const response = await getTopTracks()
    const { items } = response

    // Get all 50 tracks instead of limiting to 10
    const tracks = items.map((track: any) => ({
      artist: track.artists.map((_artist: any) => _artist.name).join(", "),
      songUrl: track.external_urls.spotify,
      title: track.name,
      albumImageUrl: track.album.images[0]?.url || track.album.images[1]?.url,
      album: track.album.name,
      popularity: track.popularity,
      preview_url: track.preview_url,
    }))

    const nextResponse = NextResponse.json({ tracks })
    nextResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    nextResponse.headers.set("Pragma", "no-cache")
    nextResponse.headers.set("Expires", "0")
    return nextResponse
  } catch (error) {
    console.error("Error fetching top tracks:", error)
    return NextResponse.json({ error: "Error fetching top tracks" }, { status: 500 })
  }
}
