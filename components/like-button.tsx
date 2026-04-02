"use client";

import { useState, useEffect, useRef } from "react";

interface FloatingHeart {
  id: number;
  x: number;
  scale: number;
  duration: number;
  delay: number;
}

export function LikeButton() {
  const [count,  setCount]  = useState<number | null>(null);
  const [burst,  setBurst]  = useState(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const pidRef    = useRef(0);
  const burstRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/likes").then(r => r.json()).then(d => setCount(d.count));
  }, []);

  async function handleClick() {
    setCount(c => (c ?? 0) + 1);

    // Button pop
    if (burstRef.current) clearTimeout(burstRef.current);
    setBurst(true);
    burstRef.current = setTimeout(() => setBurst(false), 200);

    // Spawn a floating heart
    const id = ++pidRef.current;
    const heart: FloatingHeart = {
      id,
      x: Math.random() * 32 - 16,       // random horizontal drift ±16px
      scale: 0.7 + Math.random() * 0.6,  // random size
      duration: 800 + Math.random() * 400,
      delay: Math.random() * 80,
    };
    setHearts(h => [...h, heart]);
    setTimeout(() => setHearts(h => h.filter(x => x.id !== id)), 1400);

    // Fire and forget to DB
    fetch("/api/likes", { method: "POST" }).catch(() => {/* silent */});
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={handleClick}
        aria-label="Like this site"
        className="relative flex items-center justify-center w-6 h-6 transition-all select-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Floating hearts */}
        {hearts.map(h => (
          <span
            key={h.id}
            className="absolute pointer-events-none"
            style={{
              bottom: "50%",
              left: "50%",
              transform: "translate(-50%, 50%)",
              animation: `float-heart ${h.duration}ms ease-out ${h.delay}ms forwards`,
              ["--drift" as string]: `${h.x}px`,
              ["--scale" as string]: h.scale,
              fontSize: `${h.scale * 14}px`,
              lineHeight: 1,
              zIndex: 50,
            }}
          >
            ❤️
          </span>
        ))}

        {/* Heart icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 relative z-10"
          style={{
            transform: burst ? "scale(1.5)" : "scale(1)",
            transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#f87171"
            stroke="none"
          />
        </svg>
      </button>

      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
        {count === null ? "—" : count.toLocaleString()}
      </span>

      <style>{`
        @keyframes float-heart {
          0%   { transform: translate(calc(-50% + var(--drift) * 0), 50%) scale(var(--scale)); opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--drift)), calc(50% - 64px)) scale(calc(var(--scale) * 0.5)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
