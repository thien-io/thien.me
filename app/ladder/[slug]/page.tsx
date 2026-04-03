'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Player {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
}

interface Match {
  id: string;
  score: string;
  played_at: string;
  winner: { id: string; name: string; rank: number };
  loser: { id: string; name: string; rank: number };
}

function fmt(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const LOCATION_NAMES: Record<string, string> = {
  'twin-lakes': 'Twin Lakes Beach Club',
  lakeridge: 'Lakeridge',
  'farmington-valley': 'Farmington Valley Racquet Club',
  'fern-park': 'Fern Park Tennis Association',
};

export default function LadderSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locationName = LOCATION_NAMES[slug] ?? slug;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const t = Date.now();
    Promise.all([
      fetch(`/api/ladder/${slug}/players?t=${t}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/ladder/${slug}/matches?t=${t}`, { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([pd, md]) => {
        if (pd.error) {
          setError(pd.error);
          return;
        }
        setPlayers(pd.players ?? []);
        setMatches(md.matches ?? []);
      })
      .catch(() => setError('Failed to load ladder'))
      .finally(() => setLoading(false));
  }, [slug]);

  const latestMatch = matches[0] ?? null;

  return (
    <div>
      <section className='px-8 md:px-16 pt-28 pb-8 md:pt-24 md:pb-10'>
        <Link
          href='/ladder'
          className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-6'
        >
          ← Ladders
        </Link>
        <p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3'>
          Ladder
        </p>
        <h1 className='font-display text-4xl md:text-5xl font-light leading-tight mb-2'>
          {locationName}
        </h1>
      </section>

      <div className='h-px bg-border/50 mx-8 md:mx-16' />

      {loading ? (
        <section className='px-8 md:px-16 py-12'>
          <div className='space-y-3 max-w-lg'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='h-12 bg-muted animate-pulse rounded-xl' />
            ))}
          </div>
        </section>
      ) : error ? (
        <section className='px-8 md:px-16 py-12'>
          <p className='font-mono text-sm text-muted-foreground'>{error}</p>
        </section>
      ) : (
        <div className='flex flex-col lg:flex-row gap-8 px-8 md:px-16 py-12'>
          {/* Rankings */}
          <div className='flex-1 min-w-0'>
            <p className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-5'>
              Rankings · {players.length} player
              {players.length !== 1 ? 's' : ''}
            </p>

            {players.length === 0 ? (
              <p className='font-mono text-sm text-muted-foreground/50'>
                No players yet.
              </p>
            ) : (
              <div className='space-y-1.5'>
                {players.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                      i === 0
                        ? 'border-primary/30 bg-primary/8'
                        : 'border-border bg-card'
                    }`}
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        i === 0
                          ? 'bg-primary text-primary-foreground'
                          : i === 1
                            ? 'bg-muted-foreground/20 text-foreground'
                            : i === 2
                              ? 'bg-muted-foreground/15 text-foreground'
                              : 'bg-transparent'
                      }`}
                    >
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          i >= 3 ? 'text-muted-foreground/40' : ''
                        }`}
                      >
                        {p.rank}
                      </span>
                    </div>

                    {/* Name */}
                    <span
                      className={`flex-1 text-sm font-medium truncate ${
                        i === 0 ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {p.name}
                    </span>

                    {/* W-L */}
                    <div className='flex items-center gap-1 shrink-0'>
                      <span className='font-mono text-[10px] text-green-500 tabular-nums'>
                        {p.wins}W
                      </span>
                      <span className='font-mono text-[10px] text-muted-foreground/40'>
                        ·
                      </span>
                      <span className='font-mono text-[10px] text-red-400/80 tabular-nums'>
                        {p.losses}L
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Matches sidebar */}
          <div className='w-full lg:w-72 shrink-0 space-y-6'>
            {/* Most recent match */}
            {latestMatch && (
              <div className='border border-primary/20 bg-primary/5 rounded-2xl p-5'>
                <p className='font-mono text-[9px] uppercase tracking-widest text-primary mb-4'>
                  Most recent match
                </p>
                <p className='font-mono text-[10px] text-muted-foreground mb-3'>
                  {fmt(latestMatch.played_at)}
                </p>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono text-[9px] text-green-500 uppercase w-5'>
                      W
                    </span>
                    <span className='text-sm font-medium text-foreground'>
                      {latestMatch.winner.name}
                    </span>
                    <span className='font-mono text-[9px] text-muted-foreground/50 ml-auto'>
                      #{latestMatch.winner.rank}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono text-[9px] text-red-400/80 uppercase w-5'>
                      L
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {latestMatch.loser.name}
                    </span>
                    <span className='font-mono text-[9px] text-muted-foreground/50 ml-auto'>
                      #{latestMatch.loser.rank}
                    </span>
                  </div>
                </div>
                <div className='mt-3 pt-3 border-t border-border/50'>
                  <p className='font-mono text-xs text-foreground text-center'>
                    {latestMatch.score}
                  </p>
                </div>
              </div>
            )}

            {/* Match history */}
            <div className='border border-border rounded-2xl bg-card p-5'>
              <p className='font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-4'>
                Match history
              </p>
              {matches.length === 0 ? (
                <p className='font-mono text-[10px] text-muted-foreground/50 text-center py-4'>
                  No matches yet.
                </p>
              ) : (
                <div className='space-y-3'>
                  {matches.map((m) => (
                    <div
                      key={m.id}
                      className='pb-3 border-b border-border/40 last:border-0 last:pb-0'
                    >
                      <div className='flex items-center justify-between mb-1'>
                        <span className='font-mono text-[9px] text-muted-foreground'>
                          {fmt(m.played_at)}
                        </span>
                        <span className='font-mono text-[9px] text-foreground'>
                          {m.score}
                        </span>
                      </div>
                      <p className='text-xs text-foreground'>
                        <span className='text-green-500'>{m.winner.name}</span>
                        <span className='text-muted-foreground/50 mx-1'>
                          def.
                        </span>
                        <span className='text-muted-foreground'>
                          {m.loser.name}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
