"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useBooking } from "@/components/booking/booking-provider";
import { InlinePhoto, StageSection } from "@/components/home/stage";
import { COURTS, EMAIL, type CourtId } from "@/lib/site";

/* The live thing: choose a court and the stage turns to that place; its
   calendar is one press away. */
export function Courts() {
  const [selected, setSelected] = useState<CourtId>("twin");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { open } = useBooking();
  const court = COURTS.find((c) => c.id === selected)!;

  function onKey(e: React.KeyboardEvent, i: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + COURTS.length) % COURTS.length;
    setSelected(COURTS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <StageSection id="courts" photo={court.photo} labelledBy="courts-title" className="section-pad">
      <div className="reveal-line">
        <h2 id="courts-title" className="t-h2">
          <span className="line-mask"><span>Where we&apos;ll play.</span></span>
        </h2>
      </div>
      <p className="reveal mt-5 max-w-[40ch]" style={{ ["--d" as string]: "0.08s" }}>
        Two clubs are booking now. Three more open with the season.
      </p>

      <div
        className="reveal mt-9 flex"
        style={{ ["--d" as string]: "0.16s" }}
      >
        <div role="tablist" aria-label="Courts" className="flex w-full flex-wrap gap-1 rounded-[24px] bg-surface p-1 sm:w-auto">
          {COURTS.map((c, i) => {
            const on = c.id === selected;
            return (
              <button
                key={c.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                id={`courts-tab-${c.id}`}
                aria-selected={on}
                aria-controls="courts-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setSelected(c.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`press relative h-11 shrink-0 rounded-full px-4 font-ui text-[15px] transition-colors duration-300 ${
                  on ? "text-ink" : "text-soft hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="courts-pill"
                    className="absolute inset-0 rounded-full bg-paper"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative whitespace-nowrap">{c.short}</span>
              </button>
            );
          })}
        </div>
      </div>


      <div
        id="courts-panel"
        role="tabpanel"
        aria-labelledby={`courts-tab-${court.id}`}
        className="relative mt-8 min-h-[330px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={court.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="t-statement font-semibold">
              {court.name}
            </h3>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5">
              {[
                ["Town", `${court.town}, CT`],
                ["Plays", court.sports],
                ["Courts", court.surface],
                ["Who", court.note],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="t-small pt-[3px] text-soft">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {court.calLink ? (
                <button type="button" onClick={() => open(court.id)} className="btn btn-primary" aria-haspopup="dialog">
                  See open times
                  <ArrowRight className="arrow h-4 w-4" aria-hidden />
                </button>
              ) : (
                <>
                  <span className="t-small inline-flex h-[46px] items-center rounded-full bg-surface px-5 text-soft">
                    Opens with the season
                  </span>
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Tell me when ${court.name} opens`)}`}
                    className="btn btn-quiet"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    Tell me when
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <InlinePhoto photo={court.photo} aspect="aspect-[4/3]" className="mt-10" />
    </StageSection>
  );
}
