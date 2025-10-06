"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Playlist {
  id: string
  name: string
  description: string
  imageUrl: string
  trackCount: number
  playlistUrl: string
  isPublic: boolean
}

export function PlaylistCarousel() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      return () => container.removeEventListener("scroll", checkScrollButtons)
    }
  }, [playlists])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 250 : 350
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const response = await fetch("/api/spotify/playlists", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()
        const publicPlaylists = data.playlists?.filter((playlist: Playlist) => playlist.isPublic) || []
        setPlaylists(publicPlaylists)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching playlists:", error)
        setIsLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex space-x-3 md:space-x-4 px-3 md:px-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-40 sm:w-44 md:w-52">
              <Skeleton className="w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-lg" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 md:h-4 w-3/4" />
                <Skeleton className="h-2 md:h-3 w-1/2" />
                <Skeleton className="h-2 md:h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">No public playlists found</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div
        className="relative group w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow */}
        <Button
          onClick={() => scroll("left")}
          variant="ghost"
          size="sm"
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 md:h-10 md:w-10 p-0 rounded-full bg-black/70 hover:bg-black/90 text-white shadow-lg transition-all duration-300 ${
            !isMobile && canScrollLeft && isHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        {/* Scrollable Container - Constrained to viewport */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto carousel-container space-x-3 md:space-x-4 pb-4 px-3 md:px-12"
          style={{
            WebkitOverflowScrolling: "touch",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex-shrink-0 w-40 sm:w-44 md:w-52 group/item cursor-pointer">
              <a href={playlist.playlistUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative">
                  <img
                    src={playlist.imageUrl || "/placeholder.svg?height=208&width=208"}
                    alt={`${playlist.name} playlist cover`}
                    className="w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 object-cover rounded-lg shadow-md group-hover/item:shadow-xl transition-all duration-200 group-hover/item:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <div className="bg-green-500 rounded-full p-3 md:p-4 shadow-lg">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm md:text-base leading-tight">
                    {playlist.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {playlist.trackCount} tracks
                  </p>
                  {playlist.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 mt-1 leading-tight">
                      {playlist.description}
                    </p>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          onClick={() => scroll("right")}
          variant="ghost"
          size="sm"
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 md:h-10 md:w-10 p-0 rounded-full bg-black/70 hover:bg-black/90 text-white shadow-lg transition-all duration-300 ${
            !isMobile && canScrollRight && isHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  )
}
