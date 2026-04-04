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

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-600",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-600",
  "bg-emerald-100 text-emerald-700",
  "bg-pink-100 text-pink-600",
];

function hashIndex(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % NAME_COLORS.length;
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
    <section className="px-8 md:px-16 py-16 md:py-24">
      <ScrollReveal>
        <div className="mb-8 flex items-end justify-between">
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

      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        {entries.map((entry, i) => {
          const idx = hashIndex(entry.id);
          return (
            <ScrollReveal key={entry.id} delay={i * 80}>
              <div className="flex gap-4 px-5 py-4 hover:bg-accent/40 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5 ${AVATAR_COLORS[idx]}`}>
                  {entry.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className={`font-semibold text-sm ${NAME_COLORS[idx]}`}>
                    {entry.name}
                  </span>
                  <p className="text-sm text-foreground/80 leading-relaxed mt-0.5">
                    {entry.message}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
