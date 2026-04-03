import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function LadderPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-10 pb-8 md:pt-24 md:pb-10">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
            Ladder
          </p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-4">
            Player<br />
            <em className="text-primary">Rankings.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Ladder rankings for each location. Challenge players above you, climb the board.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-12 md:py-16">
        <ScrollReveal>
          <Link
            href="/ladder/twin-lakes"
            className="group inline-flex flex-col p-7 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/10 transition-all w-full max-w-sm"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-primary mb-3">
              Tennis
            </p>
            <h2 className="font-display text-2xl font-light text-foreground group-hover:text-primary transition-colors mb-1">
              Twin Lakes Beach Club
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wide mb-6">
              Salisbury, CT
            </p>
            <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
              View ladder →
            </span>
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
