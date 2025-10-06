import React from 'react';
import type { Metadata } from 'next';
import { ImageGrid } from '@/components/image-grid';
import BlurFade from '@/components/ui/blur-fade';

export const metadata: Metadata = {
  title: 'Photos',
  description: 'My Photos',
};

export default function Photos() {
  return (
    <div className='mb-40' >

      <BlurFade delay={0.2}><ImageGrid
        columns={2}
        images={[
          {
            src: '/photos/twin-lakes-court-1.jpg',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-2.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-3.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-4.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-5.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-6.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-8.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-9.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-10.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
          {
            src: '/photos/tennis-court-11.webp',
            alt: 'tennis',
            href: 'https://thientran.io',
          },
        ]}
      />

      <ImageGrid
        columns={2}
        images={[
          { src: '/photos/tennis-court-1.jpg', alt: 'Tennis' },
          { src: '/photos/retro-tennis-court-2.jpg', alt: 'Tennis' },
          { src: '/photos/retro-tennis-court-3.jpg', alt: 'Tennis' },
          { src: '/photos/retro-tennis-court-4.jpg', alt: 'Tennis' },
          { src: '/photos/retro-tennis-court-5.jpg', alt: 'Tennis' },
          { src: '/photos/retro-tennis-court-6.jpg', alt: 'Tennis' },
        ]}
      />

      <ImageGrid
        columns={4}
        images={[
          { src: '/photos/tenniscourt1.jpg', alt: 'Tennis' },
          { src: '/photos/tenniscourt2.jpg', alt: 'Tennis' },
          { src: '/photos/tenniscourt3.jpg', alt: 'Tennis' },
          { src: '/photos/tenniscourt4.jpg', alt: 'Tennis' },
          { src: '/photos/tenniscourt5.jpg', alt: 'Tennis' },
          { src: '/photos/tenniscourt6.jpg', alt: 'Tennis' },
          { src: '/photos/tenniscourt1.jpg', alt: 'Tennis' },
          { src: '/photos/tenniscourt9.jpg', alt: 'Tennis' },
        ]}
      /></BlurFade>
      
    </div>
  );
}
