import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Session — Thien",
  description: "Book a tennis or pickleball coaching session with Thien.",
};

const locations = [
  {
    href: '/booking/twin',
    name: 'Twin Lakes Beach Club',
    address: 'Salisbury, CT',
    desc: 'Outdoor grass courts. Great for all levels — beginners to competitive players.',
    tag: 'tennis',
  },
  {
    href: '/booking/lakeridge',
    name: 'Lakeridge',
    address: 'Torrington, CT',
    desc: 'Well-maintained indoor and outdoor courts in Torrinton.',
    tag: 'tennis · pickleball',
  },
];

export default function BookingPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-10 pb-8 md:pt-24 md:pb-10">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
            Booking
          </p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-4">
            Book a<br />
            <em className="text-primary">session.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Pick your location and choose a time that works. Sessions are one-on-one
            and tailored to your level.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          {locations.map((loc, i) => (
            <ScrollReveal key={loc.href} delay={i * 100}>
              <Link
                href={loc.href}
                className="block group p-7 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/10 transition-all"
              >
                <p className="font-mono text-[9px] uppercase tracking-widest text-primary mb-3">
                  {loc.tag}
                </p>
                <h2 className="font-display text-2xl font-light text-foreground group-hover:text-primary transition-colors mb-1">
                  {loc.name}
                </h2>
                <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wide mb-4">
                  {loc.address}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {loc.desc}
                </p>
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  View availability →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
