"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SubmitScoreModal } from "@/components/submit-score-modal";

interface Player {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
}

const SLUG = "twin-lakes";

export function LadderPreview() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`/api/ladder/${SLUG}/players`)
      .then(r => r.json())
      .then(d => setPlayers((d.players ?? []).slice(0, 8)))
      .catch(() => {});
  }, []);

  if (!players.length) return null;

  return (
    <>
      <section className="px-8 md:px-16 py-16 md:py-24">
        <ScrollReveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Ladder · Twin Lakes Beach Club
              </p>
              <h2 className="font-display text-3xl font-light text-foreground">
                Current Rankings
              </h2>
            </div>
            <Link
              href="/ladder/twin-lakes"
              className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-1 shrink-0"
            >
              Full ladder →
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border mb-5">
            {players.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? "bg-primary/5" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    i === 0 ? "bg-primary text-primary-foreground"
                    : i === 1 ? "bg-muted-foreground/20 text-foreground"
                    : i === 2 ? "bg-muted-foreground/15 text-foreground"
                    : "bg-transparent"
                  }`}
                >
                  <span className={`font-mono text-[10px] font-bold ${i >= 3 ? "text-muted-foreground/40" : ""}`}>
                    {p.rank}
                  </span>
                </div>
                <span className={`flex-1 text-sm font-medium ${i === 0 ? "text-primary" : "text-foreground"}`}>
                  {p.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-mono text-[10px] text-green-500 tabular-nums">{p.wins}W</span>
                  <span className="font-mono text-[10px] text-muted-foreground/40">·</span>
                  <span className="font-mono text-[10px] text-red-400/80 tabular-nums">{p.losses}L</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Submit a score
          </button>
        </ScrollReveal>
      </section>

      {showModal && (
        <SubmitScoreModal
          slug={SLUG}
          players={players}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
