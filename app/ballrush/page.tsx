"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LBEntry { id: string; name: string; score: number; created_at: string; }
type GS = "menu" | "playing" | "dead";
type ObType = "net" | "cone" | "hoop" | "lowbar";

interface Ob {
  type: ObType;
  x: number;
  passed: boolean;
  h?: number;       // net height
  cy?: number;      // hoop center y
  ir?: number;      // hoop inner radius
  or?: number;      // hoop outer radius
}

interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; r: number; color: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BR = 16;         // ball radius
const G_ACC = 0.52;    // gravity acceleration
const JUMP_V = -13.5;  // jump velocity (negative = up)
const BASE_SPD = 4;    // initial scroll speed

// ─── Module-level draw helpers ────────────────────────────────────────────────

function drawTennisBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.05, 0, 0, r);
  g.addColorStop(0, "#ecf53a");
  g.addColorStop(0.65, "#cdd01a");
  g.addColorStop(1, "#a0a800");
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, r * 0.62, Math.PI + 0.2, Math.PI * 2 - 0.2); ctx.stroke();
  ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.3, r * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fill();
  ctx.restore();
}

function drawNetObstacle(ctx: CanvasRenderingContext2D, x: number, h: number, groundY: number, isDark: boolean) {
  const top = groundY - h;
  ctx.fillStyle = isDark ? "#999" : "#666";
  ctx.fillRect(x - 6, top - 2, 5, h + 2);
  ctx.fillRect(x + 3, top - 2, 5, h + 2);
  // Net mesh
  ctx.strokeStyle = isDark ? "rgba(220,220,220,0.3)" : "rgba(40,40,40,0.25)";
  ctx.lineWidth = 0.6;
  const cols = 4, rows = 5;
  for (let r = 0; r <= rows; r++) {
    const ny = top + (h / rows) * r;
    ctx.beginPath(); ctx.moveTo(x - 6, ny); ctx.lineTo(x + 8, ny); ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    const nx = x - 6 + (14 / cols) * c;
    ctx.beginPath(); ctx.moveTo(nx, top); ctx.lineTo(nx, groundY); ctx.stroke();
  }
  // White top band
  ctx.fillStyle = "#fff";
  ctx.fillRect(x - 7, top - 2, 16, 4);
}

function drawConeObstacle(ctx: CanvasRenderingContext2D, x: number, groundY: number) {
  const h = 45, bw = 32;
  ctx.beginPath();
  ctx.moveTo(x, groundY - h);
  ctx.lineTo(x - bw / 2, groundY);
  ctx.lineTo(x + bw / 2, groundY);
  ctx.closePath();
  ctx.fillStyle = "#f07520"; ctx.fill();
  // Stripe
  const sy = groundY - h * 0.48, sh = h * 0.18;
  const lw = bw * 0.38;
  ctx.beginPath();
  ctx.moveTo(x - lw / 2, sy); ctx.lineTo(x + lw / 2, sy);
  ctx.lineTo(x + lw * 0.78, sy + sh); ctx.lineTo(x - lw * 0.78, sy + sh);
  ctx.closePath(); ctx.fillStyle = "#fff"; ctx.fill();
  // Base
  ctx.fillStyle = "#c06010";
  ctx.fillRect(x - bw / 2 - 2, groundY - 5, bw + 4, 5);
}

function drawHoopObstacle(ctx: CanvasRenderingContext2D, x: number, cy: number, ir: number, or_: number, groundY: number) {
  // Stand
  ctx.fillStyle = "#888";
  ctx.fillRect(x - 2, cy + or_, 4, groundY - cy - or_);
  // Ring as thick stroke circle
  const ringW = or_ - ir;
  ctx.beginPath();
  ctx.arc(x, cy, ir + ringW / 2, 0, Math.PI * 2);
  ctx.strokeStyle = "#f0c030";
  ctx.lineWidth = ringW;
  ctx.stroke();
  // Rim highlight
  ctx.beginPath(); ctx.arc(x, cy, ir + ringW / 2, -0.5, 0.5);
  ctx.strokeStyle = "#ffd870"; ctx.lineWidth = 2; ctx.stroke();
}

