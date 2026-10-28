"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BookButton } from "@/components/book-button";
import { InlinePhoto, StageSection } from "@/components/home/stage";
import { RATES } from "@/lib/site";

const NAME = "thien";

/* The name crosses from the reading column onto the photograph. Where it lies over
   the picture it is set in paper colour, over the paper in ink; the split follows
   the stage's edge exactly. As the first screen leaves, the name settles smaller. */
function Wordmark({ reduce }: { reduce: boolean | null }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [overlap, setOverlap] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const column = el.closest("[data-reading-column]") as HTMLElement | null;
      if (!column || window.innerWidth < 1024) return setOverlap(0);
      setOverlap(Math.max(0, column.getBoundingClientRect().left - el.getBoundingClientRect().left));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], reduce ? [1, 1] : [1, 0.92]);

  return (
    <motion.h1
      ref={ref}
      id="hero-title"
      aria-label="Thien, tennis and pickleball coach in Connecticut"
      data-text={NAME}
      style={{ scale, transformOrigin: `${overlap}px 0%`, ["--overlap" as string]: `${overlap}px` }}
      className="wordmark t-mark relative w-fit whitespace-nowrap text-[37vw] lg:-ml-[11vw] lg:text-[22vw]"
    >
      <span className="hero-rise inline-block">{NAME}</span>
    </motion.h1>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <StageSection
      photo="twinLakes"
      labelledBy="hero-title"
      className="relative flex flex-col lg:min-h-[calc(100svh-var(--header-h))]"
    >
      <InlinePhoto photo="twinLakes" aspect="aspect-[5/4]" className="mx-[var(--gutter)] mt-2" priority caption={false} />

      <div className="flex flex-1 flex-col px-[var(--gutter)] pt-6 lg:px-[clamp(40px,4.5vw,72px)] lg:pt-[7svh]">
        <Wordmark reduce={reduce} />
        <p className="t-statement rise mt-8 max-w-[26ch] lg:mt-auto" style={{ ["--d" as string]: "0.3s" }}>
          Private tennis and pickleball lessons in Connecticut, for every level.
        </p>
        <p className="rise mt-5 max-w-[36ch]" style={{ ["--d" as string]: "0.4s" }}>
          RSPA certified coach at Twin Lakes Beach Club and Lakeridge. 60 or 90 minutes, ${RATES.hourly} an hour.
        </p>
        <div className="rise mt-8 flex flex-wrap gap-3 lg:pb-[9svh]" style={{ ["--d" as string]: "0.5s" }}>
          <BookButton className="btn btn-primary !h-[52px] !px-[26px]" />
          <a href="#courts" className="btn btn-quiet !h-[52px] !px-[24px]">
            See the courts
          </a>
        </div>

      </div>
    </StageSection>
  );
}
