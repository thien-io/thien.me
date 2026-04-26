import { ScrollReveal } from "@/components/scroll-reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Tennis lesson rates from $100/session. Private coaching in Connecticut.",
};

const tennisPricing = [
  {
    label: "Single Session",
    duration: "60 min",
    price: "$100",
    desc: "One-on-one court time. Focus on technique, footwork, or match strategy.",
  },
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
            Simple<br />
            <em className="text-primary">rates.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Venmo or cash accepted.
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

    </div>
  );
}
