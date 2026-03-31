"use client";

import { useEffect, useRef } from "react";

const timeline = [
  { year: "2006", event: "Started playing tennis", detail: "Weekend lessons. Never really stopped." },
  { year: "2009", event: "Joined a junior program", detail: "Started competing. Lost a lot. Learned more." },
  { year: "2012", event: "Graduated UConn", detail: "Studied there, played there, left with a degree and no idea what was next." },
  { year: "2015", event: "Coaching full-time at a local club", detail: "Early mornings, long days, zero regrets." },
  { year: "2018", event: "USPTA certified", detail: "Made it official." },
  { year: "2019", event: "Visited Vietnam", detail: "Hanoi, Hoi An, Ho Chi Minh City. Changed how I think about a lot of things." },
  { year: "2019", event: "Coached my first competitive junior", detail: "She made the state finals in U16. Still one of my proudest moments." },
  { year: "2020", event: "Went out on my own", detail: "Left the club and built something from scratch. Scary. Right." },
  { year: "2021", event: "Started playing pickleball", detail: "Picked it up on a whim. Got serious within a month." },
  { year: "2022", event: "100th student", detail: "Realized I had something worth continuing." },
  { year: "2023", event: "Won a 4.0 DUPR pickleball tournament", detail: "First competitive tournament win. Didn't expect it to feel that good." },
  { year: "2023", event: "Visited Japan", detail: "Tokyo, Kyoto, Osaka. Already planning to go back." },
  { year: "2023", event: "Built a weekly training group", detail: "A handful of regulars who show up every week. The most satisfying coaching I do." },
  { year: "2025", event: "Reached 4.4 DUPR in pickleball", detail: "Still climbing." },
  { year: "2026", event: "First 4.5 USTA match", detail: "Been working toward this level for a while. Finally competing at it." },
  { year: "Now",  event: "Still here, still learning", detail: "The work doesn't stop. Neither does the curiosity.", isNow: true },
];

// Dot X position (pixels from left edge of container)
const DOT_LEFT = 72 + 20; // w-[72px] year + mx-5 gap + centre of dot

export function ScrollTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line      = lineRef.current;
    if (!container || !line) return;

    const dots  = Array.from(container.querySelectorAll<HTMLElement>("[data-dot]"));
    const items = Array.from(container.querySelectorAll<HTMLElement>("[data-item]"));

    // ── Scroll handler: drive line fill and trigger each item when line reaches dot ──
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const viewH         = window.innerHeight;

      // Progress 0→1 as the section scrolls through the viewport.
      // Use a tighter window so the line moves faster relative to scroll.
      const scrollable = containerRect.height * 0.7 + viewH;
      const scrolled   = viewH - containerRect.top;
      const progress   = Math.min(1, Math.max(0, scrolled / scrollable));

      line.style.transform = `scaleY(${progress})`;

      // The line top is at containerRect.top + a small offset (top-2 → 8px).
      // The filled portion of the line ends at:
      const lineTop = containerRect.top + 8;
      const lineH   = container.offsetHeight - 16; // accounts for top-2 bottom-2
      const lineEnd = lineTop + lineH * progress;   // current y of the fill front

      dots.forEach((dot, i) => {
        const item     = items[i];
        const dotRect  = dot.getBoundingClientRect();
        const dotCentY = dotRect.top + dotRect.height / 2;

        if (lineEnd >= dotCentY) {
          // Line has reached this dot → fill it and reveal text
          dot.classList.add("reached");
          item.classList.add("revealed");
        } else {
          dot.classList.remove("reached");
          item.classList.remove("revealed");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative pl-4">
      {/* Track line */}
      <div className="absolute left-[92px] top-2 bottom-2 w-px bg-border/40" />
      {/* Animated fill line */}
      <div
        ref={lineRef}
        className="absolute left-[92px] top-2 bottom-2 w-px bg-primary origin-top transition-transform duration-100"
        style={{ transform: "scaleY(0)" }}
      />

      <div className="space-y-9">
        {timeline.map((item, i) => (
          <div key={i} className="flex items-start">
            {/* Year label */}
            <span className="w-[72px] shrink-0 font-mono text-[11px] text-muted-foreground pt-1 text-right select-none">
              {item.year}
            </span>

            {/* Dot */}
            <div className="relative mx-5 mt-[7px] shrink-0">
              {item.isNow ? (
                /* "Now" dot — pulsating ring */
                <span data-dot className="block relative w-2.5 h-2.5">
                  {/* Pulse ring — always visible */}
                  <span className="absolute inset-0 rounded-full bg-primary/30 animate-[nowPulse_2s_ease-in-out_infinite]" />
                  {/* Inner solid dot — fills when reached */}
                  <span className="dot-inner absolute inset-[1px] rounded-full border border-primary bg-background transition-colors duration-300" />
                </span>
              ) : (
                /* Normal dot */
                <span data-dot className="dot-wrap block w-2 h-2 rounded-full border border-primary bg-background transition-colors duration-300" />
              )}
            </div>

            {/* Text — slides in from the dot position */}
            <div
              data-item
              className="flex-1 pb-2 timeline-text-item"
            >
              <p className="text-sm font-medium text-foreground leading-snug">{item.event}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* Text reveal — starts hidden/shifted left, slides right when revealed */
        .timeline-text-item {
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .timeline-text-item.revealed {
          opacity: 1;
          transform: translateX(0);
        }

        /* Normal dot — fills solid when reached */
        .dot-wrap.reached {
          background-color: hsl(var(--primary));
        }

        /* Now dot inner — fills when reached */
        [data-dot].reached .dot-inner {
          background-color: hsl(var(--primary));
        }

        /* Pulse animation for "Now" dot */
        @keyframes nowPulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
