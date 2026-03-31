"use client";

import { useEffect, useRef } from "react";

const timeline = [
  { year: "1998", event: "Born in Connecticut", detail: "Grew up here. Still here. Make of that what you will." },
  { year: "2006", event: "First tennis lesson at age 8", detail: "My dad signed me up. Weekend lessons turned into something I couldn't put down." },
  { year: "2009", event: "Joined the junior program at the local club", detail: "Started competing in local under-12 tournaments. Lost a lot. Learned a lot." },
  { year: "2012", event: "Competed in regional junior tournaments", detail: "Started traveling to tournaments across New England. Learned how to lose — and why that matters." },
  { year: "2014", event: "High school varsity team, #1 singles", detail: "Three years of competing for the school. Some of the best tennis I've played." },
  { year: "2016", event: "Began coaching part-time during college", detail: "Started helping at summer camps. Discovered I loved teaching even more than competing." },
  { year: "2017", event: "Traveled through Southeast Asia for a summer", detail: "First time really away from home. Played tennis in four countries. Came back different." },
  { year: "2018", event: "USPTA certified tennis coach", detail: "Made it official. Passed the exam on the first try." },
  { year: "2019", event: "Coached my first competitive junior", detail: "She made the state finals in U16. Still one of my proudest coaching moments." },
  { year: "2020", event: "Launched thien.me — full-time coaching", detail: "Left the club job and went on my own. Scary and right." },
  { year: "2021", event: "Started reading seriously again", detail: "Picked up Gallwey, Agassi, Epstein. Books changed how I coach." },
  { year: "2022", event: "100th student milestone", detail: "Realized I had something worth continuing. Doubled down." },
  { year: "2023", event: "Built out a small training group", detail: "A handful of dedicated students who meet weekly. The most satisfying coaching I do." },
  { year: "Now", event: "200+ students, still learning every day", detail: "The work never stops. Neither does the curiosity." },
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
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach((item) => observer.observe(item));

    // Scroll-driven line fill
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: 0 when container top hits bottom, 1 when container bottom hits top
      const progress = Math.min(1, Math.max(0,
        (viewH - rect.top) / (rect.height + viewH)
      ));
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
      {/* Track line */}
      <div className="absolute left-[72px] top-2 bottom-2 w-px bg-border/50" />
      {/* Animated fill line */}
      <div
        ref={lineRef}
        className="absolute left-[72px] top-2 bottom-2 w-px bg-primary origin-top"
        style={{ transform: "scaleY(0)" }}
      />

      <div className="space-y-10">
        {timeline.map((item, i) => (
          <div
            key={i}
            className="timeline-item flex items-start gap-0"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {/* Year */}
            <span className="w-[72px] shrink-0 font-mono text-[11px] text-muted-foreground pt-0.5 text-right pr-0">
              {item.year}
            </span>

            {/* Dot */}
            <div className="relative mx-5 mt-1">
              <div className="w-2 h-2 rounded-full border border-primary bg-background" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <p className="text-sm font-medium text-foreground leading-snug">
                {item.event}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
