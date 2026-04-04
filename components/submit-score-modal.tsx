"use client";

import { useState } from "react";

interface Player {
  id: string;
  name: string;
  rank: number;
}

interface Props {
  slug: string;
  players: Player[];
  onClose: () => void;
}

export function SubmitScoreModal({ slug, players, onClose }: Props) {
  const [winner, setWinner]   = useState("");
  const [loser, setLoser]     = useState("");
  const [score, setScore]     = useState("");
  const [date, setDate]       = useState(new Date().toISOString().split("T")[0]);
  const [yourName, setYourName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  async function submit() {
    if (!winner || !loser || !score.trim()) { setError("Please fill in all fields."); return; }
    if (winner === loser) { setError("Winner and loser must be different."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`/api/ladder/${slug}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner_id: winner,
          loser_id: loser,
          score: score.trim(),
          played_at: date,
          submitter_name: yourName.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Something went wrong.");
        return;
      }
      setDone(true);
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Ladder</p>
            <h2 className="font-display text-2xl font-light text-foreground">Submit a score</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -mt-1 -mr-1"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-3">✓</p>
            <p className="font-medium text-foreground mb-1">Score submitted!</p>
            <p className="text-sm text-muted-foreground mb-6">
              It&apos;ll show up once Thien reviews and approves it.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Winner
                </label>
                <select
                  value={winner}
                  onChange={e => setWinner(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">— select —</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>#{p.rank} {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Loser
                </label>
                <select
                  value={loser}
                  onChange={e => setLoser(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">— select —</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>#{p.rank} {p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Score
                </label>
                <input
                  placeholder="e.g. 6-3, 7-5"
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  maxLength={80}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Date played
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                Your name <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <input
                placeholder="So Thien knows who submitted"
                value={yourName}
                onChange={e => setYourName(e.target.value)}
                maxLength={60}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && <p className="font-mono text-xs text-red-500">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                onClick={submit}
                disabled={submitting || !winner || !loser || !score.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                {submitting ? "Submitting…" : "Submit score"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-border font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
