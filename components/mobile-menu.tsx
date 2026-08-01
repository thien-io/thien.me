"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { NAV_ITEMS } from "./nav-items";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative flex size-9 shrink-0 items-center justify-center md:hidden"
      >
        <span
          className={clsx(
            "absolute h-[1.5px] w-[20px] bg-foreground transition-transform duration-300 ease-apple",
            open ? "translate-y-0 rotate-45" : "-translate-y-[6px]"
          )}
        />
        <span
          className={clsx(
            "absolute h-[1.5px] w-[20px] bg-foreground transition-opacity duration-150 ease-apple",
            open ? "opacity-0" : "opacity-100"
          )}
        />
        <span
          className={clsx(
            "absolute h-[1.5px] w-[20px] bg-foreground transition-transform duration-300 ease-apple",
            open ? "translate-y-0 -rotate-45" : "translate-y-[6px]"
          )}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-x-0 top-14 bottom-0 z-[70] bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed right-0 top-14 bottom-0 z-[70] flex w-[min(82vw,320px)] flex-col border-l border-border bg-background px-6 py-5 outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
        >
          <Dialog.Title className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            Menu
          </Dialog.Title>

          <nav aria-label="Mobile" className="mt-6 flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3.5 text-[15px] font-bold uppercase tracking-[0.02em] transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="mt-auto bg-primary px-5 py-3 text-center text-[12px] font-bold uppercase tracking-[0.06em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book a session
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
