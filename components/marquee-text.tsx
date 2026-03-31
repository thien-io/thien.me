"use client";

import { useEffect, useRef, useState } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
}

export function MarqueeText({ text, className = "" }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLSpanElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const textEl    = textRef.current;
    if (!container || !textEl) return;
    const overflow = textEl.scrollWidth - container.clientWidth;
    setDist(overflow > 2 ? overflow : 0);
  }, [text]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap ${dist > 0 ? "marquee-running" : ""} ${className}`}
        style={dist > 0 ? ({ "--marquee-dist": `-${dist}px` } as React.CSSProperties) : {}}
      >
        {text}
      </span>
    </div>
  );
}
