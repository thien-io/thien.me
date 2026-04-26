'use client';

import { Hero } from '@/components/hero';
import { ScrollReveal } from '@/components/scroll-reveal';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Hero />

      <div className='content-wrap'>
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
            <div className='flex flex-row gap-3'>
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
                aria-label='Send an email'
                className='inline-flex items-center px-3 py-2.5 rounded-xl border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75' />
                </svg>
              </a>
              <a
                href='https://venmo.com/thienmtran'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Venmo'
                className='inline-flex items-center px-3 py-2.5 rounded-xl border border-border bg-card hover:border-[#3D95CE]/40 hover:bg-[#3D95CE]/5 transition-all'
              >
                <svg viewBox='2 2 18 13' className='w-4 h-4' fill='#3D95CE' aria-hidden='true'>
                  <path d='M19.07 2C19.54 2.78 19.75 3.58 19.75 4.6c0 3.17-2.71 7.29-4.91 10.18H9.94L7.76 2.97l4.67-.45 1.12 8.96c1.04-1.7 2.33-4.38 2.33-6.2 0-.99-.17-1.67-.44-2.23L19.07 2z' />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
