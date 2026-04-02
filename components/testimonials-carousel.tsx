"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

interface Entry {
  id: string;
  name: string;
  message: string;
}

const COLORS = [
  { name: "text-rose-700 dark:text-rose-300",       border: "border-rose-200 dark:border-rose-800",       bg: "bg-rose-50 dark:bg-rose-900/20"       },
  { name: "text-violet-700 dark:text-violet-300",   border: "border-violet-200 dark:border-violet-800",   bg: "bg-violet-50 dark:bg-violet-900/20"   },
  { name: "text-blue-700 dark:text-blue-300",       border: "border-blue-200 dark:border-blue-800",       bg: "bg-blue-50 dark:bg-blue-900/20"       },
  { name: "text-teal-700 dark:text-teal-300",       border: "border-teal-200 dark:border-teal-800",       bg: "bg-teal-50 dark:bg-teal-900/20"       },
  { name: "text-amber-700 dark:text-amber-300",     border: "border-amber-200 dark:border-amber-800",     bg: "bg-amber-50 dark:bg-amber-900/20"     },
  { name: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { name: "text-fuchsia-700 dark:text-fuchsia-300", border: "border-fuchsia-200 dark:border-fuchsia-800", bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20" },
  { name: "text-orange-700 dark:text-orange-300",   border: "border-orange-200 dark:border-orange-800",   bg: "bg-orange-50 dark:bg-orange-900/20"   },
  { name: "text-indigo-700 dark:text-indigo-300",   border: "border-indigo-200 dark:border-indigo-800",   bg: "bg-indigo-50 dark:bg-indigo-900/20"   },
  { name: "text-sky-700 dark:text-sky-300",         border: "border-sky-200 dark:border-sky-800",         bg: "bg-sky-50 dark:bg-sky-900/20"         },
  { name: "text-pink-700 dark:text-pink-300",       border: "border-pink-200 dark:border-pink-800",       bg: "bg-pink-50 dark:bg-pink-900/20"       },
  { name: "text-green-700 dark:text-green-300",     border: "border-green-200 dark:border-green-800",     bg: "bg-green-50 dark:bg-green-900/20"     },
];

function hashColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

export function TestimonialsCarousel() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch("/api/guestbook")
      .then(r => r.json())
      .then(d => setEntries((d.entries || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!entries.length) return null;

  return (
    <section className="px-8 md:px-16 py-16 md:py-32">
      <ScrollReveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Testimonials
            </p>
            <h2 className="font-display text-3xl font-light text-foreground">
              What students say
            </h2>
          </div>
          <Link
            href="/guestbook"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-1 shrink-0"
          >
            Leave a message →
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {entries.map((entry, i) => {
          const color = hashColor(entry.id);
          return (
            <ScrollReveal key={entry.id} delay={i * 80}>
              <div className={`p-6 rounded-xl border h-full ${color.border} ${color.bg}`}>
                <p className="text-[11px] text-primary mb-3 select-none">&ldquo;</p>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                  {entry.message}
                </p>
                <span className={`font-mono text-[10px] uppercase tracking-wider ${color.name}`}>
                  {entry.name}
                </span>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
