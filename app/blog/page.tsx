import { getAllPosts } from "@/lib/posts";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllPosts();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <section className="px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Blog</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Writing on<br /><em className="text-primary">tennis & life.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            {posts.length} posts on coaching, technique, mindset, and whatever else I'm thinking about.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <div className="max-w-xl space-y-px">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 30}>
              <Link href={`/blog/${post.slug}`} className="block group py-5 border-b border-border/40 hover:bg-accent/20 -mx-3 px-3 rounded-md transition-colors">
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
