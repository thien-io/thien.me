"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

interface Entry {
  id: string;
  name: string;
  message: string;
}

const NAME_COLORS = [
  "text-amber-600",
  "text-rose-500",
  "text-violet-600",
  "text-teal-600",
  "text-blue-600",
  "text-orange-500",
  "text-emerald-600",
  "text-pink-500",
];

function nameColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NAME_COLORS[h % NAME_COLORS.length];
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
              Guestbook
            </p>
            <h2 className="font-display text-3xl font-light text-foreground">
              Recent Messages
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
        {entries.map((entry, i) => (
          <ScrollReveal key={entry.id} delay={i * 80}>
            <div className="flex flex-col p-6 rounded-xl border border-border bg-card h-full gap-5">
              <p className="flex-1 text-sm leading-relaxed text-foreground/75">
                "{entry.message}"
              </p>
              <div className="border-t border-border pt-4">
                <span className={`font-medium text-sm ${nameColor(entry.id)}`}>
                  {entry.name}
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
