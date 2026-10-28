"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BookButton } from "@/components/book-button";
import { RATES } from "@/lib/site";

const NAME = "thien";

export function Hero() {
  const reduce = useReducedMotion();
  // As the first screen leaves, the name settles a little smaller.
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], reduce ? [1, 1] : [1, 0.92]);

  return (
    <section
      aria-labelledby="hero-title"
      className="px-[var(--gutter)] pb-16 pt-4 md:pb-24 md:pt-8 xl:flex xl:items-end xl:justify-between xl:gap-12 xl:pb-28 xl:pt-12"
    >
      <motion.h1
        id="hero-title"
        aria-label="Thien, tennis and pickleball coach in Connecticut"
        style={{ scale, transformOrigin: "0% 100%" }}
        className="wordmark t-mark w-fit shrink-0 whitespace-nowrap text-[37vw] md:text-[30vw] xl:text-[24vw]"
      >
        <span className="hero-rise inline-block">{NAME}</span>
      </motion.h1>

      <div className="mt-6 flex max-w-[34rem] flex-col gap-5 md:mt-10 xl:mt-0 xl:pb-[2vw]">
        <p className="t-statement rise" style={{ ["--d" as string]: "0.3s" }}>
          Private tennis and pickleball lessons in Connecticut, for every level.
        </p>
        <p className="rise max-w-[38ch]" style={{ ["--d" as string]: "0.4s" }}>
          RSPA certified coach at Twin Lakes Beach Club and Lakeridge. 60 or 90 minutes, ${RATES.hourly} an hour.
        </p>
        <div className="rise mt-2 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.5s" }}>
          <BookButton className="btn btn-primary !h-[52px] !px-[26px]" />
          <a href="#courts" className="btn btn-quiet !h-[52px] !px-[24px]">
            See the courts
          </a>
        </div>
      </div>
    </section>
  );
}
