import { Hero } from "@/components/hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
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
      <section className="px-8 md:px-16 py-28 md:py-36">
        <div className="max-w-xl">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
              About
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-10 text-foreground">
              Coaching with<br />
              <em className="text-primary">intention.</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I've been playing competitive tennis since I was 8. Over the
                years I've trained under coaches who shaped not just my game,
                but how I think about sport, practice, and improvement.
              </p>
              <p>
                Now I bring that to my students — from beginners learning to
                rally consistently to players breaking into tournament play.
                My philosophy: slow down to speed up. Build habits before
                tactics. Make every session count.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Stats */}
      <section className="relative px-8 md:px-16 py-28 md:py-36 overflow-hidden">
        <ParallaxSection
          speed={0.15}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-display text-[20vw] font-light leading-none"
            style={{ color: "hsl(var(--foreground) / 0.025)" }}
          >
            200+
          </span>
        </ParallaxSection>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 max-w-xl">
          {[
            { value: "8+",   label: "Years coaching" },
            { value: "200+", label: "Students trained" },
            { value: "CT",   label: "Connecticut-based" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <div>
                <p className="font-display text-5xl md:text-6xl font-light text-primary mb-2">
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
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-1"
          >
            All posts →
          </Link>
        </ScrollReveal>

        <div className="max-w-xl space-y-px">
          {recentPosts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 80}>
              <Link
                href={`/blog/${post.slug}`}
                className="block group py-5 border-b border-border/40 hover:bg-accent/20 -mx-3 px-3 rounded-md transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0 tabular-nums pt-0.5">
                    {formatDate(post.date)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {post.summary}
                </p>
                <div className="flex gap-1.5 mt-3">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50 bg-muted px-2 py-0.5 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
