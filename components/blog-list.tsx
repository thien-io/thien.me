"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { PostMeta } from "@/lib/posts";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const TAG_COLORS: Record<string, string> = {
  tennis:    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  technique: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
  mindset:   "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25",
  coaching:  "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
  practice:  "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25",
  strategy:  "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25",
  life:      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
  film:      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
  local:     "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25",
  books:     "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/25",
  footwork:  "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25",
  serve:     "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
};

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
                : (tag !== "All" && TAG_COLORS[tag])
                  ? TAG_COLORS[tag]
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
                      className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                        TAG_COLORS[tag] ?? "text-muted-foreground/60 bg-muted border-transparent"
                      }`}
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
