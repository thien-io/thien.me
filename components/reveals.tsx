"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Marks `.reveal` and `.reveal-line` elements with `data-in` once they scroll into view. */
export function Reveals() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    const observe = () =>
      document
        .querySelectorAll(".reveal:not([data-in]), .reveal-line:not([data-in])")
        .forEach((el) => io.observe(el));
    observe();
    // Content streamed in after the first paint (dynamic sections) is picked up too.
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
