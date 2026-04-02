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

const ENTRY_COLORS = [
  { name: "text-rose-700 dark:text-rose-300",       border: "border-rose-200 dark:border-rose-800",       bg: "bg-rose-50 dark:bg-rose-900/20"       },
  { name: "text-pink-700 dark:text-pink-300",       border: "border-pink-200 dark:border-pink-800",       bg: "bg-pink-50 dark:bg-pink-900/20"       },
  { name: "text-fuchsia-700 dark:text-fuchsia-300", border: "border-fuchsia-200 dark:border-fuchsia-800", bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20" },
  { name: "text-violet-700 dark:text-violet-300",   border: "border-violet-200 dark:border-violet-800",   bg: "bg-violet-50 dark:bg-violet-900/20"   },
  { name: "text-purple-700 dark:text-purple-300",   border: "border-purple-200 dark:border-purple-800",   bg: "bg-purple-50 dark:bg-purple-900/20"   },
  { name: "text-indigo-700 dark:text-indigo-300",   border: "border-indigo-200 dark:border-indigo-800",   bg: "bg-indigo-50 dark:bg-indigo-900/20"   },
  { name: "text-blue-700 dark:text-blue-300",       border: "border-blue-200 dark:border-blue-800",       bg: "bg-blue-50 dark:bg-blue-900/20"       },
  { name: "text-sky-700 dark:text-sky-300",         border: "border-sky-200 dark:border-sky-800",         bg: "bg-sky-50 dark:bg-sky-900/20"         },
  { name: "text-cyan-700 dark:text-cyan-300",       border: "border-cyan-200 dark:border-cyan-800",       bg: "bg-cyan-50 dark:bg-cyan-900/20"       },
  { name: "text-teal-700 dark:text-teal-300",       border: "border-teal-200 dark:border-teal-800",       bg: "bg-teal-50 dark:bg-teal-900/20"       },
  { name: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { name: "text-green-700 dark:text-green-300",     border: "border-green-200 dark:border-green-800",     bg: "bg-green-50 dark:bg-green-900/20"     },
  { name: "text-lime-700 dark:text-lime-400",       border: "border-lime-200 dark:border-lime-800",       bg: "bg-lime-50 dark:bg-lime-900/20"       },
  { name: "text-yellow-700 dark:text-yellow-300",   border: "border-yellow-200 dark:border-yellow-800",   bg: "bg-yellow-50 dark:bg-yellow-900/20"   },
  { name: "text-amber-700 dark:text-amber-300",     border: "border-amber-200 dark:border-amber-800",     bg: "bg-amber-50 dark:bg-amber-900/20"     },
  { name: "text-orange-700 dark:text-orange-300",   border: "border-orange-200 dark:border-orange-800",   bg: "bg-orange-50 dark:bg-orange-900/20"   },
  { name: "text-red-700 dark:text-red-300",         border: "border-red-200 dark:border-red-800",         bg: "bg-red-50 dark:bg-red-900/20"         },
  { name: "text-rose-800 dark:text-rose-200",       border: "border-rose-200 dark:border-rose-800",       bg: "bg-rose-100 dark:bg-rose-900/30"      },
  { name: "text-sky-800 dark:text-sky-200",         border: "border-sky-200 dark:border-sky-800",         bg: "bg-sky-100 dark:bg-sky-900/30"        },
  { name: "text-emerald-800 dark:text-emerald-200", border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-100 dark:bg-emerald-900/30"},
  { name: "text-violet-800 dark:text-violet-200",   border: "border-violet-200 dark:border-violet-800",   bg: "bg-violet-100 dark:bg-violet-900/30"  },
  { name: "text-amber-800 dark:text-amber-200",     border: "border-amber-200 dark:border-amber-800",     bg: "bg-amber-100 dark:bg-amber-900/30"    },
];

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function buildColorIndices(entries: GuestbookEntry[]) {
  const indices: number[] = [];
  for (let i = 0; i < entries.length; i++) {
    let idx = hashId(entries[i].id) % ENTRY_COLORS.length;
    if (i > 0 && idx === indices[i - 1]) idx = (idx + 1) % ENTRY_COLORS.length;
    indices.push(idx);
  }
  return indices;
}

function ColoredEntries({ entries }: { entries: GuestbookEntry[] }) {
  const colorIndices = buildColorIndices(entries);
  return (
    <>
      {entries.map((entry, i) => {
        const color = ENTRY_COLORS[colorIndices[i]];
        return (
          <div
            key={entry.id}
            className={`p-6 rounded-xl border transition-colors ${color.border} ${color.bg}`}
          >
            <div className='flex items-baseline justify-between mb-3'>
              <span className={`text-sm font-medium ${color.name}`}>{entry.name}</span>
              <span className='font-mono text-[10px] text-muted-foreground'>
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className='text-sm text-foreground/80 leading-relaxed'>{entry.message}</p>
          </div>
        );
      })}
    </>
  );
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
      <section className='relative px-8 md:px-16 pt-10 pb-12 md:pt-32 md:pb-24 overflow-hidden'>
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
            <p className='font-mono text-xs text-green-600 dark:text-green-400'>
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
          <div className='space-y-4 max-w-md'>
            <ColoredEntries entries={entries} />
          </div>
        )}
      </section>
    </div>
  );
}
