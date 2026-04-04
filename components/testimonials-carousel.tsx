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

function WriteMessageModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName]       = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  async function submit() {
    if (!name.trim() || !message.trim()) { setError("Name and message are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Guestbook</p>
            <h2 className="font-display text-2xl font-light text-foreground">Leave a message</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 -mt-1 -mr-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-3">✓</p>
            <p className="font-medium text-foreground mb-1">Message posted!</p>
            <p className="text-sm text-muted-foreground mb-6">Thanks for signing the guestbook.</p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Say something..."
                maxLength={300}
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <p className="font-mono text-[10px] text-muted-foreground mt-1 text-right">{message.length} / 300</p>
            </div>
            {error && <p className="font-mono text-xs text-red-500">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button
                onClick={submit}
                disabled={submitting || !name.trim() || !message.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                {submitting ? "Posting…" : "Post message"}
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

export function TestimonialsCarousel() {
  const [entries, setEntries]     = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState(false);

  function fetchEntries() {
    fetch("/api/guestbook")
      .then(r => r.json())
      .then(d => setEntries((d.entries || []).slice(0, 3)))
      .catch(() => {});
  }

  useEffect(() => { fetchEntries(); }, []);

  return (
    <>
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
              View all →
            </Link>
          </div>
        </ScrollReveal>

        {entries.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border mb-5">
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
        )}

        <ScrollReveal delay={160}>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487z" />
            </svg>
            Write a message
          </button>
        </ScrollReveal>
      </section>

      {showModal && (
        <WriteMessageModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchEntries}
        />
      )}
    </>
  );
}
