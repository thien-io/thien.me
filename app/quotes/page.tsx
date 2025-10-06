import React from 'react';
import type { Metadata } from 'next';
import { quotes } from '@/data/quotes';

export const metadata: Metadata = {
  title: 'Quotes',
  description: 'Favorite Quotes',
};

export default function QuotesPage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-medium tracking-tight'>Quotes</h1>
      <div className='space-y-6'>
        {quotes.map((quotes, index) => (
          <a
            key={index}
            target='_blank'
            rel='noopener noreferrer'
            className='block group hover:opacity-80 transition-opacity duration-200'
          >
            <div className='flex flex-col'>
              <div className='w-full flex justify-between items-baseline'>
                <span className='text-black dark:text-white font-medium tracking-tight'>
                  "{quotes.quote}"
                </span>
              </div>
              <p className='prose prose-neutral dark:prose-invert pt-3'>
                {quotes.author}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
