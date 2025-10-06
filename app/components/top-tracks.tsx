"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Play, TrendingUp, ChevronRight } from "lucide-react"
import { AlbumCarousel } from "@/components/album-carousel"

interface Track {
  artist: string
  songUrl: string
  title: string
  albumImageUrl: string
  album: string
  popularity?: number
  preview_url?: string
}

export function TopTracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchTopTracks() {
      try {
        const response = await fetch("/api/spotify/top-tracks", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()
        setTracks(data.tracks || [])
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching top tracks:", error)
        setIsLoading(false)
      }
    }

    fetchTopTracks()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-8 w-full">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-4">
            <Skeleton className="h-5 md:h-6 w-32 md:w-48" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <div className="w-full overflow-hidden">
            <div className="flex space-x-3 md:space-x-4 px-3 md:px-12">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <Skeleton className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-lg" />
                  <div className="mt-2 space-y-1">
                    <Skeleton className="h-3 w-24 md:w-32" />
                    <Skeleton className="h-2 md:h-3 w-16 md:w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2 px-4">
          <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-md">
              <Skeleton className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded flex-shrink-0" />
              <div className="flex-1 space-y-1 min-w-0">
                <Skeleton className="h-3 md:h-4 w-3/4" />
                <Skeleton className="h-2 md:h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const displayedTracks = showAll ? tracks : tracks.slice(0, 20)

  return (
    <div className='space-y-6 md:space-y-8 w-full mt-20 mb-20'>
      {/* Album Carousel - Now showing all 50 tracks */}
      <div className='w-full'>
        <div className='flex items-center space-x-2 mb-4 md:mb-6 px-4'>
          <h3 className='text-base md:text-lg font-semibold text-zinc-900 dark:text-white'>
            Top Tracks
          </h3>
          <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
        </div>
        <AlbumCarousel tracks={tracks} />

        {/* Gallery stats */}
      </div>

      {/* Track List */}
    </div>
  );
}
