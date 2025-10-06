"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit3, ChevronRight, Copy, Users, MoreHorizontal, Mic, MicOff, Headphones, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface SpotifyData {
  isPlaying: boolean
  title?: string
  artist?: string
  albumImageUrl?: string
  progress_ms?: number
  duration_ms?: number
}

export function DiscordProfile() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)

  // Mock user data
  const userData = {
    username: "Thien",
    displayName: "thien.io",
    avatar: "/placeholder.svg?height=80&width=80&text=Avatar",
    customStatus: "Last song stuck in your head?",
    isOnline: true,
    hasNitro: true,
    userId: "123456789012345678",
  }

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing")
        const data = await response.json()
        setSpotifyData(data)
        if (data.progress_ms) {
          setCurrentProgress(data.progress_ms)
        }
      } catch (error) {
        console.error("Error fetching Spotify data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpotifyData()
  }, [])

  // Update progress every second when playing
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (spotifyData?.isPlaying && spotifyData.duration_ms) {
      interval = setInterval(() => {
        setCurrentProgress((prev) => Math.min(prev + 1000, spotifyData.duration_ms || 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [spotifyData?.isPlaying, spotifyData?.duration_ms])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const copyUserId = () => {
    navigator.clipboard.writeText(userData.userId)
  }

  const progressPercentage = spotifyData?.duration_ms ? (currentProgress / spotifyData.duration_ms) * 100 : 0

  return (
    <div className="w-80 bg-[#2f3136] rounded-lg shadow-2xl overflow-hidden">
      {/* Header with Avatar and Info */}
      <div className="relative bg-[#36393f] p-4">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />

        <div className="relative flex items-start space-x-4">
          {/* Avatar with Nitro border */}
          <div className="relative">
            <motion.div
              className="w-20 h-20 rounded-full p-1"
              style={{
                background: userData.hasNitro
                  ? "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)"
                  : "#4f545c",
              }}
              animate={
                userData.hasNitro
                  ? {
                      rotate: 360,
                    }
                  : {}
              }
              transition={
                userData.hasNitro
                  ? {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }
                  : {}
              }
            >
              <img
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.username}
                className="w-full h-full rounded-full object-cover"
              />
              {/* Online status */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#43b581] rounded-full border-4 border-[#36393f]" />
            </motion.div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-white">
            <h2 className="text-xl font-semibold">{userData.username}</h2>
            <p className="text-sm text-gray-300 mb-2">{userData.displayName}</p>

            {/* Custom Status */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-xs">💭</span>
              </div>
              <span>{userData.customStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spotify Activity */}
      <div className="p-4 border-b border-[#40444b]">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-[#40444b]" />
            <div className="flex space-x-3">
              <Skeleton className="h-12 w-12 rounded bg-[#40444b]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24 bg-[#40444b]" />
                <Skeleton className="h-3 w-16 bg-[#40444b]" />
              </div>
            </div>
          </div>
        ) : spotifyData?.isPlaying ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <div className="w-4 h-4">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-[#1db954]">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <span>Listening to Spotify</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={spotifyData.albumImageUrl || "/placeholder.svg?height=48&width=48"}
                alt="Album cover"
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{spotifyData.title}</p>
                <p className="text-gray-400 text-xs truncate">by {spotifyData.artist}</p>

                {/* Progress Bar */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-400">{formatTime(currentProgress)}</span>
                  <div className="flex-1 h-1 bg-[#4f545c] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {spotifyData.duration_ms ? formatTime(spotifyData.duration_ms) : "0:00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No music playing</div>
        )}
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#40444b] p-3 h-auto"
        >
          <Edit3 className="h-4 w-4 mr-3" />
          Edit Profile
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#40444b] p-3 h-auto"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-[#43b581] rounded-full mr-3" />
            Online
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#40444b] p-3 h-auto"
        >
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-3" />
            Switch Accounts
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#40444b] p-3 h-auto"
          onClick={copyUserId}
        >
          <Copy className="h-4 w-4 mr-3" />
          Copy User ID
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="bg-[#292b2f] p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={userData.avatar || "/placeholder.svg"} alt={userData.username} className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-white text-sm font-medium">{userData.username}</p>
            <p className="text-gray-400 text-xs">{userData.displayName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${isMuted ? "text-red-400 bg-red-400/20" : "text-gray-400 hover:text-white"}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${isDeafened ? "text-red-400 bg-red-400/20" : "text-gray-400 hover:text-white"}`}
            onClick={() => setIsDeafened(!isDeafened)}
          >
            <Headphones className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
