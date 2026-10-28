"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, X } from "lucide-react";
import { CalEmbed } from "@/components/cal-embed";
import { COURTS, EMAIL, PHOTOS, RATES, type CourtId } from "@/lib/site";

export function BookingDialog({
  open,
  onOpenChange,
  court,
  onCourtChange,
  onBooked,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  court: CourtId;
  onCourtChange: (id: CourtId) => void;
  onBooked: () => void;
}) {
  const active = COURTS.find((c) => c.id === court) ?? COURTS[0];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onTabKey(e: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1,
    };
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const next = e.key === "Home" ? 0 : COURTS.length - 1;
      onCourtChange(COURTS[next].id);
      tabRefs.current[next]?.focus();
      return;
    }
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (index + keys[e.key] + COURTS.length) % COURTS.length;
    onCourtChange(COURTS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[100] bg-[rgba(24,26,20,0.55)]" />
        <Dialog.Content
          className="booking-panel fixed inset-x-0 bottom-0 z-[101] flex h-[94svh] flex-col overflow-hidden rounded-t-[22px] bg-paper shadow-[0_30px_80px_-20px_rgba(20,22,16,0.5)] focus:outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(840px,92svh)] md:w-[min(1120px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:flex-row md:rounded-[22px]"
          aria-describedby="booking-desc"
        >
          {/* Rail: court tabs */}
          <div className="flex shrink-0 flex-col bg-surface md:w-[320px]">
            <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 md:px-7 md:pt-8">
              <div>
                <Dialog.Title className="t-h2 !text-[28px] md:!text-[34px]">Book a lesson</Dialog.Title>
                <Dialog.Description id="booking-desc" className="t-small mt-2 text-soft">
                  60 or 90 minutes, ${RATES.hourly} an hour. I text you to confirm.
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="press -mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-white md:hidden"
                aria-label="Close booking"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div
              role="tablist"
              aria-label="Courts"
              aria-orientation="vertical"
              className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-4 md:flex-col md:gap-1 md:overflow-visible md:px-4 md:pb-0"
            >
              {COURTS.map((c, i) => {
                const selected = c.id === court;
                return (
                  <button
                    key={c.id}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    role="tab"
                    id={`court-tab-${c.id}`}
                    aria-selected={selected}
                    aria-controls="court-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => onCourtChange(c.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className="press group relative shrink-0 rounded-2xl px-4 py-3 text-left md:px-4 md:py-3.5"
                  >
                    {selected && (
                      <motion.span
                        layoutId="court-tab-pill"
                        className="absolute inset-0 rounded-2xl bg-paper"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2.5">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                          c.calLink ? "bg-moss" : "bg-soft/40"
                        }`}
                        aria-hidden
                      />
                      <span className="font-ui whitespace-nowrap text-[15px] font-medium text-ink">{c.short}</span>
                    </span>
                    <span className="t-fine relative mt-0.5 hidden whitespace-nowrap pl-[18px] text-soft md:block">
                      {c.town} · {c.calLink ? c.sports : "Opens with the season"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto hidden px-7 pb-7 md:block">
              <p className="t-fine text-soft">
                Questions first?{" "}
                <a href={`mailto:${EMAIL}`} className="link-line text-ink">
                  {EMAIL}
                </a>
              </p>
            </div>
          </div>

          {/* Panel */}
          <div
            id="court-panel"
            role="tabpanel"
            aria-labelledby={`court-tab-${active.id}`}
            className="relative min-h-0 flex-1 overflow-y-auto"
          >
            <Dialog.Close
              className="press absolute right-5 top-5 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-surface-2 md:flex"
              aria-label="Close booking"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full flex-col"
              >
                <div className="px-5 pb-2 pt-1 md:px-10 md:pr-20 md:pt-9">
                  <p className="font-ui text-[15px] font-medium text-ink">{active.name}</p>
                  <p className="t-small text-soft">
                    {active.town} · {active.surface} · {active.note}
                  </p>
                </div>

                {active.calLink ? (
                  <div className="min-h-0 flex-1 px-1 md:px-4">
                    <CalEmbed calLink={active.calLink} namespace={active.id} onBooked={onBooked} />
                  </div>
                ) : (
                  <OffSeason courtName={active.name} photo={active.photo} onPick={onCourtChange} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function OffSeason({
  courtName,
  photo,
  onPick,
}: {
  courtName: string;
  photo: keyof typeof PHOTOS;
  onPick: (id: CourtId) => void;
}) {
  const p = PHOTOS[photo];
  const subject = encodeURIComponent(`Tell me when ${courtName} opens`);
  const body = encodeURIComponent(
    `Hi Thien,\n\nCould you let me know when lessons at ${courtName} open for the season?\n\nThanks,\n`,
  );
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 pb-8 pt-4 md:px-10 md:pt-6">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[14px] bg-surface">
        <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 760px, 100vw" className="drift object-cover" style={{ objectPosition: p.position }} />
      </div>
      <div className="max-w-[34rem]">
        <p className="t-statement">
          This calendar opens when the season starts. Send me a note and you will hear the day it goes live.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`mailto:${EMAIL}?subject=${subject}&body=${body}`} className="btn btn-primary">
            <Mail className="h-4 w-4" />
            Tell me when it opens
          </a>
          <button type="button" onClick={() => onPick("lakeridge")} className="btn btn-quiet">
            Book Lakeridge now
            <ArrowRight className="arrow h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
