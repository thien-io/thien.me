import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fern Park Tennis Association",
  description: "Coaching sessions at Fern Park Tennis Association, CT. Opening when the season starts.",
};

export default function BookingFernParkPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-28 pb-8 md:pt-24 md:pb-10">
        <ScrollReveal>
          <Link
            href="/booking"
            className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-6"
          >
            ← Booking
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <div className="flex items-center gap-3 mb-4">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
              Connecticut
            </p>
            <span className="font-mono text-[8px] uppercase tracking-widest text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Off season
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-4">
            Fern Park
            <br />
            <em className="text-muted-foreground">Tennis Association.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            I&apos;ll be coaching at Fern Park Tennis Association this season — but booking
            isn&apos;t open yet. This location is currently off season and no times are
            available to schedule right now.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-12 md:py-16 max-w-xl">
        <ScrollReveal>
          {/* Off-season notice card */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-7 mb-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1.5">
                  Booking opens when the season starts
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No times are available at this location right now. Check back once
                  the season kicks off — the calendar will go live here as soon as
                  sessions are available to book.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="space-y-5">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                About this location
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fern Park Tennis Association is an outdoor club in Connecticut.
                Sessions here will be available for all skill levels once the outdoor
                season opens up.
              </p>
            </div>

            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                Want to be notified?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Reach out directly and I&apos;ll let you know as soon as the schedule opens up.
              </p>
              <a
                href="mailto:hello@thien.me"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
              >
                hello@thien.me →
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors mt-6"
          >
            View pricing →
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <div className="mt-10 pt-8 border-t border-border/50">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-4">
              Available now at other locations
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/booking/twin"
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/10 transition-all group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Twin Lakes Beach Club</p>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">Salisbury, CT · Tennis</p>
                </div>
                <span className="font-mono text-[10px] text-primary">Book →</span>
              </Link>
              <Link
                href="/booking/lakeridge"
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/10 transition-all group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Lakeridge</p>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">Torrington, CT · Tennis · Pickleball</p>
                </div>
                <span className="font-mono text-[10px] text-primary">Book →</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
