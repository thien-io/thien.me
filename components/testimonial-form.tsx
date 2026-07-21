"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function TestimonialForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [quote, setQuote] = useState("");
  const [hpToken, setHpToken] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("pending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, context, quote, hp_token: hpToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setName("");
      setContext("");
      setQuote("");
      setStatus("success");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="hp_token">Reference code</label>
        <input
          id="hp_token"
          name="hp_token"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={hpToken}
          onChange={(e) => setHpToken(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Name
        </label>
        <input
          id="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
        />
      </div>

      <div>
        <label htmlFor="context" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Context <span className="normal-case tracking-normal text-muted-foreground/70">(e.g. &quot;Tennis · Twin Lakes&quot;)</span>
        </label>
        <input
          id="context"
          required
          maxLength={120}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
        />
      </div>

      <div>
        <label htmlFor="quote" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Your testimonial
        </label>
        <textarea
          id="quote"
          required
          maxLength={600}
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground leading-relaxed focus:outline-none focus:border-primary/40 transition-all resize-none"
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
      {status === "success" && <p className="text-sm text-primary">Thanks for sharing — your testimonial is live.</p>}

      <button
        type="submit"
        disabled={status === "pending"}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "pending" ? "Submitting…" : "Submit testimonial"}
      </button>
    </form>
  );
}
