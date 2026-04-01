import { Hero } from "@/components/hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import { ScrollTimeline } from "@/components/scroll-timeline";
import { SpotifyWidget } from "@/components/spotify-widget";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  return (
    <div>
      <Hero />

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* About */}
      <section className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-xl">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
              About
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-8 text-foreground">
              Coach, player,<br />
              <em className="text-primary">perpetual student.</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-md">
              <p>
                I've been coaching tennis in Connecticut since 2015 and picked up
                pickleball in 2021 — currently sitting at 4.4 DUPR. Same
                philosophy for both: technique first, mental game second, make
                every session worth showing up for.
              </p>
              <p>
                When I'm not on the court I'm reading about how athletes train,
                watching films, and building things like this website.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <div className="flex gap-4 mt-8">
              <Link href="/about"
                className="font-mono text-[11px] uppercase tracking-wider text-primary hover:opacity-70 transition-opacity">
                Full story →
              </Link>
              <Link href="/coaching"
                className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                Work with me →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Stats */}
      <section className="relative px-8 md:px-16 py-24 md:py-32 overflow-hidden">
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

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 max-w-xl">
          {[
            { value: "8+",   label: "Years coaching" },
            { value: "200+", label: "Students" },
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

      {/* Timeline */}
      <section className="px-8 md:px-16 py-24 md:py-32">
        <ScrollReveal className="mb-14">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            Timeline
          </p>
          <h2 className="font-display text-3xl font-light text-foreground">
            Where I&apos;ve been
          </h2>
        </ScrollReveal>
        <div className="max-w-lg">
          <ScrollTimeline />
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Coaching cards */}
      <section className="px-8 md:px-16 py-24 md:py-32">
        <ScrollReveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            Coaching
          </p>
          <h2 className="font-display text-3xl font-light text-foreground">
            Two sports, one approach
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          {[
            {
              href: "/coaching/tennis",
              sport: "Tennis",
              desc: "Technique, mental game, all levels. USPTA certified. From first rallies to competitive play.",
              icon: (
                <svg viewBox="0 0 256 256" fill="currentColor" className="h-6 w-6 text-primary">
                  <path d="M201.57 54.46a104 104 0 1 0 0 147.08a103.4 103.4 0 0 0 0-147.08M65.75 65.77a87.63 87.63 0 0 1 53.66-25.31A87.3 87.3 0 0 1 94 94.06a87.42 87.42 0 0 1-53.62 25.35a87.58 87.58 0 0 1 25.37-53.64m-25.42 69.71a103.3 103.3 0 0 0 65-30.11a103.24 103.24 0 0 0 30.13-65a87.78 87.78 0 0 1 80.18 80.14a104 104 0 0 0-95.16 95.1a87.78 87.78 0 0 1-80.18-80.14Zm149.92 54.75a87.7 87.7 0 0 1-53.66 25.31a88 88 0 0 1 79-78.95a87.58 87.58 0 0 1-25.34 53.64"/>
                </svg>
              ),
            },
            {
              href: "/coaching/pickleball",
              sport: "Pickleball",
              desc: "4.4 DUPR. Tournament prep, dinking, third shot drops — whatever you need to level up.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path fill="currentColor" d="M7.017 14.764q.495.513 1.127.757t1.297.244q.701 0 1.373-.273q.67-.273 1.223-.825l.669-.669q.533-.533.806-1.204t.273-1.373q0-.663-.254-1.293t-.748-1.144L9.175 5.359q-.423-.396-1.005-.396t-.978.415L3.416 9.16Q3 9.575 3 10.158t.416.998zM18.267 21l-5.586-5.606q-.687.689-1.549 1.017q-.862.33-1.736.33q-.851 0-1.65-.318q-.798-.317-1.437-.952L2.702 11.85q-.348-.348-.525-.79Q2 10.62 2 10.167q0-.457.177-.905t.525-.816l3.783-3.802q.348-.348.79-.525q.441-.177.892-.177q.458 0 .906.177t.816.545L13.47 8.27q.635.639.952 1.437q.318.798.318 1.65q0 .88-.342 1.749q-.341.868-1.01 1.574l5.592 5.611zm.864-12.23q-1.197 0-2.029-.846q-.833-.847-.833-2.043t.833-2.039T19.131 3t2.043.846t.845 2.042t-.845 2.039t-2.043.842m.005-1q.778 0 1.33-.548q.553-.549.553-1.332t-.548-1.336T19.139 4t-1.326.548q-.544.549-.544 1.332q0 .784.545 1.336q.544.553 1.322.553M8.323 10.285"/>
                </svg>
              ),
            },
          ].map((c, i) => (
            <ScrollReveal key={c.sport} delay={i * 80}>
              <Link href={c.href}
                className="block group p-6 border border-border rounded-xl bg-card hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  {c.icon}
                  <h3 className="font-display text-2xl font-light text-foreground group-hover:text-primary transition-colors">
                    {c.sport}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  View packages →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Now playing */}
      <section className="px-8 md:px-16 py-12">
        <ScrollReveal className="mb-6">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            Music
          </p>
          <h2 className="font-display text-3xl font-light text-foreground">
            Currently playing
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">Right now</p>
          <div className="w-full max-w-xl">
            <SpotifyWidget />
          </div>
        </ScrollReveal>

      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Recent posts */}
      <section className="px-8 md:px-16 py-24">
        <ScrollReveal className="mb-10 flex items-end justify-between max-w-xl">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Writing
            </p>
            <h2 className="font-display text-3xl font-light text-foreground">
              From the blog
            </h2>
          </div>
          <Link href="/blog"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-1">
            All posts →
          </Link>
        </ScrollReveal>

        <div className="max-w-xl space-y-px">
          {recentPosts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 80}>
              <Link href={`/blog/${post.slug}`}
                className="block group py-5 border-b border-border/40 hover:bg-accent/20 -mx-3 px-3 rounded-xl transition-colors">
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0 tabular-nums pt-0.5">
                    {formatDate(post.date)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{post.summary}</p>
                <div className="flex gap-1.5 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag}
                      className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50 bg-muted px-2 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Contact */}
      <section className="px-8 md:px-16 py-24">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Contact</p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
            Get in touch.
          </h2>
          <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
            Have a question, want to book a lesson, or just want to say hi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:hello@thien.me"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent/20 transition-all font-mono text-sm text-foreground"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              Send an email
            </a>
            <Link
              href="/guestbook"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent/20 transition-all font-mono text-sm text-foreground"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Write in guestbook
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
