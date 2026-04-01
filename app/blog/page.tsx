import { getAllPosts } from "@/lib/posts";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllPosts();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <section className="relative px-8 md:px-16 pt-10 pb-10 md:pt-32 md:pb-20 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span
            className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]"
          >
            write
          </span>
        </ParallaxSection>

        <div className="relative z-10">

        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Blog</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Writing on<br /><em className="text-primary">tennis & life.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Things I've been thinking about — on the court and off it. Pull up a chair.
          </p>
        </ScrollReveal>
              </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-8 md:py-16">
        <div className="max-w-xl space-y-px">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 30}>
              <Link href={`/blog/${post.slug}`} className="block group py-5 border-b border-border/40 hover:bg-accent/20 -mx-3 px-3 rounded-xl transition-colors">
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <h2 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0 tabular-nums pt-0.5">
                    {formatDate(post.date)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{post.summary}</p>
                <div className="flex gap-1.5 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-sm">
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
