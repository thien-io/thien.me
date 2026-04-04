'use client';

import { Hero } from '@/components/hero';
import { ScrollReveal } from '@/components/scroll-reveal';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { LadderPreview } from '@/components/ladder-preview';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Hero />

      <div className='content-wrap'>
        <div className='h-px bg-border/50 mx-8 md:mx-16' />

        <TestimonialsCarousel />
        <div className='h-px bg-border/50 mx-8 md:mx-16' />

        <div className='pt-6'>
          <LadderPreview />
        </div>

        <div className='h-px bg-border/50 mx-8 md:mx-16' />

        {/* Contact */}
        <section className='px-8 md:px-16 py-16 md:py-24'>
          <ScrollReveal>
            <p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8'>
              Contact
            </p>
            <h2 className='font-display text-3xl md:text-4xl font-light text-foreground mb-4'>
              Get in touch.
            </h2>
            <p className='text-muted-foreground max-w-sm leading-relaxed mb-8'>
              Have a question, want to book a lesson, or just want to say hi.
            </p>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Link
                href='/booking'
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' />
                </svg>
                Book a session
              </Link>
              <a
                href='mailto:hello@thien.me'
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75' />
                </svg>
                Send an email
              </a>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
