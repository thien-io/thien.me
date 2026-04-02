"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { PostMeta } from "@/lib/posts";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BlogList({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? posts : posts.filter(p => p.tags.includes(active));

  return (
    <>
      <div className="px-8 md:px-16 py-5 flex flex-wrap gap-1.5 items-center border-b border-border/30">
        {["All", ...tags].map(tag => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all ${
              active === tag
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"
            }`}
          >
            {tag}
          </button>
        ))}
        <span className="font-mono text-[9px] text-muted-foreground/40 ml-auto">{filtered.length}</span>
      </div>

      <section className="px-8 md:px-16 py-8 md:py-16">
        <div className="max-w-xl space-y-px">
          {filtered.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 30}>
              <Link
                href={`/blog/${post.slug}`}
                className="block group py-5 border-b border-border/40 hover:bg-primary/10 -mx-3 px-3 rounded-xl transition-colors"
              >
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
                    <span
                      key={tag}
                      className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-sm"
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
    </>
  );
}
