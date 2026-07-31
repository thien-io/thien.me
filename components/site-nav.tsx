"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { NAV_ITEMS } from "./nav-items";
import logo from "../app/icon.png";

export function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-border bg-background/90 backdrop-blur-md">
      {/* Desktop */}
      <div className="mx-auto hidden h-16 max-w-5xl items-center justify-between px-8 md:flex md:px-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="thien.me" width={26} height={26} className="h-6 w-auto" priority />
          <span className="font-heading text-2xl leading-none tracking-[0.02em]">THIEN</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "border-b-2 pb-0.5 text-[11px] font-bold uppercase tracking-[0.06em] transition-colors",
                isActive(item.href)
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="rounded-full bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book
          </Link>
        </nav>
      </div>
      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between px-5 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="thien.me" width={24} height={24} className="h-6 w-auto" priority />
          <span className="font-heading text-xl leading-none tracking-[0.02em]">THIEN</span>
        </Link>
        <Link
          href="/booking"
          className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-primary-foreground"
        >
          Book
        </Link>
      </div>
    </header>
  );
}