function drawLowBar(ctx: CanvasRenderingContext2D, x: number, groundY: number, isDark: boolean) {
  const h = 28, w = 70;
  ctx.fillStyle = isDark ? "#6a9f4a" : "#5a9030";
  ctx.beginPath();
  ctx.roundRect(x - w / 2, groundY - h, w, h, 3);
  ctx.fill();
  // Top stripe
  ctx.fillStyle = isDark ? "#88c060" : "#70b040";
  ctx.fillRect(x - w / 2, groundY - h, w, 5);
  // Posts on sides
  ctx.fillStyle = isDark ? "#888" : "#666";
  ctx.fillRect(x - w / 2 - 4, groundY - h - 10, 5, h + 10);
  ctx.fillRect(x + w / 2 - 1, groundY - h - 10, 5, h + 10);
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, groundY: number, bgOff: number, isDark: boolean) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  if (isDark) {
    sky.addColorStop(0, "#0d1a28"); sky.addColorStop(1, "#1a3040");
  } else {
    sky.addColorStop(0, "#85c8eb"); sky.addColorStop(1, "#c8e8f8");
  }
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, groundY);

  // Faint vertical court lines (scrolling)
  const lineOff = bgOff % 90;
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1;
  for (let lx = -lineOff; lx < w + 90; lx += 90) {
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, groundY); ctx.stroke();
  }
  // Baseline
  ctx.beginPath(); ctx.moveTo(0, groundY * 0.62); ctx.lineTo(w, groundY * 0.62);
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)";
  ctx.stroke();

  // Ground / grass strip
  const grd = ctx.createLinearGradient(0, groundY, 0, h);
  if (isDark) {
    grd.addColorStop(0, "#2a4818"); grd.addColorStop(1, "#1a3010");
  } else {
    grd.addColorStop(0, "#58a82c"); grd.addColorStop(1, "#3c7818");
  }
  ctx.fillStyle = grd; ctx.fillRect(0, groundY, w, h - groundY);

  // Scrolling grass blades
  const gOff = bgOff % 24;
  ctx.strokeStyle = isDark ? "#3a5a22" : "#488820";
  ctx.lineWidth = 1;
  for (let gx = -gOff - 12; gx < w + 24; gx += 12) {
    ctx.beginPath(); ctx.moveTo(gx, groundY); ctx.lineTo(gx - 3, groundY - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx + 6, groundY); ctx.lineTo(gx + 9, groundY - 6); ctx.stroke();
  }

  // Ground shadow line
  ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY);
  ctx.strokeStyle = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1.5; ctx.stroke();
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BallRushPage() {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const gsRef  = useRef<GS>("menu");

  // Game state (all in refs for perf)
  const byRef    = useRef(0);   // ball y
  const bvyRef   = useRef(0);   // ball vertical velocity
  const bjRef    = useRef(2);   // jumps remaining
  const brotRef  = useRef(0);   // ball rotation
  const obsRef   = useRef<Ob[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const spdRef   = useRef(BASE_SPD);
  const gyRef    = useRef(0);   // ground y
  const cwRef    = useRef(600);
  const chRef    = useRef(300);
  const bgOff    = useRef(0);
  const nextObRef= useRef(80);
  const partsRef = useRef<Particle[]>([]);

  // UI state
  const [ui, setUi]         = useState<GS>("menu");
  const [uiScore, setUiScore] = useState(0);
  const [lb, setLb]         = useState<LBEntry[]>([]);
  const [pname, setPname]   = useState("");
  const [submitting, setSub] = useState(false);
  const [submitted, setSubed]= useState(false);
  const [lbLoad, setLbLoad] = useState(false);

  const setGs = (s: GS) => { gsRef.current = s; setUi(s); };

  const BALL_X = () => Math.round(cwRef.current * 0.18);

  // ── Collision ────────────────────────────────────────────────────────────────
  const hitTest = (ob: Ob): boolean => {
    const bx = BALL_X(), bY = byRef.current, GY = gyRef.current, r = BR;
    switch (ob.type) {
      case "net": {
        const h = ob.h ?? 80;
        const top = GY - h;
        const cx = Math.max(ob.x - 6, Math.min(bx, ob.x + 8));
        const cy = Math.max(top, Math.min(bY, GY));
        return Math.hypot(bx - cx, bY - cy) < r;
      }
      case "cone": {
        const h = 45, hw = 16;
        if (bx < ob.x - hw - r || bx > ob.x + hw + r || bY < GY - h - r || bY > GY) return false;
        const frac = Math.max(0, Math.min(1, (bY - (GY - h)) / h));
        return Math.abs(bx - ob.x) < hw * frac + r * 0.8;
      }
      case "hoop": {
        if (ob.cy === undefined) return false;
        const d = Math.hypot(bx - ob.x, bY - ob.cy);
        const ir = ob.ir ?? 28, or = ob.or ?? 44;
        return d >= ir - r && d <= or + r;
      }
      case "lowbar": {
        const h = 28, hw = 35;
        const cx = Math.max(ob.x - hw, Math.min(bx, ob.x + hw));
        const cy = Math.max(GY - h, Math.min(bY, GY));
        return Math.hypot(bx - cx, bY - cy) < r;
      }
    }
  };

  // ── Spawn obstacle ────────────────────────────────────────────────────────────
  const spawnOb = useCallback(() => {
    const sc = scoreRef.current;
    const pool: ObType[] = sc < 80
      ? ["net", "cone", "net", "cone", "lowbar"]
      : sc < 200
      ? ["net", "cone", "hoop", "lowbar", "net"]
      : ["net", "cone", "hoop", "hoop", "lowbar", "net", "cone"];

    const type = pool[Math.floor(Math.random() * pool.length)];
    const ob: Ob = { type, x: cwRef.current + 80, passed: false };

    if (type === "net") ob.h = 62 + Math.random() * 38;
    if (type === "hoop") { ob.cy = gyRef.current - 80; ob.ir = 28; ob.or = 44; }

    obsRef.current.push(ob);
    const gap = Math.max(55, 110 - sc * 0.08) + Math.random() * 60;
    nextObRef.current = frameRef.current + gap;
  }, []);

  // ── Spawn death particles ─────────────────────────────────────────────────────
  const spawnParticles = () => {
    const bx = BALL_X(), bY = byRef.current;
    const colors = ["#ecf53a", "#f0c030", "#fff", "#cdd01a", "#f5a000"];
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.5;
      const spd = 2 + Math.random() * 5;
      partsRef.current.push({
        x: bx, y: bY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 2,
        life: 1,
        r: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  // ── Main loop ─────────────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    if (gsRef.current !== "playing") return;
    const ctx = cvsRef.current?.getContext("2d");
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains("dark");
    const W = cwRef.current, H = chRef.current, GY = gyRef.current;
    const bx = BALL_X();

    bgOff.current += spdRef.current * 0.5;

    // Physics
    bvyRef.current += G_ACC;
    byRef.current  += bvyRef.current;
    if (byRef.current + BR >= GY) {
      byRef.current  = GY - BR;
      bvyRef.current = 0;
      bjRef.current  = 2;
    }
    brotRef.current += spdRef.current * 0.07;

    // Move obstacles
    for (const ob of obsRef.current) {
      ob.x -= spdRef.current;
      if (!ob.passed && ob.x + 60 < bx) {
        ob.passed = true;
        scoreRef.current += 10;
        setUiScore(scoreRef.current);
      }
    }
    obsRef.current = obsRef.current.filter(o => o.x > -120);

    // Spawn
    if (frameRef.current >= nextObRef.current) spawnOb();

    // Time score
    if (frameRef.current % 5 === 0) {
      scoreRef.current += 1;
      setUiScore(scoreRef.current);
    }

    // Speed ramp
    spdRef.current = BASE_SPD + Math.floor(frameRef.current / 250) * 0.4;
    frameRef.current++;

    // Collision
    for (const ob of obsRef.current) {
      if (Math.abs(ob.x - bx) < 80 && hitTest(ob)) {
        spawnParticles();
        setGs("dead");
        // Draw one last frame with particles
        drawBackground(ctx, W, H, GY, bgOff.current, isDark);
        for (const o of obsRef.current) drawOb(ctx, o, GY, isDark);
        drawTennisBall(ctx, bx, byRef.current, BR, brotRef.current);
        return;
      }
    }

    // Update particles
    partsRef.current = partsRef.current
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.18, life: p.life - 0.035 }))
      .filter(p => p.life > 0);

    // Draw
    ctx.clearRect(0, 0, W, H);
    drawBackground(ctx, W, H, GY, bgOff.current, isDark);
    for (const ob of obsRef.current) {
      if (ob.x > -120 && ob.x < W + 80) drawOb(ctx, ob, GY, isDark);
    }
    drawTennisBall(ctx, bx, byRef.current, BR, brotRef.current);

    // Particles
    for (const p of partsRef.current) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Jump indicator dots (show remaining jumps)
    for (let j = 0; j < bjRef.current; j++) {
      ctx.beginPath(); ctx.arc(bx - 8 + j * 10, byRef.current + BR + 6, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ecf53a"; ctx.fill();
    }

    rafRef.current = requestAnimationFrame(loop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spawnOb]);

  function drawOb(ctx: CanvasRenderingContext2D, ob: Ob, GY: number, isDark: boolean) {
    switch (ob.type) {
      case "net":    drawNetObstacle(ctx, ob.x, ob.h ?? 80, GY, isDark); break;
      case "cone":   drawConeObstacle(ctx, ob.x, GY); break;
      case "hoop":   drawHoopObstacle(ctx, ob.x, ob.cy ?? GY - 80, ob.ir ?? 28, ob.or ?? 44, GY); break;
      case "lowbar": drawLowBar(ctx, ob.x, GY, isDark); break;
    }
  }

  // ── Start game ────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    obsRef.current  = [];
    scoreRef.current = 0;
    frameRef.current = 0;
    spdRef.current  = BASE_SPD;
    bgOff.current   = 0;
    bjRef.current   = 2;
    brotRef.current = 0;
    byRef.current   = gyRef.current - BR;
    bvyRef.current  = 0;
    partsRef.current= [];
    nextObRef.current = 80;
    setUiScore(0);
    setSubed(false);
    setPname("");
    setGs("playing");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // ── Jump ──────────────────────────────────────────────────────────────────────
  const jump = useCallback(() => {
    if (gsRef.current !== "playing") return;
    if (bjRef.current > 0) {
      bvyRef.current = JUMP_V;
      bjRef.current--;
    }
  }, []);

  // ── Keyboard controls ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
        if (gsRef.current === "playing") { jump(); e.preventDefault(); }
      }
      if (e.key === "Enter" && gsRef.current === "menu") startGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, startGame]);

  // ── Touch controls ────────────────────────────────────────────────────────────
  useEffect(() => {
    const c = cvsRef.current;
    if (!c) return;
    const onTouch = (e: TouchEvent) => { if (gsRef.current === "playing") { jump(); e.preventDefault(); } };
    c.addEventListener("touchstart", onTouch, { passive: false });
    return () => c.removeEventListener("touchstart", onTouch);
  }, [jump]);

  // ── Canvas resize ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const c = cvsRef.current;
      if (!c) return;
      const parent = c.parentElement;
      if (!parent) return;
      const w = Math.min(parent.clientWidth, 800);
      const h = Math.round(w * 0.5);
      c.width = w; c.height = h;
      cwRef.current = w; chRef.current = h;
      gyRef.current = h - 55;
      if (gsRef.current !== "playing") byRef.current = gyRef.current - BR;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Draw static frames ────────────────────────────────────────────────────────
  useEffect(() => {
    if (ui !== "menu" && ui !== "dead") return;
    const c = cvsRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const isDark = document.documentElement.classList.contains("dark");
    const W = cwRef.current, H = chRef.current, GY = gyRef.current;
    ctx.clearRect(0, 0, W, H);
    drawBackground(ctx, W, H, GY, bgOff.current, isDark);
    for (const ob of obsRef.current) {
      if (ob.x > -120 && ob.x < W + 80) {
        switch (ob.type) {
          case "net":    drawNetObstacle(ctx, ob.x, ob.h ?? 80, GY, isDark); break;
          case "cone":   drawConeObstacle(ctx, ob.x, GY); break;
          case "hoop":   drawHoopObstacle(ctx, ob.x, ob.cy ?? GY - 80, ob.ir ?? 28, ob.or ?? 44, GY); break;
          case "lowbar": drawLowBar(ctx, ob.x, GY, isDark); break;
        }
      }
    }
    drawTennisBall(ctx, BALL_X(), byRef.current, BR, brotRef.current);
    for (const p of partsRef.current) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [ui]);

  // ── Cleanup ───────────────────────────────────────────────────────────────────
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // ── Leaderboard ───────────────────────────────────────────────────────────────
  const fetchLb = useCallback(async () => {
    setLbLoad(true);
    try {
      const r = await fetch("/api/ballrush-leaderboard");
      const d = await r.json();
      setLb(d.entries ?? []);
    } catch { setLb([]); } finally { setLbLoad(false); }
  }, []);

  useEffect(() => { fetchLb(); }, [fetchLb]);

  const submitScore = useCallback(async () => {
    if (!pname.trim() || submitting || scoreRef.current <= 0) return;
    setSub(true);
    try {
      await fetch("/api/ballrush-leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pname.trim(), score: scoreRef.current }),
      });
      setSubed(true);
      await fetchLb();
    } catch { /* silent */ } finally { setSub(false); }
  }, [pname, submitting, fetchLb]);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      <section className="relative px-8 md:px-16 pt-6 pb-3 md:pt-32 overflow-hidden">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Game</p>
        <h1 className="font-display text-4xl font-light">Ball Rush</h1>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 px-3 md:px-8 pb-6 md:pb-16 items-start justify-center">

        {/* Canvas + controls */}
        <div className="flex-1 min-w-0 flex flex-col items-center">
          {ui === "playing" && (
            <div className="w-full flex items-center justify-between px-1 mb-2">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Score</span>
              <span className="font-mono text-sm font-medium tabular-nums">{uiScore}</span>
            </div>
          )}

          <div className="relative w-full">
            <canvas
              ref={cvsRef}
              className="w-full rounded-xl border border-border touch-none select-none cursor-pointer"
              onClick={() => { if (gsRef.current === "playing") jump(); }}
            />

            {/* Menu overlay */}
            {ui === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-xl bg-background/75 backdrop-blur-sm">
                <div className="text-center">
                  <p className="font-display text-5xl font-light text-primary italic">Ball Rush</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-2">jump over everything, keep rolling</p>
                </div>
                <div className="text-center space-y-1.5 px-6">
                  <p className="font-mono text-[10px] text-muted-foreground">Space / Click / Tap to jump</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Double jump available mid-air</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Dodge nets, cones &amp; hoops — pass through hoop centers</p>
                </div>
                <button onClick={startGame}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:opacity-90 transition-opacity">
                  Play
                </button>
              </div>
            )}

            {/* Dead overlay */}
            {ui === "dead" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/85 backdrop-blur-sm px-6">
                <p className="font-display text-3xl font-light text-foreground">Wiped Out</p>
                <div className="text-center">
                  <p className="font-display text-4xl text-primary">{uiScore}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">pts</p>
                </div>
                {!submitted ? (
                  <div className="w-full space-y-2">
                    <input
                      type="text" placeholder="Your name" maxLength={30} value={pname}
                      onChange={e => setPname(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && submitScore()}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center font-mono"
                    />
                    <button onClick={submitScore} disabled={submitting || !pname.trim()}
                      className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity">
                      {submitting ? "Saving..." : "Save score"}
                    </button>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-primary">✓ Score saved!</p>
                )}
                <button onClick={startGame}
                  className="w-full py-2 rounded-xl border border-border font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                  Play again
                </button>
              </div>
            )}
          </div>

          {/* Mobile jump button */}
          <button
            onPointerDown={jump}
            className="mt-4 w-full max-w-sm h-14 rounded-xl border border-border bg-card text-muted-foreground active:bg-primary/15 active:text-primary active:scale-95 transition-all touch-manipulation font-mono text-xs uppercase tracking-wider select-none"
          >
            Jump
          </button>
        </div>

        {/* Leaderboard */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="border border-border rounded-xl bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Leaderboard</p>
              <button onClick={fetchLb}
                className="font-mono text-[9px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                refresh
              </button>
            </div>
            {lbLoad ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : lb.length === 0 ? (
              <p className="font-mono text-[10px] text-muted-foreground/50 text-center py-4">
                No scores yet.<br />Be the first!
              </p>
            ) : (
              <div className="space-y-1.5">
                {lb.map((e, i) => (
                  <div key={e.id} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${i === 0 ? "bg-primary/10" : ""}`}>
                    <span className={`font-mono text-[10px] w-4 text-right shrink-0 ${i === 0 ? "text-primary font-bold" : "text-muted-foreground/40"}`}>
                      {i + 1}
                    </span>
                    <span className={`text-xs font-medium flex-1 truncate ${i === 0 ? "text-primary" : "text-foreground"}`}>
                      {e.name}
                    </span>
                    <span className={`font-mono text-[11px] tabular-nums shrink-0 ${i === 0 ? "text-primary font-bold" : "text-foreground"}`}>
                      {e.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
