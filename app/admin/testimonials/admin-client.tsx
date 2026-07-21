"use client";

import { useState, type FormEvent } from "react";
import type { AdminTestimonial } from "@/lib/supabase/testimonials-admin";

export function AdminTestimonialsClient() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid secret");
        return;
      }
      setTestimonials(data.testimonials);
      setAuthed(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleHidden(id: string, hidden: boolean) {
    const res = await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ id, hidden }),
    });
    if (res.ok) {
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, hidden } : t)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial permanently?")) return;
    const res = await fetch("/api/admin/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  }

  if (!authed) {
    return (
      <div className="px-8 md:px-16 py-16 max-w-sm">
        <h1 className="font-display text-3xl font-light mb-6">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-8 md:px-16 py-16">
      <h1 className="font-display text-3xl font-light mb-8">Testimonials ({testimonials.length})</h1>
      <div className="space-y-3 max-w-2xl">
        {testimonials.map((t) => (
          <div key={t.id} className="p-4 border border-border rounded-xl bg-card flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-foreground mb-1">{t.quote}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t.name} · {t.context} {t.hidden && "· hidden"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleHidden(t.id, !t.hidden)}
                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                {t.hidden ? "Unhide" : "Hide"}
              </button>
              <button
                onClick={() => remove(t.id)}
                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-red-600 hover:border-red-600/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
