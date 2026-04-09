import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Thien",
  description: "Session rates for tennis and pickleball coaching with Thien.",
};

const tennisPricing = [
  {
    label: "Single Session",
    duration: "60 min",
    price: "$100",
    desc: "One-on-one court time. Focus on technique, footwork, or match strategy.",
  },
  {
    label: "5-Session Pack",
    duration: "60 min each",
    price: "$450",
    desc: "Save $50. Best for players building a consistent practice routine.",
    tag: "popular",
  },
  {
    label: "10-Session Pack",
    duration: "60 min each",
    price: "$850",
    desc: "Save $150. Ideal for committed players targeting real improvement.",
  },
];

const pickleballPricing = [
  {
    label: "Single Session",
    duration: "60 min",
    price: "$80",
    desc: "One-on-one session covering fundamentals, dinking, and court positioning.",
  },
  {
    label: "5-Session Pack",
    duration: "60 min each",
    price: "$360",
    desc: "Save $40. Build consistency and develop a complete pickleball game.",
    tag: "popular",
  },
];

const included = [
  "Personalized drill plan for your level",
  "Video feedback on request",
  "Flexible rescheduling (24h notice)",
];

export default function PricingPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-28 pb-8 md:pt-24 md:pb-10">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
            Pricing
          </p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-4">
            Simple,<br />
            <em className="text-primary">honest rates.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            No hidden fees. Pay per session or save with a pack. Venmo or cash accepted.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Tennis */}
      <section className="px-8 md:px-16 py-12 md:py-16">
        <ScrollReveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
            Tennis
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {tennisPricing.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 80}>
              <div className="relative p-6 rounded-xl border border-border bg-card h-full flex flex-col">
                {item.tag && (
                  <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {item.tag}
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{item.duration}</p>
                  </div>
                  <p className="font-display text-2xl font-light text-primary">{item.price}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Pickleball */}
      <section className="px-8 md:px-16 py-12 md:py-16">
        <ScrollReveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
            Pickleball
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {pickleballPricing.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 80}>
              <div className="relative p-6 rounded-xl border border-border bg-card h-full flex flex-col">
                {item.tag && (
                  <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {item.tag}
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{item.duration}</p>
                  </div>
                  <p className="font-display text-2xl font-light text-primary">{item.price}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* What's included + CTA */}
      <section className="px-8 md:px-16 py-12 md:py-16 max-w-2xl">
        <ScrollReveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Every session includes
          </p>
          <ul className="space-y-3 mb-10">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">–</span>
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 transition-opacity"
            >
              Book a session →
            </Link>
            <a
              href="mailto:hello@thien.me"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card font-mono text-xs tracking-wide text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            >
              Ask a question
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
