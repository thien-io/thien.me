import React from 'react';
import type { Metadata } from 'next';
import { movies } from '@/data/movies';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Favorite Movies',
};

export default function MoviesPage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-medium tracking-tight'>Movies</h1>
      <div className='space-y-6'>
        {movies.map((movies, index) => (
          <a
            key={index}
            target='_blank'
            rel='noopener noreferrer'
            className='block group hover:opacity-80 transition-opacity duration-200'
          >
            <div className='flex flex-row'>
              <div className='w-full flex justify-between items-baseline'>
                <span className='text-black dark:text-white font-medium tracking-tight'>
                  {movies.title}
                </span>
              </div>
              <p className='prose prose-neutral dark:prose-invert pt-3'>
                {movies.rating}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
