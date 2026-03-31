import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import Link from "next/link";

export default function CoachingPage() {
  return (
    <div>
      <section className="relative px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span
            className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]"
          >
            coach
          </span>
        </ParallaxSection>

        <div className="relative z-10">

        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Coaching</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Work with<br /><em className="text-primary">me.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            I coach both tennis and pickleball across Connecticut. Same philosophy, different courts.
          </p>
        </ScrollReveal>
              </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <ScrollReveal>
            <Link href="/coaching/tennis" className="block group p-8 border border-border rounded-xl bg-card hover:border-primary/30 transition-all">
              <svg viewBox="0 0 256 256" fill="currentColor" className="h-7 w-7 text-primary mb-5">
                <path d="M201.57 54.46a104 104 0 1 0 0 147.08a103.4 103.4 0 0 0 0-147.08M65.75 65.77a87.63 87.63 0 0 1 53.66-25.31A87.3 87.3 0 0 1 94 94.06a87.42 87.42 0 0 1-53.62 25.35a87.58 87.58 0 0 1 25.37-53.64m-25.42 69.71a103.3 103.3 0 0 0 65-30.11a103.24 103.24 0 0 0 30.13-65a87.78 87.78 0 0 1 80.18 80.14a104 104 0 0 0-95.16 95.1a87.78 87.78 0 0 1-80.18-80.14Zm149.92 54.75a87.7 87.7 0 0 1-53.66 25.31a88 88 0 0 1 79-78.95a87.58 87.58 0 0 1-25.34 53.64"/>
              </svg>
              <h2 className="font-display text-3xl font-light text-foreground group-hover:text-primary transition-colors mb-2">
                Tennis
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Technique, mental game, all levels. USPTA certified.
              </p>
              <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                View packages →
              </span>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <Link href="/coaching/pickleball" className="block group p-8 border border-border rounded-xl bg-card hover:border-primary/30 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary mb-5">
                <path fill="currentColor" d="M7.017 14.764q.495.513 1.127.757t1.297.244q.701 0 1.373-.273q.67-.273 1.223-.825l.669-.669q.533-.533.806-1.204t.273-1.373q0-.663-.254-1.293t-.748-1.144L9.175 5.359q-.423-.396-1.005-.396t-.978.415L3.416 9.16Q3 9.575 3 10.158t.416.998zM18.267 21l-5.586-5.606q-.687.689-1.549 1.017q-.862.33-1.736.33q-.851 0-1.65-.318q-.798-.317-1.437-.952L2.702 11.85q-.348-.348-.525-.79Q2 10.62 2 10.167q0-.457.177-.905t.525-.816l3.783-3.802q.348-.348.79-.525q.441-.177.892-.177q.458 0 .906.177t.816.545L13.47 8.27q.635.639.952 1.437q.318.798.318 1.65q0 .88-.342 1.749q-.341.868-1.01 1.574l5.592 5.611zm.864-12.23q-1.197 0-2.029-.846q-.833-.847-.833-2.043t.833-2.039T19.131 3t2.043.846t.845 2.042t-.845 2.039t-2.043.842m.005-1q.778 0 1.33-.548q.553-.549.553-1.332t-.548-1.336T19.139 4t-1.326.548q-.544.549-.544 1.332q0 .784.545 1.336q.544.553 1.322.553M8.323 10.285"/>
              </svg>
              <h2 className="font-display text-3xl font-light text-foreground group-hover:text-primary transition-colors mb-2">
                Pickleball
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                4.4 DUPR. Beginners through competitive tournament prep.
              </p>
              <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                View packages →
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
