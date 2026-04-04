"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const COUNT    = 10;
const GRAVITY  = 0.35;
const BOUNCE   = 0.82;
const FRICTION = 0.999;
const R        = 22;
const BALL_DELAY = 950; // ms — balls drop after text animates in

interface Ball {
  x: number; y: number;
  vx: number; vy: number;
  angle: number;
}

function drawTennisBall(ctx: CanvasRenderingContext2D, b: Ball) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.fillStyle = "#c8e03c";
  ctx.fill();
  ctx.restore();
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const ballsRef  = useRef<Ball[]>([]);
  const wRef      = useRef(0);
  const hRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w   = canvas.offsetWidth;
      const h   = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wRef.current = w;
      hRef.current = h;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Balls drop after text has animated in
    const spawnTimer = setTimeout(() => {
      ballsRef.current = Array.from({ length: COUNT }, (_, i) => ({
        x:     R + Math.random() * (wRef.current - R * 2),
        y:    -R - i * 90,
        vx:   (Math.random() - 0.5) * 3,
        vy:    0,
        angle: Math.random() * Math.PI * 2,
      }));
    }, BALL_DELAY);

    const tick = () => {
      const w = wRef.current;
      const h = hRef.current;
      ctx.clearRect(0, 0, w, h);

      for (const b of ballsRef.current) {
        b.vy    += GRAVITY;
        b.vx    *= FRICTION;
        b.x     += b.vx;
        b.y     += b.vy;
        b.angle += b.vx * 0.03;

        if (b.y + R >= h) { b.y = h - R; b.vy = -Math.abs(b.vy) * BOUNCE; }
        if (b.x - R < 0)  { b.x = R;     b.vx =  Math.abs(b.vx) * 0.85; }
        if (b.x + R > w)  { b.x = w - R; b.vx = -Math.abs(b.vx) * 0.85; }

        drawTennisBall(ctx, b);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      clearTimeout(spawnTimer);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Don't spawn a ball when clicking a link
    if ((e.target as HTMLElement).closest("a")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(R, Math.min(wRef.current - R, e.clientX - rect.left));
    ballsRef.current.push({
      x,
      y: -R,
      vx: (Math.random() - 0.5) * 4,
      vy: 0,
      angle: Math.random() * Math.PI * 2,
    });
  };

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden cursor-crosshair"
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="w-full max-w-[64rem] mx-auto px-8 md:px-16">
      <div className="relative z-10 pointer-events-none select-none">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-10 hero-item"
           style={{ animationDelay: "0ms" }}>
          Tennis Coach · Connecticut
        </p>
        <h1 className="font-display font-light leading-[0.9] mb-10">
          <span className="block text-[clamp(2.8rem,7vw,7rem)] text-foreground hero-item"
                style={{ animationDelay: "130ms" }}>Hey, I&apos;m</span>
          <span className="block text-[clamp(2.8rem,7vw,7rem)] italic text-primary hero-item"
                style={{ animationDelay: "260ms" }}>Thien.</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm md:max-w-md mb-12 hero-item"
           style={{ animationDelay: "400ms" }}>
          Welcome. I&apos;m a tennis coach based in Connecticut.
          This is where I share what I&apos;m playing, reading, watching,
          and thinking about — on and off the court.
        </p>
        <div className="flex items-center gap-5 hero-item pointer-events-auto select-auto"
             style={{ animationDelay: "540ms" }}>
          <Link href="/booking"
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Book a session
          </Link>
          <Link href="/pricing"
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border">
            View pricing →
          </Link>
        </div>
      </div>
      </div>

      <style suppressHydrationWarning>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-item {
          opacity: 0;
          animation: heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}
