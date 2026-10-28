"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { InlinePhoto, StageSection } from "@/components/home/stage";
import { TestimonialForm } from "@/components/testimonial-form";
import type { Testimonial } from "@/lib/supabase/testimonials";

const AUTOPLAY_MS = 8000;

export function Messages({ testimonials }: { testimonials: Testimonial[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (step: number) => {
      if (!count) return;
      setDir(step);
      setIndex((i) => (i + step + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused || reduce) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduce, count, go]);

  const t = testimonials[index];

  return (
    <StageSection id="messages" photo="twinEvening" labelledBy="messages-title" className="section-pad">
      <div className="reveal-line">
        <h2 id="messages-title" className="t-h2">
          <span className="line-mask"><span>Notes from players.</span></span>
        </h2>
      </div>
      <InlinePhoto photo="twinEvening" aspect="aspect-[3/2]" className="mt-8" />

      {t ? (
        <div
          className="reveal mt-10"
          style={{ ["--d" as string]: "0.1s" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="relative min-h-[260px] md:min-h-[300px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={t.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="t-statement max-w-[32ch]">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block font-medium">{t.name}</span>
                  <span className="t-small block text-soft">{t.context}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-6 flex items-center gap-4">
              <button type="button" onClick={() => go(-1)} className="press flex h-11 w-11 items-center justify-center rounded-full bg-surface transition-colors hover:bg-surface-2" aria-label="Previous message">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => go(1)} className="press flex h-11 w-11 items-center justify-center rounded-full bg-surface transition-colors hover:bg-surface-2" aria-label="Next message">
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="ml-1 flex items-center gap-1.5" role="group" aria-label="Choose a message">
                {testimonials.map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                    aria-label={`Message ${i + 1} of ${count}, from ${m.name}`}
                    aria-current={i === index ? "true" : undefined}
                    className="group flex h-6 items-center"
                  >
                    <motion.span
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      className={`block h-2 rounded-full transition-colors ${i === index ? "w-7 bg-ink" : "w-2 bg-soft/35 group-hover:bg-soft/70"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="reveal mt-5 max-w-[40ch]" style={{ ["--d" as string]: "0.08s" }}>
            Hit with me? Leave a note for the next player. It shows up right here.
          </p>
          <div className="reveal mt-9 max-w-[38rem]" style={{ ["--d" as string]: "0.16s" }}>
            <TestimonialForm />
          </div>
        </>
      )}

      {t && (
        <div className="reveal mt-10 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.16s" }}>
          <LeaveMessage />
          {count > 1 && <AllMessages testimonials={testimonials} />}
        </div>
      )}
    </StageSection>
  );
}

function DialogShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[100] bg-[rgba(24,26,20,0.55)]" />
      <Dialog.Content className="booking-panel fixed inset-x-0 bottom-0 z-[101] max-h-[92svh] overflow-y-auto rounded-t-[22px] bg-paper p-6 shadow-[0_30px_80px_-20px_rgba(20,22,16,0.5)] focus:outline-none md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(680px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[22px] md:p-10">
        <div className="flex items-start justify-between gap-6">
          <Dialog.Title className="t-h2 !text-[30px] md:!text-[36px]">{title}</Dialog.Title>
          <Dialog.Close className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface transition-colors hover:bg-surface-2" aria-label="Close">
            <X className="h-5 w-5" />
          </Dialog.Close>
        </div>
        <Dialog.Description className="t-small mt-2 text-soft">{description}</Dialog.Description>
        <div className="mt-7">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function LeaveMessage() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="btn btn-primary">Leave a message</Dialog.Trigger>
      <DialogShell title="Leave a message" description="Hit with me? Say hi. It shows up on this page.">
        <TestimonialForm onDone={() => setOpen(false)} />
      </DialogShell>
    </Dialog.Root>
  );
}

function AllMessages({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn btn-quiet">Read all {testimonials.length}</Dialog.Trigger>
      <DialogShell title="Notes from players" description={`${testimonials.length} messages, newest first.`}>
        <ul className="flex flex-col gap-8">
          {testimonials.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + Math.min(i, 8) * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[18px] leading-[1.5]">&ldquo;{m.quote}&rdquo;</p>
              <p className="t-small mt-2">
                <span className="font-medium">{m.name}</span>
                <span className="text-soft"> · {m.context}</span>
              </p>
            </motion.li>
          ))}
        </ul>
      </DialogShell>
    </Dialog.Root>
  );
}
