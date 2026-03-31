import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";

const packages = [
  {
    name: "Single Session",
    price: "$100",
    duration: "60 min",
    description:
      "A focused one-on-one session — great for a specific problem or trying things out.",
    includes: [
      "Technique assessment",
      "Drills and live play",
      "Session notes after",
    ],
  },
  {
    name: "Monthly Package",
    price: "$360",
    duration: "4 sessions / month",
    description:
      "Consistent work builds real improvement. This is how most students see the biggest gains.",
    includes: [
      "4 × 60 min sessions",
      "Video analysis",
      "Between-session check-ins",
      "Customized practice plan",
    ],
    featured: true,
  },
  {
    name: "Intensive",
    price: "$800",
    duration: "10 sessions",
    description:
      "Fast-track your development. Ideal before a season, tournament, or a serious reset.",
    includes: [
      "10 × 60 min sessions",
      "Full video breakdown",
      "Match strategy sessions",
      "Priority scheduling",
    ],
  },
];

export default function CoachingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative px-8 md:px-16 pt-24 pb-28 md:pt-32 md:pb-36 overflow-hidden">
        <ParallaxSection
          speed={0.1}
          className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-0 overflow-hidden"
        >
          <span
            className="font-display text-[22vw] font-light leading-none"
            style={{ color: "hsl(var(--foreground) / 0.025)" }}
          >
            coach
          </span>
        </ParallaxSection>

        <div className="relative z-10 max-w-xl">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
              Coaching
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
              Work with<br />
              <em className="text-primary">me.</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              All sessions are held across Connecticut. I keep my roster small
              so every student gets real attention and a tailored approach.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Packages */}
      <section className="px-8 md:px-16 py-28 md:py-36">
        <div className="space-y-5 max-w-xl">
          {packages.map((pkg, i) => (
            <ScrollReveal key={pkg.name} delay={i * 100}>
              <div
                className={`relative p-8 rounded-xl border transition-all duration-300 hover:shadow-lg group ${
                  pkg.featured
                    ? "border-primary/30 bg-accent/30"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-2.5 left-6 px-3 py-0.5 bg-primary text-primary-foreground font-mono text-[9px] uppercase tracking-widest rounded-xl">
                    Most popular
                  </span>
                )}

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-medium text-foreground text-base">
                      {pkg.name}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 tracking-wider uppercase">
                      {pkg.duration}
                    </p>
                  </div>
                  <span className="font-display text-3xl font-light text-primary">
                    {pkg.price}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {pkg.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-muted-foreground flex items-center gap-2.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:hello@thien.me"
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-primary hover:gap-3 transition-all"
                >
                  Get started →
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={400} className="mt-20 max-w-xl">
          <div className="border-t border-border pt-12">
            <p className="font-display text-2xl font-light text-foreground mb-2">
              Questions first?
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              No pressure. Reach out and we'll find what works.
            </p>
            <a
              href="mailto:hello@thien.me"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 transition-opacity"
            >
              hello@thien.me
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
