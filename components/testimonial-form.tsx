"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const field =
  "w-full rounded-[14px] bg-surface px-4 py-3.5 font-ui text-[16px] text-ink placeholder:text-soft/70 transition-colors duration-300 hover:bg-surface-2 focus:bg-white focus:outline-none";

export function TestimonialForm({ onDone }: { onDone?: () => void }) {
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

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-start gap-5 py-6"
      >
        <motion.span
          initial={{ scale: 0.4, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ball text-ink"
        >
          <Check className="h-7 w-7" strokeWidth={2.5} />
        </motion.span>
        <p className="t-statement">Thank you. Your message is up.</p>
        {onDone && (
          <button type="button" onClick={onDone} className="btn btn-quiet">
            Close
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="t-small text-soft">Your name</span>
          <input
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="t-small text-soft">Where we played</span>
          <input
            required
            maxLength={120}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Tennis at Twin Lakes"
            className={field}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="t-small text-soft">Your message</span>
        <textarea
          required
          maxLength={600}
          rows={5}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          aria-describedby="quote-limit"
          className={`${field} resize-none leading-relaxed`}
        />
        <span id="quote-limit" className="t-fine self-end text-soft tabular">
          {quote.length} / 600
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="t-small text-[#a2261b]">
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === "pending"} className="btn btn-primary self-start disabled:opacity-60">
        {status === "pending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
