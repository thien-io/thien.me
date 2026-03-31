"use client";

import { useEffect, useRef } from "react";

const timeline = [
  { year: "2006", event: "Started playing tennis", detail: "Weekend lessons. Never really stopped." },
  { year: "2009", event: "Joined a junior program", detail: "Started competing. Lost a lot. Learned more." },
  { year: "2012", event: "Graduated UConn", detail: "Studied there, played there, left with a degree and no idea what was next." },
  { year: "2013", event: "Moved back to Connecticut", detail: "Home. The right call." },
  { year: "2015", event: "Coaching full-time at a local club", detail: "Early mornings, long days, zero regrets." },
  { year: "2018", event: "USPTA certified", detail: "Made it official." },
  { year: "2019", event: "Visited Vietnam", detail: "Hanoi, Hoi An, Ho Chi Minh City. Changed how I think about a lot of things." },
  { year: "2019", event: "Coached my first competitive junior", detail: "She made the state finals in U16. Still one of my proudest moments." },
  { year: "2020", event: "Went out on my own", detail: "Left the club and built something from scratch. Scary. Right." },
  { year: "2022", event: "100th student", detail: "Realized I had something worth continuing." },
  { year: "2023", event: "Visited Japan", detail: "Tokyo, Kyoto, Osaka. Already planning to go back." },
  { year: "2023", event: "Built a weekly training group", detail: "A handful of regulars who show up every week. The most satisfying coaching I do." },
  { year: "Now",  event: "Still here, still learning", detail: "The work doesn't stop. Neither does the curiosity." },
];

export function ScrollTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const items = container.querySelectorAll<HTMLElement>(".timeline-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((item) => observer.observe(item));

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (rect.height + viewH)));
      line.style.transform = `scaleY(${progress})`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative pl-4">
      <div className="absolute left-[72px] top-2 bottom-2 w-px bg-border/50" />
      <div ref={lineRef} className="absolute left-[72px] top-2 bottom-2 w-px bg-primary origin-top" style={{ transform: "scaleY(0)" }} />
      <div className="space-y-10">
        {timeline.map((item, i) => (
          <div key={i} className="timeline-item flex items-start gap-0" style={{ transitionDelay: `${i * 60}ms` }}>
            <span className="w-[72px] shrink-0 font-mono text-[11px] text-muted-foreground pt-0.5 text-right pr-0">
              {item.year}
            </span>
            <div className="relative mx-5 mt-1">
              <div className="w-2 h-2 rounded-full border border-primary bg-background" />
            </div>
            <div className="flex-1 pb-2">
              <p className="text-sm font-medium text-foreground leading-snug">{item.event}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
