import { CalEmbed } from "@/components/cal-embed";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book at Twin Lakes — Thien",
  description: "Book a coaching session at Twin Lakes Tennis Club, CT.",
};

// TODO: replace with your Cal.com username/event-type slug for Twin Lakes
const CAL_LINK = "thien.me/twin";

export default function BookingTwinPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-10 pb-8 md:pt-24 md:pb-10">
        <ScrollReveal>
          <Link
            href="/booking"
            className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-6"
          >
            ← Booking
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-primary mb-3">
            Twin Lakes · CT
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-4">
            Twin Lakes<br />
            <em className="text-primary">Tennis Club.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Outdoor hard courts. Pick a time below — sessions are 60 min.
            Confirm the court number in the notes.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-4 md:px-8 py-8 md:py-12">
        <CalEmbed calLink={CAL_LINK} />
      </section>
    </div>
  );
}
