'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Calendar,
  Moon,
  Sun,
  Mail,
  Github,
  Linkedin,
  Instagram,
  MessageCircle,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  progress_ms?: number;
  duration_ms?: number;
}

// Sound bars component for music visualization
function SoundBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <>
      <div className='flex items-end space-x-0.5 h-4'>
        <div
          className={`w-0.5 bg-[#1db954] rounded-full sound-bar-1 ${
            isPlaying ? '' : 'paused'
          }`}
        />
        <div
          className={`w-0.5 bg-[#1db954] rounded-full sound-bar-2 ${
            isPlaying ? '' : 'paused'
          }`}
        />
        <div
          className={`w-0.5 bg-[#1db954] rounded-full sound-bar-3 ${
            isPlaying ? '' : 'paused'
          }`}
        />
        <div
          className={`w-0.5 bg-[#1db954] rounded-full sound-bar-4 ${
            isPlaying ? '' : 'paused'
          }`}
        />
      </div>
      <style jsx>{`
        .sound-bar-1 {
          height: 60%;
          animation: soundbar1 1.2s ease-in-out infinite;
        }

        .sound-bar-2 {
          height: 100%;
          animation: soundbar2 1.5s ease-in-out infinite;
        }

        .sound-bar-3 {
          height: 40%;
          animation: soundbar3 1.8s ease-in-out infinite;
        }

        .sound-bar-4 {
          height: 80%;
          animation: soundbar4 1.3s ease-in-out infinite;
        }

        .sound-bar-1.paused,
        .sound-bar-2.paused,
        .sound-bar-3.paused,
        .sound-bar-4.paused {
          animation-play-state: paused;
        }

        @keyframes soundbar1 {
          0%,
          100% {
            height: 20%;
          }
          50% {
            height: 60%;
          }
        }

        @keyframes soundbar2 {
          0%,
          100% {
            height: 40%;
          }
          50% {
            height: 100%;
          }
        }

        @keyframes soundbar3 {
          0%,
          100% {
            height: 15%;
          }
          50% {
            height: 40%;
          }
        }

        @keyframes soundbar4 {
          0%,
          100% {
            height: 30%;
          }
          50% {
            height: 80%;
          }
        }
      `}</style>
    </>
  );
}

