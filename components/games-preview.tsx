"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

interface LBEntry {
  id: string;
  name: string;
  score: number;
  level?: number;
}

interface GameCard {
  title: string;
  href: string;
  apiPath: string;
  color: string;
  icon: React.ReactNode;
}

const GAMES: GameCard[] = [
  {
    title: "Brick Breaker",
    href: "/game",
    apiPath: "/api/leaderboard",
    color: "#c8e03c",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <rect x="2" y="14" width="20" height="3" rx="1.5" />
        <circle cx="12" cy="9" r="2.5" />
        <rect x="1"  y="3" width="5" height="3" rx="1" opacity="0.5" />
        <rect x="7"  y="3" width="5" height="3" rx="1" opacity="0.7" />
        <rect x="13" y="3" width="5" height="3" rx="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Pong",
    href: "/pong",
    apiPath: "/api/pong-leaderboard",
    color: "#6b9fc4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <rect x="2"  y="6" width="2.5" height="8" rx="1.25" />
        <rect x="19.5" y="10" width="2.5" height="8" rx="1.25" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 3" strokeOpacity="0.3" />
      </svg>
    ),
  },
  {
    title: "Snake",
    href: "/snake",
    apiPath: "/api/snake-leaderboard",
    color: "#4a9f6f",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M4 12 Q4 6 10 6 Q16 6 16 12 Q16 18 22 18" strokeLinecap="round" />
        <circle cx="22" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function LeaderboardCard({ game }: { game: GameCard }) {
  const [entries, setEntries] = useState<LBEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(game.apiPath)
      .then(r => r.json())
      .then(d => setEntries((d.entries || []).slice(0, 5)))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [game.apiPath]);

  return (
    <div
      className="w-full rounded-2xl border border-border bg-card p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span style={{ color: game.color }}>{game.icon}</span>
          <p className="text-sm font-medium text-foreground">{game.title}</p>
        </div>
        <Link
          href={game.href}
          className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          play →
        </Link>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-7 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="font-mono text-[10px] text-muted-foreground/40 text-center py-2">
          No scores yet
        </p>
      ) : (
        <div className="space-y-1.5">
          {entries.map((e, i) => (
            <div key={e.id} className={`flex items-center gap-2 py-1 px-2 rounded-lg ${i === 0 ? "bg-primary/10" : ""}`}>
              <span className={`font-mono text-[9px] w-3.5 text-right shrink-0 ${i === 0 ? "text-primary" : "text-muted-foreground/40"}`}>
                {i + 1}
              </span>
              <span className={`text-xs flex-1 truncate ${i === 0 ? "text-primary font-medium" : "text-foreground"}`}>
                {e.name}
              </span>
              <span className={`font-mono text-[10px] tabular-nums shrink-0 ${i === 0 ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {e.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        href={game.href}
        style={{ borderColor: `${game.color}30`, color: game.color }}
        className="mt-auto block text-center font-mono text-[10px] uppercase tracking-wider py-2 rounded-xl border hover:opacity-80 transition-opacity"
      >
        Challenge the board
      </Link>
    </div>
  );
}

export function GamesCarousel() {
  return (
    <section className="px-8 md:px-16 py-16">
      <div className="max-w-xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Games
            </p>
            <h2 className="font-display text-3xl font-light text-foreground">
              Take a break, beat my score.
            </h2>
          </div>
          <Link
            href="/game"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-1 shrink-0"
          >
            All games →
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {GAMES.map(game => (
            <LeaderboardCard key={game.title} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
