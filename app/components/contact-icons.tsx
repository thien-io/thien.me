"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Github,
  Linkedin,
  Instagram,
  MessageCircle,
  Check,
  ExternalLink,
} from 'lucide-react';
import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
  EnvelopeClosedIcon,
  PaperPlaneIcon,
  ArrowTopRightIcon,
  CopyIcon,
} from '@radix-ui/react-icons';
import { IoLogoVenmo } from 'react-icons/io5';

import { Skeleton } from '@/components/ui/skeleton';

interface ContactMethod {
  id: string;
  name: string;
  username: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  copyable?: boolean;
}

const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    name: 'Email',
    username: 'hello@thientran.io',
    url: 'mailto:hello@thientran.io',
    icon: <PaperPlaneIcon className='h-5 w-5' />,
    color: '#3B82F6', // Blue
    copyable: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    username: '@thienio',
    url: 'https://linkedin.com/in/thienio',
    icon: <LinkedInLogoIcon className='h-5 w-5' />,
    color: '#0A66C2', // LinkedIn Blue
    copyable: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    username: '@thien-io',
    url: 'https://github.com/thien-io',
    icon: <GitHubLogoIcon className='h-5 w-5' />,
    color: '#49515C', // GitHub Dark
    copyable: true,
  },
  {
    id: 'discord',
    name: 'Discord',
    username: 'thien.io',
    url: 'https://discord.com/users/thien.io',
    icon: <DiscordLogoIcon className='h-5 w-5' />,
    color: '#5865F2', // Discord Blurple
    copyable: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    username: '@thientran.io',
    url: 'https://instagram.com/thientran.io',
    icon: <InstagramLogoIcon className='h-5 w-5' />,
    color: '#E4405F', // Instagram Pink
    copyable: true,
  },
  {
    id: 'venmo',
    name: 'Venmo',
    username: '@thienmtran',
    url: 'https://venmo.com/thienmtran',
    icon: <IoLogoVenmo />,
    color: '#3D95CE', // Venmo Blue
        copyable: true,
  },
];

export function ContactIcons() {
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Slightly faster initial load

    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Shorter copy confirmation
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Slightly faster stagger
        delayChildren: 0.1,
        staggerDirection: -1, // Bottom to top
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40, // Smaller vertical entrance
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120, // Less bouncy
        damping: 25, // Smoother damping
        duration: 0.8, // Slower overall duration
      },
    },
  };

  const usernameAndLinkWrapperVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: 'auto', // Animate width to reveal
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  if (isLoading) {
    return (
      <div className='max-w-md w-full mb-40'>
        <div className='flex flex-col space-y-3'>
          {' '}
          {/* Smaller space-y */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='flex items-center space-x-3 p-2 rounded-lg'>
              {' '}
              {/* Smaller padding */}
              <Skeleton className='h-8 w-8 rounded-md' />{' '}
              {/* Smaller icon skeleton */}
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-24 ml-auto' />{' '}
              {/* Smaller username skeleton */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='  w-full -ml-2'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='flex flex-col'
      >
        {' '}
        {/* Smaller space-y */}
        <AnimatePresence>
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.id}
              variants={itemVariants}
              custom={index}
              className='flex items-center justify-between py-2 rounded-sm cursor-pointer group border border-transparent' // Smaller padding, subtle border
              onMouseEnter={() => setHoveredId(method.id)}
              onMouseLeave={() => setHoveredId(null)}
              whileHover={{
                backgroundColor: 'var(--accent)', // Use shadcn accent for hover background
                scale: 1.01, // Even smaller scale on hover
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.99 }} // Even smaller scale on tap
              onClick={() => {
                // Only copy username on row click if the method is copyable
                if (method.copyable) {
                  copyToClipboard(method.username, method.id);
                }
                // Do nothing if not copyable, as per request
              }}
            >
              {/* Icon and Name */}
              <div className='flex items-center space-x-1'>
                {' '}
                {/* Smaller space-x */}
                <motion.div
                  className='flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center text-white ' // Smaller square container, solid color
                  style={{ color: method.color }}
                  whileHover={{ scale: 1.05 }} // Smaller icon scale on hover
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  {method.icon}
                </motion.div>
                <span className='text-sm font-normal text-gray-900 dark:text-white items-center justify-center align-middle'>
                  {' '}
                  {/* Smaller font size */}
                  {method.name}
                </span>
              </div>

              {/* Username and External Link */}
              <div className='relative flex items-center space-x-2 min-w-[150px] justify-end'>
                <div className='overflow-hidden whitespace-nowrap flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 font-mono'>
                  {' '}
                  {method.username}
                </div>
                <AnimatePresence mode='wait'>
                  {hoveredId === method.id && (
                    <motion.div
                      key='username-and-link-wrapper'
                      variants={usernameAndLinkWrapperVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      className='overflow-hidden whitespace-nowrap flex items-center space-x-1'
                    >
                      {method.url && ( // Only show link if URL exists
                        <motion.a
                          href={method.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0'
                          onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                          initial={{ opacity: 0, x: 10 }} // Initial state for roll-in
                          animate={{ opacity: 1, x: 0 }} // Animate in
                          exit={{ opacity: 0, x: 10 }} // Animate out
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          aria-label={`Open ${method.name} profile`}
                        >
                          <ArrowTopRightIcon className='h-4 w-4' />{' '}
                          {/* Slightly larger icon */}
                        </motion.a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Copy indicator for copyable items */}
                {method.copyable && (
                  <motion.div
                    className=' '
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: copiedId === method.id ? 1 : 0,
                      opacity: copiedId === method.id ? 1 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      duration: 0.5,
                    }}
                  >
                    <CopyIcon className='h-4 w-4 dark:text-green-600 text-green-600 items-center align-middle justify-center ' />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
