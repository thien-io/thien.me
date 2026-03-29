"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // 0 = no parallax, 0.3 = gentle, 0.6 = strong
  className?: string;
}

export function ParallaxSection({ children, speed = 0.25, className = "" }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // How far the section center is from viewport center
      const relY = rect.top + rect.height / 2 - viewH / 2;
      el.style.transform = `translateY(${relY * speed}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