export function DiscordProfileFooter() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isModalReady, setIsModalReady] = useState(false);

  // Mock user data
  const userData = {
    username: 'Thien',
    displayName: 'thien.io',
    avatar: '/placeholder.svg?height=80&width=80&text=Avatar',
    customStatus: 'Favorite NPC companion?',
    isOnline: true,
    hasNitro: true,
    memberSince: 'Nov 25, 2016',
    connections: [
      {
        platform: 'Email',
        username: 'hello@thien.io',
        icon: <Mail className='h-4 w-4' />,
        verified: true,
        url: 'mailto:hello@thien.io',
      },
      {
        platform: 'LinkedIn',
        username: '@thientran',
        icon: <Linkedin className='h-4 w-4' />,
        verified: true,
        url: 'https://linkedin.com/in/thientran',
      },
      {
        platform: 'GitHub',
        username: '@thientran',
        icon: <Github className='h-4 w-4' />,
        verified: true,
        url: 'https://github.com/thientran',
      },
      {
        platform: 'Discord',
        username: 'thien#1782',
        icon: <MessageCircle className='h-4 w-4' />,
        verified: false,
        url: 'https://discord.com/users/thien',
      },
      {
        platform: 'Instagram',
        username: '@thientran',
        icon: <Instagram className='h-4 w-4' />,
        verified: false,
        url: 'https://instagram.com/thientran',
      },
    ],
  };

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        const data = await response.json();
        setSpotifyData(data);
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotifyData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      spotifyData?.isPlaying &&
      spotifyData.duration_ms &&
      spotifyData.progress_ms !== undefined
    ) {
      setCurrentProgress(spotifyData.progress_ms);
      interval = setInterval(() => {
        setCurrentProgress((prev) =>
          Math.min(prev + 1000, spotifyData.duration_ms || 0)
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [
    spotifyData?.isPlaying,
    spotifyData?.duration_ms,
    spotifyData?.progress_ms,
  ]);

  const getStatusText = () => {
    if (isLoading) return 'Loading...';
    if (spotifyData?.isPlaying) {
      return `Listening to ${spotifyData.artist}`;
    }
    return userData.customStatus;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here if desired
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Collapsed footer component
  const CollapsedFooter = () => (
    <motion.div
      className='bg-[#292b2f] dark:bg-[#292b2f] light:bg-gray-100 p-2 cursor-pointer hover:bg-[#32353b] dark:hover:bg-[#32353b] light:hover:bg-gray-200 transition-colors'
      onClick={() => {
        setIsModalReady(false);
        setIsExpanded(true);
      }}
      whileHover={{ backgroundColor: theme === 'dark' ? '#32353b' : '#f3f4f6' }}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2 flex-1 min-w-0'>
          {/* Avatar with Nitro border - no animation */}
          <div className='relative flex-shrink-0'>
            <div
              className='w-8 h-8 rounded-full p-0.5'
              style={{
                background: userData.hasNitro
                  ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)'
                  : theme === 'dark'
                  ? '#4f545c'
                  : '#d1d5db',
              }}
            >
              <img
                src={userData.avatar || '/placeholder.svg'}
                alt={userData.username}
                className='w-full h-full rounded-full object-cover'
              />
              {/* Online status */}
              <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#43b581] rounded-full border-2 border-[#292b2f] dark:border-[#292b2f] light:border-gray-100' />
            </div>
          </div>

          {/* User info */}
          <div className='flex-1 min-w-0'>
            <p className='text-white dark:text-white light:text-gray-900 text-sm font-medium truncate'>
              {userData.username}
            </p>
            <p className='text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs truncate'>
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className='flex items-center space-x-2 flex-shrink-0'>
          {/* Sound bars when playing */}
          {spotifyData?.isPlaying && (
            <div className='w-8 flex justify-center'>
              <SoundBars isPlaying={spotifyData.isPlaying} />
            </div>
          )}

          <Button
            variant='ghost'
            size='sm'
            className='text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 p-1.5 h-auto'
            onClick={(e) => {
              e.stopPropagation();
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
          >
            {theme === 'dark' ? (
              <Sun className='h-3 w-3' />
            ) : (
              <Moon className='h-3 w-3' />
            )}
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 p-1.5 h-auto'
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = '/contact';
            }}
          >
            <Mail className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Expanded modal component
  const ExpandedModal = () => {
    useEffect(() => {
      // Small delay to ensure smooth rendering
      const timer = setTimeout(() => setIsModalReady(true), 50);
      return () => clearTimeout(timer);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
        onClick={() => {
          setIsModalReady(false);
          setIsExpanded(false);
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className='w-80 bg-[#2f3136] dark:bg-[#2f3136] light:bg-white rounded-lg shadow-2xl overflow-hidden'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Avatar and Info */}
          <div className='relative bg-[#36393f] dark:bg-[#36393f] light:bg-gray-50 p-4'>
            {/* Background blur effect */}
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20' />

            {/* Close button */}
            <Button
              variant='ghost'
              size='sm'
              className='absolute top-2 right-2 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 p-1'
              onClick={() => {
                setIsModalReady(false);
                setIsExpanded(false);
              }}
            >
              <X className='h-4 w-4' />
            </Button>

            <div className='relative flex items-start space-x-4'>
              {/* Avatar with Nitro border - no animation */}
              <div className='relative'>
                <div
                  className='w-20 h-20 rounded-full p-1'
                  style={{
                    background: userData.hasNitro
                      ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)'
                      : theme === 'dark'
                      ? '#4f545c'
                      : '#d1d5db',
                  }}
                >
                  <img
                    src={userData.avatar || '/placeholder.svg'}
                    alt={userData.username}
                    className='w-full h-full rounded-full object-cover'
                  />
                  {/* Online status */}
                  <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-[#43b581] rounded-full border-4 border-[#36393f] dark:border-[#36393f] light:border-gray-50' />
                </div>
              </div>

              {/* User Info */}
              <div className='flex-1 text-white dark:text-white light:text-gray-900'>
                <h2 className='text-xl font-semibold'>{userData.username}</h2>
                <p className='text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 mb-2'>
                  {userData.displayName}
                </p>

                {/* Custom Status */}
                <div className='flex items-center space-x-2 text-sm text-gray-400 dark:text-gray-400 light:text-gray-500'>
                  <div className='w-4 h-4 bg-gray-500 dark:bg-gray-500 light:bg-gray-400 rounded-full flex items-center justify-center'>
                    <span className='text-xs'>💭</span>
                  </div>
                  <span>{userData.customStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Now Playing Section */}
          {spotifyData?.isPlaying && (
            <div className='p-4 border-b border-[#40444b] dark:border-[#40444b] light:border-gray-200'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-300 light:text-gray-600'>
                  <div className='w-4 h-4'>
                    <svg
                      viewBox='0 0 24 24'
                      className='w-full h-full fill-[#1db954]'
                    >
                      <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z' />
                    </svg>
                  </div>
                  <span>Listening to Spotify</span>
                </div>
                <SoundBars isPlaying={spotifyData.isPlaying} />
              </div>

              <div className='flex items-center space-x-3'>
                <img
                  src={
                    spotifyData.albumImageUrl ||
                    '/placeholder.svg?height=48&width=48'
                  }
                  alt='Album cover'
                  className='w-12 h-12 rounded object-cover'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-white dark:text-white light:text-gray-900 text-sm font-medium truncate'>
                    {spotifyData.title}
                  </p>
                  <p className='text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs truncate'>
                    by {spotifyData.artist}
                  </p>

                  {/* Progress Bar */}
                  <div className='flex items-center space-x-2 mt-2'>
                    <span className='text-xs text-gray-400 dark:text-gray-400 light:text-gray-500'>
                      {formatTime(currentProgress)}
                    </span>
                    <div className='flex-1 h-1 bg-[#4f545c] dark:bg-[#4f545c] light:bg-gray-300 rounded-full overflow-hidden'>
                      <motion.div
                        className='h-full bg-white dark:bg-white light:bg-gray-700 rounded-full'
                        style={{
                          width: `${
                            spotifyData.duration_ms
                              ? Math.min(
                                  (currentProgress / spotifyData.duration_ms) *
                                    100,
                                  100
                                )
                              : 0
                          }%`,
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <span className='text-xs text-gray-400 dark:text-gray-400 light:text-gray-500'>
                      {spotifyData.duration_ms
                        ? formatTime(spotifyData.duration_ms)
                        : '0:00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Member Since */}
          <div className='p-4 border-b border-[#40444b] dark:border-[#40444b] light:border-gray-200'>
            <h3 className='text-white dark:text-white light:text-gray-900 text-sm font-semibold mb-2'>
              Member Since
            </h3>
            <div className='flex items-center space-x-2 text-gray-300 dark:text-gray-300 light:text-gray-600 text-sm'>
              <Calendar className='h-4 w-4' />
              <span>{userData.memberSince}</span>
            </div>
          </div>

          {/* Contact Section (formerly Connections) */}
          <div className='p-4'>
            <h3 className='text-white dark:text-white light:text-gray-900 text-sm font-semibold mb-3'>
              Contact
            </h3>
            <div className='space-y-3'>
              {userData.connections.map((connection, index) => (
                <div key={index} className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-[#40444b] dark:bg-[#40444b] light:bg-gray-200 rounded flex items-center justify-center text-gray-400 dark:text-gray-400 light:text-gray-600'>
                    {connection.icon}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      <span className='text-white dark:text-white light:text-gray-900 text-sm font-medium'>
                        {connection.username}
                      </span>
                      {connection.verified && (
                        <div className='w-4 h-4 bg-[#43b581] rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 p-1'
                      onClick={() => copyToClipboard(connection.username)}
                      title='Copy username'
                    >
                      <Copy className='h-3 w-3' />
                    </Button>
                    {connection.url && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 p-1'
                        onClick={() => window.open(connection.url, '_blank')}
                        title='Open link'
                      >
                        <ExternalLink className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note Section */}
          <div className='p-4 border-t border-[#40444b] dark:border-[#40444b] light:border-gray-200'>
            <h3 className='text-white dark:text-white light:text-gray-900 text-sm font-semibold mb-2'>
              Note (only visible to you)
            </h3>
            <button className='text-[#00aff4] text-sm hover:underline'>
              Click to add a note
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <CollapsedFooter />
      <AnimatePresence>{isExpanded && <ExpandedModal />}</AnimatePresence>
    </>
  );
}
