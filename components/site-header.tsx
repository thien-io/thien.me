"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { BookButton } from "@/components/book-button";
import { EMAIL } from "@/lib/site";

export const NAV = [
  { id: "about", label: "About" },
  { id: "courts", label: "Courts" },
  { id: "rates", label: "Rates" },
  { id: "messages", label: "Messages" },
  { id: "questions", label: "Questions" },
];

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return setActive(null);
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)] bg-paper">
      <div className="flex h-full items-center justify-between gap-4 px-[var(--gutter)]">
        <Link href="/" className="press flex items-center gap-2 text-ink" aria-label="thien, home">
          <LogoMark className="h-[22px] w-[22px] text-moss" />
          <span className="font-serif text-[22px] font-semibold leading-none tracking-[-0.04em]">thien</span>
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={`/#${n.id}`}
              aria-current={active === n.id ? "true" : undefined}
              className="relative rounded-full px-3.5 py-2 font-ui text-[15px] text-soft transition-colors duration-300 hover:text-ink aria-[current=true]:text-ink"
            >
              {active === n.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-surface"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{n.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BookButton className="btn btn-primary btn-sm md:h-[42px] md:px-[18px] md:text-[15px]" />
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger
              className="press flex h-[38px] items-center gap-2 rounded-full bg-surface px-4 font-ui text-[14px] font-medium text-ink transition-colors hover:bg-surface-2 lg:hidden"
              aria-label="Open menu"
            >
              <span className="flex w-[14px] flex-col gap-[4px]" aria-hidden>
                <span className="h-[1.5px] w-full rounded bg-ink" />
                <span className="h-[1.5px] w-full rounded bg-ink" />
              </span>
              Menu
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[90] bg-[rgba(24,26,20,0.4)]" />
              <Dialog.Content className="sheet-panel fixed inset-x-0 bottom-0 z-[91] flex max-h-[92svh] flex-col rounded-t-[22px] bg-paper px-6 pb-8 pt-5 focus:outline-none">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-serif text-[24px] font-semibold tracking-[-0.04em]">thien</Dialog.Title>
                  <Dialog.Close className="press flex h-10 w-10 items-center justify-center rounded-full bg-surface" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Jump to a section of the page</Dialog.Description>
                <nav aria-label="Sections" className="mt-8 flex flex-col">
                  {NAV.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={`/#${n.id}`}
                        onClick={(e) => {
                          // Let the sheet finish closing (it locks scroll) before jumping.
                          if (!onHome) return setMenuOpen(false);
                          e.preventDefault();
                          setMenuOpen(false);
                          setTimeout(() => {
                            document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth" });
                            history.replaceState(null, "", `#${n.id}`);
                          }, 380);
                        }}
                        className="press block py-2 font-serif text-[40px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink"
                      >
                        {n.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-8 flex flex-col gap-4"
                >
                  <div onClick={() => setMenuOpen(false)}>
                    <BookButton className="btn btn-primary w-full !h-[54px] !text-[16px]" />
                  </div>
                  <a href={`mailto:${EMAIL}`} className="t-small link-line self-start text-soft">
                    {EMAIL}
                  </a>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
