import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import About from '../about/about';
import Blog from '../blog/blog';
import Photos from '@/photos/photos';
import Contact from '@/contact/contact';
import { NowPlaying } from './now-playing';
import { TopTracks } from './top-tracks';
import { contact } from '@/data/contact';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { formatDate, getBlogPosts } from 'app/lib/posts';
import BlurFade from 'app/components/ui/blur-fade';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ImageGrid } from '@/components/image-grid';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContactIcons } from './contact-icons';
import { ImageGallery } from './image-gallery';
interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  customID?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1,
      duration: 1,
    },
  },
};

export function HeroTabs() {
  let allBlogs = getBlogPosts();

  return (
    <Tabs defaultValue='start' className='pr- '>
      <TabsList className='flex flex-col items-start mt-40 mb-20 bg-transparent -ml-4 '>
        <TabsTrigger value='about'>About</TabsTrigger>
        <TabsTrigger value='blog'>Blog</TabsTrigger>
        <TabsTrigger value='photos'>Photos</TabsTrigger>
        <TabsTrigger value='contact'>Contact</TabsTrigger>
      </TabsList>
      <TabsContent value='start'>
        <p className='text-lg font-serif tracking-wide'>I teach tennis.</p>
      </TabsContent>
      <TabsContent value='about'>
        <About />
      </TabsContent>
      <TabsContent value='blog'>
        <Blog />
      </TabsContent>
      <TabsContent value='photos'>
        <ImageGallery />
      </TabsContent>
      <TabsContent value='contact'>
        <ContactIcons />
      </TabsContent>
    </Tabs>
  );
}
