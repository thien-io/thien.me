import { getPlaylists } from "@/lib/spotify"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const response = await getPlaylists()

    const playlists =
      response.items?.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        imageUrl: playlist.images?.[0]?.url,
        trackCount: playlist.tracks.total,
        playlistUrl: playlist.external_urls.spotify,
        isPublic: playlist.public,
      })) || []

    const nextResponse = NextResponse.json({ playlists })
    nextResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    nextResponse.headers.set("Pragma", "no-cache")
    nextResponse.headers.set("Expires", "0")

    return nextResponse
  } catch (error) {
    console.error("Error fetching playlists:", error)
    return NextResponse.json({ error: "Error fetching playlists" }, { status: 500 })
  }
}
