"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const COUNT    = 10;
const GRAVITY  = 0.35;
const BOUNCE   = 0.82;
const FRICTION = 0.999;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}

const R = 22;

function drawTennisBall(ctx: CanvasRenderingContext2D, b: Ball) {
  ctx.save();
  ctx.translate(b.x, b.y);

  // Felt body
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
      wRef.current = canvas.width  = canvas.offsetWidth;
      hRef.current = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    ballsRef.current = Array.from({ length: COUNT }, (_, i) => ({
      x:     R + Math.random() * (wRef.current - R * 2),
      y:    -R - i * 90,
      vx:   (Math.random() - 0.5) * 3,
      vy:    0,
      angle: Math.random() * Math.PI * 2,
    }));

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

        if (b.y + R >= h) {
          b.y  = h - R;
          b.vy = -Math.abs(b.vy) * BOUNCE;
        }
        if (b.x - R < 0)  { b.x = R;     b.vx =  Math.abs(b.vx) * 0.85; }
        if (b.x + R > w)  { b.x = w - R; b.vx = -Math.abs(b.vx) * 0.85; }

        drawTennisBall(ctx, b);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end pb-20 px-8 md:px-16 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb absolute rounded-full opacity-[0.13] dark:opacity-[0.08]"
          style={{ width:"600px", height:"600px", top:"-120px", right:"-100px",
            background:"radial-gradient(circle, hsl(32 80% 60%) 0%, transparent 70%)",
            filter:"blur(70px)" }} />
        <div className="orb-2 absolute rounded-full opacity-[0.09] dark:opacity-[0.06]"
          style={{ width:"500px", height:"500px", bottom:"-60px", left:"-80px",
            background:"radial-gradient(circle, hsl(18 60% 50%) 0%, transparent 70%)",
            filter:"blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-2xl">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-10">
          Tennis Coach · Connecticut
        </p>
        <h1 className="font-display font-light leading-[0.9] mb-10">
          <span className="block text-[clamp(3.5rem,8vw,7rem)] text-foreground">Hey, I'm</span>
          <span className="block text-[clamp(3.5rem,8vw,7rem)] italic text-primary">Thien.</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
          Welcome. I'm a tennis coach based in Connecticut.
          This is where I share what I'm playing, reading, watching,
          and thinking about — on and off the court.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/coaching"
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Hit with me
          </Link>
          <Link href="/guestbook"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">
            Say hello →
          </Link>
        </div>
      </div>
    </section>
  );
}
