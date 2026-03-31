import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";

const packages = [
  {
    name: "Single Session",
    price: "$80",
    duration: "60 min",
    description:
      "Jump in and see what we can work on. Good for first-timers and players wanting to fix something specific.",
    includes: [
      "Skill assessment",
      "Dinking, serving, and rally drills",
      "Session notes after",
    ],
  },
  {
    name: "Monthly Package",
    price: "$280",
    duration: "4 sessions / month",
    description:
      "Where real improvement happens. Structured progression over a month with a plan that evolves as you do.",
    includes: [
      "4 × 60 min sessions",
      "Video analysis",
      "Between-session feedback",
      "Customized drill plan",
    ],
    featured: true,
  },
  {
    name: "Tournament Prep",
    price: "$650",
    duration: "10 sessions",
    description:
      "Built around your next tournament. Strategy, pressure situations, and the mental side of competitive play.",
    includes: [
      "10 × 60 min sessions",
      "Match strategy sessions",
      "Video review",
      "Priority scheduling",
    ],
  },
];

export default function PickleballCoachingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative px-8 md:px-16 pt-24 pb-28 md:pt-32 md:pb-36 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span
            className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]"
          >
            pickle
          </span>
        </ParallaxSection>

        <div className="relative z-10">

        <div className="relative z-10 max-w-xl">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
              Pickleball Coaching
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
              Pickleball<br />
              <em className="text-primary">coaching.</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-6">
              I picked up pickleball in 2021 and got serious fast. Won a 4.0 DUPR tournament in 2023,
              sitting at 4.4 DUPR in 2025. I coach the same way I play — intentional, technical, and fun.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { value: "4.4",   label: "DUPR rating" },
                { value: "2021",  label: "Started playing" },
                { value: "4.0",   label: "Tournament win" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-3xl font-light text-primary">{s.value}</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
              </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Packages */}
      <section className="px-8 md:px-16 py-28 md:py-36">
        <div className="space-y-5 max-w-xl">
          {packages.map((pkg, i) => (
            <ScrollReveal key={pkg.name} delay={i * 100}>
              <div
                className={`relative p-8 rounded-xl border transition-all duration-300 hover:shadow-sm group ${
                  pkg.featured
                    ? "border-primary/30 bg-accent/30"
                    : "border-border bg-card"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-2.5 left-6 px-3 py-0.5 bg-primary text-primary-foreground font-mono text-[9px] uppercase tracking-widest rounded-sm">
                    Most popular
                  </span>
                )}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-medium text-foreground text-base">{pkg.name}</h3>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 tracking-wider uppercase">
                      {pkg.duration}
                    </p>
                  </div>
                  <span className="font-display text-3xl font-light text-primary">{pkg.price}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{pkg.description}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.includes.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-center gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="mailto:hello@thien.me"
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-primary hover:gap-3 transition-all">
                  Get started →
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400} className="mt-20 max-w-xl">
          <div className="border-t border-border pt-12">
            <p className="font-display text-2xl font-light text-foreground mb-2">Questions first?</p>
            <p className="text-sm text-muted-foreground mb-6">No pressure. Reach out and we'll find what works.</p>
            <a href="mailto:hello@thien.me"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 transition-opacity">
              hello@thien.me
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
