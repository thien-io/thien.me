"use client";

import { ParallaxSection } from "@/components/parallax-section";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
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
      <section className='relative px-8 md:px-16 pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden'>
        <ParallaxSection
          speed={0.12}
          className='absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden'
        >
          <span className='font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]'>
            hello
          </span>
        </ParallaxSection>

        <div className='relative z-10'>
          <p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8'>
            Guestbook
          </p>
          <h1 className='font-display text-5xl md:text-6xl font-light leading-tight mb-6'>
            Leave a<br />
            <em className='text-primary'>message.</em>
          </h1>
          <p className='text-muted-foreground max-w-sm leading-relaxed'>
            Whether you’ve trained with me, played with me, or just want to say
            hi — I’d love to hear from you.
          </p>
        </div>
      </section>

      <div className='h-px bg-border/50 mx-8 md:mx-16' />

      {/* Form */}
      <section className='px-8 md:px-16 py-8 md:py-16'>
        <form onSubmit={handleSubmit} className='max-w-md space-y-5'>
          <div>
            <label className='font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2'>
              Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your name'
              maxLength={60}
              className='w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow placeholder:text-muted-foreground/50'
            />
          </div>
          <div>
            <label className='font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2'>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Thien really helped me with my backhand...'
              maxLength={300}
              rows={4}
              className='w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none placeholder:text-muted-foreground/50'
            />
            <p className='font-mono text-[10px] text-muted-foreground mt-1.5 text-right'>
              {message.length} / 300
            </p>
          </div>

          {error && <p className='font-mono text-xs text-red-500'>{error}</p>}
          {success && (
            <p className='font-mono text-xs text-green-600'>
              ✓ Posted — thanks!
            </p>
          )}

          <button
            type='submit'
            disabled={submitting || !name.trim() || !message.trim()}
            className='px-6 py-3 rounded-xl bg-primary text-white font-mono text-xs tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'
          >
            {submitting ? 'Posting...' : 'Post message'}
          </button>
        </form>
      </section>

      <div className='h-px bg-border/50 mx-8 md:mx-16' />

      {/* Entries */}
      <section className='px-8 md:px-16 py-8 md:py-16'>
        {loading ? (
          <div className='space-y-4 max-w-md'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-20 rounded-xl border border-border bg-muted/40 animate-pulse'
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className='py-16'>
            <p className='font-display text-3xl font-light text-muted-foreground'>
              No messages yet.
            </p>
            <p className='font-mono text-xs text-muted-foreground mt-3'>
              Be the first ↑
            </p>
          </div>
        ) : (
          <div className='rounded-xl border border-border bg-card overflow-hidden divide-y divide-border max-w-lg'>
            {entries.map((entry) => {
              const idx = hashIndex(entry.id);
              return (
                <div key={entry.id} className='flex gap-4 px-5 py-4 hover:bg-accent/40 transition-colors'>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5 ${AVATAR_COLORS[idx]}`}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-baseline gap-2'>
                      <span className={`font-semibold text-sm ${NAME_COLORS[idx]}`}>
                        {entry.name}
                      </span>
                      <span className='font-mono text-[10px] text-muted-foreground'>
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className='text-sm text-foreground/80 leading-relaxed mt-0.5'>
                      {entry.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
