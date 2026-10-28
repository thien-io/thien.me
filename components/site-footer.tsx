"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { BookButton } from "@/components/book-button";
import { NAV } from "@/components/site-header";
import { EMAIL, PHOTOS, VENMO } from "@/lib/site";

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["18%", "0%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "0%"]);
  const p = PHOTOS.randsView;
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative isolate flex min-h-[88svh] flex-col overflow-hidden text-field-ink md:min-h-[100svh]">
      <motion.div className="absolute inset-0 -z-10 scale-110" style={{ y: photoY }}>
        <Image
          src={p.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover brightness-[0.55]"
          style={{ objectPosition: "50% 60%" }}
        />
      </motion.div>

      <div className="flex flex-col gap-10 px-[var(--gutter)] pt-10 md:flex-row md:justify-between md:pt-12">
        <nav aria-label="Footer" className="flex flex-col gap-1.5">
          <h2 className="sr-only">Site</h2>
          {NAV.map((n) => (
            <Link key={n.id} href={`/#${n.id}`} className="link-line t-small w-fit">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-4 md:items-end md:text-right">
          <p className="t-statement max-w-[18ch]">See you on court.</p>
          <BookButton className="btn btn-paper w-fit" />
          <div className="t-small flex flex-col gap-1 md:items-end">
            <a href={`mailto:${EMAIL}`} className="link-line w-fit">
              {EMAIL}
            </a>
            <a href={VENMO} target="_blank" rel="noopener noreferrer" className="link-line w-fit">
              Venmo @thienmtran
            </a>
          </div>
        </div>
      </div>

      <div className="mt-auto px-[var(--gutter)] pb-6">
        <motion.p
          aria-hidden
          style={{ scale, y }}
          className="t-mark origin-bottom select-none pb-[0.06em] text-[38vw] md:text-[31vw]"
        >
          thien
        </motion.p>
        <div className="t-fine mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-field-ink/80">
          <span suppressHydrationWarning>© {year} thien.me · Private tennis and pickleball lessons in Connecticut</span>
          <Credits />
        </div>
      </div>
    </footer>
  );
}

function Credits() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="link-line press">Photo credits</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[100] bg-[rgba(24,26,20,0.55)]" />
        <Dialog.Content className="dialog-panel fixed left-1/2 top-1/2 z-[101] max-h-[86svh] w-[min(640px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[22px] bg-paper p-6 text-ink shadow-[0_30px_80px_-20px_rgba(20,22,16,0.5)] focus:outline-none md:p-9">
          <div className="flex items-start justify-between gap-6">
            <Dialog.Title className="t-h2 !text-[30px]">Photo credits</Dialog.Title>
            <Dialog.Close className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface" aria-label="Close credits">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="t-small mt-2 text-soft">
            Twin Lakes photos are my own. The rest are from Wikimedia Commons.
          </Dialog.Description>
          <ul className="mt-6 flex flex-col gap-4">
            {Object.values(PHOTOS).filter((p) => p.page).map((p) => (
              <li key={p.src} className="flex items-center gap-4">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-surface">
                  <Image src={p.src} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="t-small">
                  <a href={p.page} target="_blank" rel="noopener noreferrer" className="link-line font-medium">
                    {p.caption}
                  </a>
                  <span className="block text-soft">{p.credit}</span>
                </span>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
