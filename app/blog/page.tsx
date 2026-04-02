import { getAllPosts } from "@/lib/posts";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import { BlogList } from "@/components/blog-list";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = Array.from(new Set(posts.flatMap(p => p.tags))).sort();

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

      <BlogList posts={posts} tags={tags} />
    </div>
  );
}
