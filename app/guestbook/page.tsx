"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/guestbook");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setError("Failed to load entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setName("");
      setMessage("");
      setSuccess(true);
      await fetchEntries();
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="px-8 md:px-16 pt-24 pb-20 md:pt-32 md:pb-24">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
          Guestbook
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
          Leave a<br />
          <em className="text-primary">note.</em>
        </h1>
        <p className="text-muted-foreground max-w-sm leading-relaxed">
          Whether you've trained with me, played with me, or just want to say hi — I'd love
          to hear from you.
        </p>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Form */}
      <section className="px-8 md:px-16 py-16">
        <form onSubmit={handleSubmit} className="max-w-md space-y-5">
          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={60}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow placeholder:text-muted-foreground/50"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thien really helped me with my backhand..."
              maxLength={300}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none placeholder:text-muted-foreground/50"
            />
            <p className="font-mono text-[10px] text-muted-foreground mt-1.5 text-right">
              {message.length} / 300
            </p>
          </div>

          {error && <p className="font-mono text-xs text-red-500">{error}</p>}
          {success && (
            <p className="font-mono text-xs text-green-600 dark:text-green-400">
              ✓ Posted — thanks!
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post message"}
          </button>
        </form>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Entries */}
      <section className="px-8 md:px-16 py-16">
        {loading ? (
          <div className="space-y-4 max-w-md">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl border border-border bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16">
            <p className="font-display text-3xl font-light text-muted-foreground">
              No messages yet.
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-3">
              Be the first ↑
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-6 rounded-xl border border-border bg-card hover:border-border/80 transition-colors"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    {entry.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
