import { ScrollTimeline } from "@/components/scroll-timeline";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative px-8 md:px-16 pt-28 pb-14 md:pt-32 md:pb-36 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span
            className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]"
          >
            story
          </span>
        </ParallaxSection>

        <div className="relative z-10">

        <div className="relative z-10 max-w-xl">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
              About
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-10">
              The story<br />
              <em className="text-primary">so far.</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="space-y-5 text-muted-foreground leading-relaxed max-w-md">
              <p>
                I&apos;m an RSPA certified tennis coach based in Connecticut,
                currently coaching at Twin Lakes Beach Club and Lakeridge.
                I work with players of all levels — from beginners picking up
                a racket for the first time to competitive players looking to
                sharpen their game.
              </p>
              <p>
                I hold a <strong className="text-foreground font-medium">4.5 USTA</strong> rating
                and a <strong className="text-foreground font-medium">4.4 DUPR</strong> pickleball rating.
                My coaching focuses on building real technique and a strong mental
                game — the kind of habits that hold up when it matters.
              </p>
              <p>
                Off the court: I enjoy hiking, traveling, and trying to keep my plants alive.
              </p>
            </div>
          </ScrollReveal>
        </div>
        
              </div>
      </section>
      {/* Stats */}
      <section className="relative px-8 md:px-16 py-16 md:py-32 overflow-hidden">
        <ParallaxSection
          speed={0.15}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-display text-[20vw] font-light leading-none whitespace-nowrap opacity-[0.025]"
          >
            200+
          </span>
        </ParallaxSection>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 max-w-2xl">
          {[
            { value: "8+",   label: "Years coaching" },
            { value: "200+", label: "Students" },
            { value: "4.5",  label: "USTA tennis" },
            { value: "4.4",  label: "DUPR pickleball" },
            { value: "CT",   label: "Based in" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80}>
              <div>
                <p className="font-display text-4xl md:text-5xl font-light text-primary mb-1.5">
                  {stat.value}
                </p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <div className="h-px bg-border/50 mx-8 md:mx-16" />


    </div>
  );
}
