"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Image {
  id: string
  src: string
  alt: string
  aspectRatio: "square" | "portrait" | "landscape" | "wide" | "tall"
}

// Sample images data - simplified
const sampleImages: Image[] = [
  {
    id: "1",
    src: "/photos/twin-lakes-court-1.jpg",
    alt: "Photo 1",
    aspectRatio: "tall",
  },
  {
    id: "2",
    src: "/photos/tennis-court-3.webp",
    alt: "Photo 2",
    aspectRatio: "tall",
  },
  {
    id: "3",
    src: "/photos/tennis-court-4.webp",
    alt: "Photo 3",
    aspectRatio: "wide",
  },
  {
    id: "4",
    src: "/photos/tennis-court-2.webp",
    alt: "Photo 4",
    aspectRatio: "square",
  },
  {
    id: "5",
    src: "/photos/tennis-court-5.webp",
    alt: "Photo 5",
    aspectRatio: "portrait",
  },
  {
    id: "6",
    src: "/photos/twin-lakes-court-2.jpg",
    alt: "Photo 6",
    aspectRatio: "tall",
  },
  {
    id: "7",
    src: "/photos/tennis-court-2.webp",
    alt: "Photo 1",
    aspectRatio: "square",
  },
  {
    id: "8",
    src: "/photos/tennis-court-8.webp",
    alt: "Photo 8",
    aspectRatio: "tall",
  },
  {
    id: "9",
    src: "/photos/tennis-court-9.webp",
    alt: "Photo 9",
    aspectRatio: "wide",
  },
  {
    id: "10",
    src: "/photos/tennis-court-10.webp",
    alt: "Photo 10",
    aspectRatio: "square",
  },
  {
    id: "11",
    src: "/photos/tennis-court-11.webp",
    alt: "Photo 11",
    aspectRatio: "portrait",
  },
  {
    id: "12",
    src: "/photos/retro-tennis-court-3.jpg",
    alt: "Photo 12",
    aspectRatio: "landscape",
  },
]

export function ImageGallery() {
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setImages(sampleImages)
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const openLightbox = (image: Image) => {
    const index = images.findIndex((img) => img.id === image.id)
    setSelectedImage(image)
    setSelectedIndex(index)
  }

  const navigateImage = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev" ? (selectedIndex - 1 + images.length) % images.length : (selectedIndex + 1) % images.length

    setSelectedIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  // Get bento grid class based on aspect ratio - mobile gets single column
  const getBentoClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case "wide":
        return "col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
      case "tall":
        return "col-span-1 row-span-1 md:row-span-2 lg:row-span-2"
      case "portrait":
        return "col-span-1 row-span-1 md:row-span-2 lg:row-span-2"
      case "landscape":
        return "col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
      default:
        return "col-span-1 row-span-1"
    }
  }

  // Get mobile aspect ratio class to fill width without negative space
  const getMobileAspectClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case "wide":
      case "landscape":
        return "aspect-[4/3]" // Slightly wider for landscape images
      case "tall":
      case "portrait":
        return "aspect-[3/4]" // Taller for portrait images
      default:
        return "aspect-square" // Square for default
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="mb-40 max-w-full">
        {/* Mobile: Single column with proper aspect ratios */}
        <div className="block md:hidden space-y-4">
          {Array.from({ length: 12 }).map((_, i) => {
            const aspectRatio = sampleImages[i]?.aspectRatio || "square"
            return <Skeleton key={i} className={`rounded-none w-full ${getMobileAspectClass(aspectRatio)}`} />
          })}
        </div>

        {/* Desktop: Bento grid skeleton */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {Array.from({ length: 12 }).map((_, i) => {
            const aspectRatio = sampleImages[i]?.aspectRatio || "square"
            return <Skeleton key={i} className={`rounded-none ${getBentoClass(aspectRatio)}`} />
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-40 max-w-full">
        {/* Mobile: Single column layout */}
        <div className="block md:hidden">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                custom={index}
                whileHover={{
                  y: -4,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className={`relative group cursor-pointer rounded-none overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full ${getMobileAspectClass(image.aspectRatio)}`}
                onClick={() => openLightbox(image)}
              >
                {/* Image */}
                <motion.img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {/* Simple hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/10"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop: Bento Grid */}
        <div className="hidden md:block">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]"
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                custom={index}
                whileHover={{
                  y: -4,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className={`relative group cursor-pointer rounded-none overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${getBentoClass(image.aspectRatio)}`}
                onClick={() => openLightbox(image)}
              >
                {/* Image */}
                <motion.img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {/* Simple hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/10"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Simplified Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 dark:bg-black/95 bg-white z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("prev")
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("next")
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image */}
            <motion.img
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
