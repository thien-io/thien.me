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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchEntries();
  }, []);

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
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-12 animate-fade-in">
        <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">
          Guestbook
        </p>
        <h1 className="font-display text-5xl font-light mb-4">
          Leave a note
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-lg">
          Whether you've trained with me, played against me, or just want to say
          hi — I'd love to hear from you.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-12 p-6 rounded-xl border border-border bg-card opacity-0 animate-fade-in [animation-delay:100ms]"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={60}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thien really helped me with my backhand..."
              maxLength={300}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right font-mono">
              {message.length}/300
            </p>
          </div>
          {error && (
            <p className="text-xs text-red-500 font-mono">{error}</p>
          )}
          {success && (
            <p className="text-xs text-green-600 dark:text-green-400 font-mono">
              ✓ Message posted — thanks!
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post message"}
          </button>
        </div>
      </form>

      {/* Entries */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-border bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-display text-2xl font-light text-muted-foreground">
              No messages yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to leave one ↑
            </p>
          </div>
        ) : (
          entries.map((entry, i) => (
            <div
              key={entry.id}
              className="p-5 rounded-xl border border-border bg-card opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-medium text-sm text-foreground">
                  {entry.name}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {entry.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
