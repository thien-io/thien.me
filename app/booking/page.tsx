import { CalEmbed } from '@/components/cal-embed';
import { ScrollReveal } from '@/components/scroll-reveal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Session — Thien',
  description: 'Book a tennis or pickleball coaching session with Thien.',
};

// TODO: replace with your Cal.com username/event-type slug
const CAL_LINK = 'thien.me';

export default function BookingPage() {
  return (
    <div>
      <section className='px-8 md:px-16 pt-10 pb-8 md:pt-24 md:pb-10'>
        <ScrollReveal>
          <p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6'>
            Booking
          </p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h1 className='font-display text-5xl md:text-6xl font-light leading-tight mb-4'>
            Book a<br />
            <em className='text-primary'>session.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className='text-muted-foreground leading-relaxed max-w-md'>
            Pick a time that works for you. Sessions are held across Connecticut
            — confirm the location in the notes when you book.
          </p>
        </ScrollReveal>
      </section>

      <div className='h-px bg-border/50 mx-8 md:mx-16' />

      <section className='px-4 md:px-8 py-8 md:py-12'>
        <CalEmbed calLink={CAL_LINK} />
      </section>
    </div>
  );
}
