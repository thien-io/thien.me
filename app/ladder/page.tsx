import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ladder Rankings",
  description:
    "Tennis and pickleball ladder rankings at Twin Lakes Beach Club and Lakeridge in Connecticut.",
};

const LADDERS = [
  {
    href: "/ladder/twin-lakes",
    name: "Twin Lakes Beach Club",
    address: "Salisbury, CT",
    tag: "Tennis",
  },
  {
    href: "/ladder/lakeridge",
    name: "Lakeridge",
    address: "Torrington, CT",
    tag: "Tennis · Pickleball",
  },
];

export default function LadderPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-28 pb-8 md:pt-24 md:pb-10">
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
            Ladder rankings for each club. Challenge players above you, claim their spot.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-12 md:py-16">
        <div className="flex flex-col gap-4 max-w-sm">
          {LADDERS.map((l, i) => (
            <ScrollReveal key={l.href} delay={i * 80}>
              <Link
                href={l.href}
                className="group flex flex-col p-7 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/10 transition-all"
              >
                <p className="font-mono text-[9px] uppercase tracking-widest text-primary mb-3">
                  {l.tag}
                </p>
                <h2 className="font-display text-2xl font-light text-foreground group-hover:text-primary transition-colors mb-1">
                  {l.name}
                </h2>
                <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wide mb-6">
                  {l.address}
                </p>
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  View ladder →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="mt-12 pt-8 border-t border-border/50 max-w-sm">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <Settings className="w-3 h-3" />
              Ladder admin
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
