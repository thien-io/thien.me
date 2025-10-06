import { getNowPlaying } from "@/lib/spotify"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const response = await getNowPlaying()

    const nextResponse = NextResponse.json(response)

    // Prevent caching
    nextResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    nextResponse.headers.set("Pragma", "no-cache")
    nextResponse.headers.set("Expires", "0")

    return nextResponse
  } catch (error) {
    console.error("Error fetching now playing:", error)
    return NextResponse.json({ error: "Error fetching now playing" }, { status: 500 })
  }
}
