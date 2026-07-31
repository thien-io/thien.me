"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { NAV_ITEMS } from "./nav-items";

export function TabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-[60] flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur-md md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-2 text-[9px] font-bold uppercase tracking-[0.04em]",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.25 : 1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
