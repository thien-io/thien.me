"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Brick {
  x: number; y: number; w: number; h: number;
  hp: number; maxHp: number; color: string;
  alive: boolean; points: number;
}

interface Ball {
  x: number; y: number;
  vx: number; vy: number;
  r: number; trail: { x: number; y: number }[];
}

interface Paddle {
  x: number; y: number; w: number; h: number;
}

interface PowerUp {
  x: number; y: number; vy: number;
  type: "wide" | "multi" | "slow" | "laser";
  r: number; alive: boolean;
}

interface LeaderboardEntry {
  id: string; name: string; score: number; level: number; created_at: string;
}

type GameState = "menu" | "playing" | "paused" | "dead" | "levelup" | "submit";

// ─── Constants ────────────────────────────────────────────────────────────────

const PADDLE_H = 10;
const BALL_SPEED_BASE = 5;
const TRAIL_LEN = 8;
const POWERUP_CHANCE = 0.18;

// ─── Level Generator ──────────────────────────────────────────────────────────

function genLevel(level: number, cw: number): Brick[] {
  const cols = 7;
  const rows = Math.min(4 + Math.floor(level / 2), 12);
  const gap = 4;
  const bw = (cw - gap * (cols + 1)) / cols;
  const bh = 18;
  const bricks: Brick[] = [];

  const palette = [
    ["#c8e03c", "#a8be2c"],  // yellow-green
    ["#4a9f6f", "#357a54"],  // green
    ["#6b9fc4", "#4a7fa8"],  // blue
    ["#c46b5a", "#a84f3e"],  // red
    ["#8b7bb5", "#6b5b95"],  // purple
    ["#e8a838", "#c88818"],  // orange
    ["#c8e03c", "#e84040"],  // special
  ];

  for (let row = 0; row < rows; row++) {
    const rowHp = 1 + Math.floor((row / rows) * (1 + Math.floor(level / 3)));
    const colorPair = palette[row % palette.length];

    for (let col = 0; col < cols; col++) {
      // Higher levels: some bricks skipped for pattern
      if (level > 3 && Math.random() < 0.08 + (level * 0.005)) continue;

      const x = gap + col * (bw + gap);
      const y = 60 + gap + row * (bh + gap);

      // Boss bricks every 5 levels
      let hp = rowHp;
      let color = colorPair[0];
      let pts = 10 * (row + 1);

      if (level % 5 === 0 && row === 0) {
        hp = 3 + Math.floor(level / 5);
        color = "#e84040";
        pts = 100;
      }

      bricks.push({ x, y, w: bw, h: bh, hp, maxHp: hp, color, alive: true, points: pts });
    }
  }
  return bricks;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GamePage() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const stateRef    = useRef<GameState>("menu");
  const rafRef      = useRef<number>(0);
  const lastRef     = useRef<number>(0);

  // Game objects
  const ballsRef    = useRef<Ball[]>([]);
  const paddleRef   = useRef<Paddle>({ x: 0, y: 0, w: 80, h: PADDLE_H });
  const bricksRef   = useRef<Brick[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);

  // Game stats
  const scoreRef    = useRef(0);
  const levelRef    = useRef(1);
  const livesRef    = useRef(3);
  const wideTimer   = useRef(0);
  const slowTimer   = useRef(0);
  const touchXRef   = useRef<number | null>(null);

  // React state (for UI overlays only)
  const [uiState, setUiState]         = useState<GameState>("menu");
  const [uiScore, setUiScore]         = useState(0);
  const [uiLevel, setUiLevel]         = useState(1);
  const [uiLives, setUiLives]         = useState(3);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName]   = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [loadingLB, setLoadingLB]     = useState(false);

  const setState = (s: GameState) => {
    stateRef.current = s;
    setUiState(s);
  };

  // ── Canvas size ──────────────────────────────────────────────────────────────
  const getCW = () => canvasRef.current?.width ?? 320;
  const getCH = () => canvasRef.current?.height ?? 560;

  // ── Init level ───────────────────────────────────────────────────────────────
  const initLevel = useCallback((lvl: number) => {
    const cw = getCW(); const ch = getCH();
    const pw = Math.max(60, Math.min(100 - lvl * 2, 80));
    paddleRef.current = { x: cw / 2 - pw / 2, y: ch - 50, w: pw, h: PADDLE_H };
    wideTimer.current = 0; slowTimer.current = 0;

    const speed = BALL_SPEED_BASE + lvl * 0.22;
    ballsRef.current = [{
      x: cw / 2, y: ch - 70,
      vx: (Math.random() > 0.5 ? 1 : -1) * speed * 0.65,
      vy: -speed, r: 7, trail: [],
    }];

    bricksRef.current  = genLevel(lvl, cw);
    powerupsRef.current = [];
  }, []);

  // ── Start game ───────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    scoreRef.current = 0; levelRef.current = 1; livesRef.current = 3;
    setUiScore(0); setUiLevel(1); setUiLives(3);
    setSubmitted(false); setPlayerName("");
    initLevel(1);
    setState("playing");
  }, [initLevel]);

  // ── Fetch leaderboard ─────────────────────────────────────────────────────────
  const fetchLB = useCallback(async () => {
    setLoadingLB(true);
    try {
      const r = await fetch("/api/leaderboard");
      const d = await r.json();
      setLeaderboard(d.entries || []);
    } catch { setLeaderboard([]); }
    finally { setLoadingLB(false); }
  }, []);

  // ── Fetch on mount ────────────────────────────────────────────────────────────
  useEffect(() => { fetchLB(); }, [fetchLB]);

  // ── Submit score ──────────────────────────────────────────────────────────────
  const submitScore = useCallback(async () => {
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName.trim(), score: scoreRef.current, level: levelRef.current }),
      });
      setSubmitted(true);
      await fetchLB();
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  }, [playerName, submitting, fetchLB]);

  // ── Collision helper ──────────────────────────────────────────────────────────
  const ballBrickCollision = (ball: Ball, brick: Brick) => {
    if (!brick.alive) return false;
    const { x, y, w, h } = brick;
    if (ball.x + ball.r < x || ball.x - ball.r > x + w) return false;
    if (ball.y + ball.r < y || ball.y - ball.r > y + h) return false;

    const overlapX = Math.min(ball.x + ball.r - x, x + w - (ball.x - ball.r));
    const overlapY = Math.min(ball.y + ball.r - y, y + h - (ball.y - ball.r));

    if (overlapX < overlapY) ball.vx *= -1;
    else ball.vy *= -1;

    brick.hp--;
    if (brick.hp <= 0) {
      brick.alive = false;
      scoreRef.current += brick.points * levelRef.current;
      setUiScore(scoreRef.current);
      // Maybe drop power-up
      if (Math.random() < POWERUP_CHANCE) {
        const types: PowerUp["type"][] = ["wide", "multi", "slow", "laser"];
        const colors = { wide: "#c8e03c", multi: "#4a9f6f", slow: "#6b9fc4", laser: "#e84040" };
        const t = types[Math.floor(Math.random() * types.length)];
        powerupsRef.current.push({
          x: brick.x + brick.w / 2, y: brick.y + brick.h / 2,
          vy: 2.5, type: t, r: 9, alive: true,
        });
      }
    }
    return true;
  };

  // ── Main game loop ────────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    if (stateRef.current !== "playing") return;
    const dt = Math.min(ts - lastRef.current, 32);
    lastRef.current = ts;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width; const ch = canvas.height;
    const isDark = document.documentElement.classList.contains("dark");

    // ── Timers ──
    if (wideTimer.current > 0) wideTimer.current -= dt;
    else paddleRef.current.w = Math.max(60, paddleRef.current.w - 0.5);
    if (slowTimer.current > 0) slowTimer.current -= dt;

    const speedMul = slowTimer.current > 0 ? 0.55 : 1;

    // ── Move balls ──
    for (const ball of ballsRef.current) {
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > TRAIL_LEN) ball.trail.shift();

      ball.x += ball.vx * speedMul;
      ball.y += ball.vy * speedMul;

      // Walls
      if (ball.x - ball.r < 0)  { ball.x = ball.r;    ball.vx = Math.abs(ball.vx); }
      if (ball.x + ball.r > cw) { ball.x = cw - ball.r; ball.vx = -Math.abs(ball.vx); }
      if (ball.y - ball.r < 0)  { ball.y = ball.r;    ball.vy = Math.abs(ball.vy); }

      // Paddle
      const p = paddleRef.current;
      if (
        ball.vy > 0 &&
        ball.y + ball.r >= p.y && ball.y + ball.r <= p.y + p.h + 4 &&
        ball.x >= p.x - 4 && ball.x <= p.x + p.w + 4
      ) {
        ball.y = p.y - ball.r;
        // Angle based on hit position
        const hitPos = (ball.x - p.x) / p.w; // 0-1
        const angle  = (-160 + hitPos * 140) * (Math.PI / 180);
        const speed  = Math.hypot(ball.vx, ball.vy);
        ball.vx = speed * Math.cos(angle);
        ball.vy = speed * Math.sin(angle);
        // Keep minimum vertical
        if (Math.abs(ball.vy) < speed * 0.3) ball.vy = -speed * 0.3;
        ball.vy = -Math.abs(ball.vy);
      }

      // Bricks
      for (const brick of bricksRef.current) ballBrickCollision(ball, brick);
    }

    // ── Remove fallen balls ──
    const fallen = ballsRef.current.filter(b => b.y - b.r > ch);
    ballsRef.current  = ballsRef.current.filter(b => b.y - b.r <= ch);

    if (fallen.length > 0 && ballsRef.current.length === 0) {
      livesRef.current--;
      setUiLives(livesRef.current);
      if (livesRef.current <= 0) {
        setState("dead");
        fetchLB();
        return;
      }
      // Respawn
      const cw2 = getCW(); const ch2 = getCH();
      const speed = BALL_SPEED_BASE + levelRef.current * 0.22;
      ballsRef.current = [{
        x: cw2 / 2, y: ch2 - 70,
        vx: (Math.random() > 0.5 ? 1 : -1) * speed * 0.65,
        vy: -speed, r: 7, trail: [],
      }];
    }

    // ── Power-ups ──
    for (const pu of powerupsRef.current) {
      if (!pu.alive) continue;
      pu.y += pu.vy;
      if (pu.y > ch) { pu.alive = false; continue; }
      const p = paddleRef.current;
      if (pu.y + pu.r >= p.y && pu.x >= p.x && pu.x <= p.x + p.w) {
        pu.alive = false;
        switch (pu.type) {
          case "wide":
            paddleRef.current.w = Math.min(140, paddleRef.current.w + 30);
            wideTimer.current = 8000;
            break;
          case "multi": {
            const speed = BALL_SPEED_BASE + levelRef.current * 0.22;
            for (let i = 0; i < 2; i++) {
              const angle = (-120 + i * 60) * (Math.PI / 180);
              ballsRef.current.push({
                x: p.x + p.w / 2, y: p.y - 10,
                vx: speed * Math.cos(angle), vy: speed * Math.sin(angle),
                r: 7, trail: [],
              });
            }
            break;
          }
          case "slow":
            slowTimer.current = 6000;
            break;
          case "laser":
            scoreRef.current += 250 * levelRef.current;
            setUiScore(scoreRef.current);
            // Destroy top row
            const topY = Math.min(...bricksRef.current.filter(b => b.alive).map(b => b.y));
            bricksRef.current.filter(b => b.alive && b.y === topY).forEach(b => { b.alive = false; });
            break;
        }
      }
    }
    powerupsRef.current = powerupsRef.current.filter(p => p.alive);

    // ── Check level clear ──
    if (bricksRef.current.every(b => !b.alive)) {
      levelRef.current++;
      setUiLevel(levelRef.current);
      setState("levelup");
      setTimeout(() => {
        initLevel(levelRef.current);
        setState("playing");
        lastRef.current = performance.now();
        rafRef.current = requestAnimationFrame(loop);
      }, 1800);
      drawFrame(ctx, cw, ch, isDark, true);
      return;
    }

    drawFrame(ctx, cw, ch, isDark, false);
    rafRef.current = requestAnimationFrame(loop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initLevel, fetchLB]);

  // ── Draw ──────────────────────────────────────────────────────────────────────
  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    cw: number, ch: number,
    isDark: boolean,
    levelClear: boolean
  ) => {
    // Background
    ctx.fillStyle = isDark ? "#0e1015" : "#f5f0e8";
    ctx.fillRect(0, 0, cw, ch);

    // Bricks
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      const alpha = 0.5 + 0.5 * (b.hp / b.maxHp);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, b.h, 4);
      ctx.fill();

      if (b.maxHp > 1) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px DM Mono, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(b.hp), b.x + b.w / 2, b.y + b.h / 2);
      }
      ctx.globalAlpha = 1;
    }

    // Power-ups
    const puColors = { wide: "#c8e03c", multi: "#4a9f6f", slow: "#6b9fc4", laser: "#e84040" };
    const puLabels = { wide: "W", multi: "M", slow: "S", laser: "L" };
    for (const pu of powerupsRef.current) {
      if (!pu.alive) continue;
      ctx.fillStyle = puColors[pu.type];
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, pu.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px DM Mono, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(puLabels[pu.type], pu.x, pu.y);
    }

    // Balls + trails
    for (const ball of ballsRef.current) {
      for (let i = 0; i < ball.trail.length; i++) {
        const t = ball.trail[i];
        const a = (i / ball.trail.length) * 0.35;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#c8e03c";
        ctx.beginPath();
        ctx.arc(t.x, t.y, ball.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#c8e03c";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Paddle
    const p = paddleRef.current;
    const padColor = wideTimer.current > 0 ? "#c8e03c" : (isDark ? "#e8e0d0" : "#2a2420");
    ctx.fillStyle = padColor;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 5);
    ctx.fill();

    // Level clear overlay
    if (levelClear) {
      ctx.fillStyle = isDark ? "rgba(14,16,21,0.75)" : "rgba(245,240,232,0.75)";
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = "#c8e03c";
      ctx.font = `bold ${cw * 0.1}px Cormorant Garamond, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`Level ${levelRef.current - 1}`, cw / 2, ch / 2 - 20);
      ctx.fillStyle = isDark ? "#e8e0d0" : "#2a2420";
      ctx.font = `${cw * 0.055}px DM Mono, monospace`;
      ctx.fillText("CLEAR!", cw / 2, ch / 2 + 28);
    }
  };

  // ── Game loop start/stop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (uiState === "playing") {
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [uiState, loop]);

  // ── Canvas resize ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const w = Math.min(container.clientWidth, 400);
      const h = Math.min(Math.round(w * 1.75), Math.round(window.innerHeight * 0.62));
      canvas.width  = w;
      canvas.height = h;
      if (stateRef.current === "playing") initLevel(levelRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [initLevel]);

  // ── Mouse / touch controls ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      if (stateRef.current !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      const mx   = (e.clientX - rect.left) * (canvas.width / rect.width);
      const p    = paddleRef.current;
      p.x = Math.max(0, Math.min(canvas.width - p.w, mx - p.w / 2));
    };

    const onTouchStart = (e: TouchEvent) => {
      touchXRef.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (stateRef.current !== "playing") return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx   = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      const p    = paddleRef.current;
      p.x = Math.max(0, Math.min(canvas.width - p.w, mx - p.w / 2));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stateRef.current === "playing") setState("paused");
      else if (e.key === "Escape" && stateRef.current === "paused") setState("playing");
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // ── Render static canvas on menu/dead ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || (uiState !== "menu" && uiState !== "dead" && uiState !== "submit")) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width; const ch = canvas.height;
    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#0e1015" : "#f5f0e8";
    ctx.fillRect(0, 0, cw, ch);
    // Draw some decorative bricks
    const cols = 7; const gap = 4;
    const bw = (cw - gap * (cols + 1)) / cols;
    const colors = ["#c8e03c","#4a9f6f","#6b9fc4","#c46b5a","#8b7bb5","#e8a838","#c8e03c"];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.globalAlpha = 0.15 + row * 0.04;
        ctx.fillStyle = colors[(row + col) % colors.length];
        ctx.beginPath();
        ctx.roundRect(gap + col * (bw + gap), 40 + row * 22, bw, 16, 3);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, [uiState]);

  const puDesc = {
    wide:  "W — Wider paddle",
    multi: "M — +2 balls",
    slow:  "S — Slow motion",
    laser: "L — Destroy top row",
  };

  return (
    <div>
      <section className="relative px-6 md:px-16 pt-28 pb-3 md:pt-32 overflow-hidden">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Game</p>
        <h1 className="font-display text-4xl font-light">Brick Breaker</h1>
      </section>

      <div className="flex flex-col lg:flex-row gap-5 px-3 md:px-8 pb-6 md:pb-16 items-start justify-center">
        {/* Game canvas area */}
        <div className="flex-1 min-w-0 flex flex-col items-center">
          {/* HUD */}
          {(uiState === "playing" || uiState === "paused" || uiState === "levelup") && (
            <div className="w-full max-w-[400px] flex items-center justify-between px-1 mb-2">
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`text-base ${i < uiLives ? "text-primary" : "text-muted-foreground/20"}`}>●</span>
                ))}
              </div>
              <span className="font-mono text-xs text-muted-foreground">LVL {uiLevel}</span>
              <span className="font-mono text-sm font-medium text-foreground tabular-nums">{uiScore.toLocaleString()}</span>
            </div>
          )}

          {/* Canvas */}
          <div className="relative w-full max-w-[400px]">
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl border border-border touch-none select-none cursor-none"
            />

            {/* Menu overlay */}
            {uiState === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-xl bg-background/70 backdrop-blur-sm">
                <div className="text-center">
                  <p className="font-display text-5xl font-light text-foreground mb-1">Brick</p>
                  <p className="font-display text-5xl font-light text-primary italic">Breaker</p>
                </div>
                <div className="text-center space-y-1 px-8">
                  <p className="font-mono text-[10px] text-muted-foreground">Move paddle with mouse or touch</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Catch power-ups for bonuses</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Levels get harder — go as far as you can</p>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:opacity-90 transition-opacity"
                >
                  Play
                </button>
                <div className="text-center">
                  <p className="font-mono text-[9px] text-muted-foreground/50 mb-3">Power-ups</p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    {Object.entries(puDesc).map(([, v]) => (
                      <span key={v} className="font-mono text-[9px] text-muted-foreground/60">{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Paused overlay */}
            {uiState === "paused" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-xl bg-background/80 backdrop-blur-sm">
                <p className="font-display text-4xl font-light text-muted-foreground">Paused</p>
                <button
                  onClick={() => { setState("playing"); lastRef.current = performance.now(); }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                >
                  Resume
                </button>
                <button
                  onClick={() => setState("menu")}
                  className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Quit
                </button>
              </div>
            )}

            {/* Game over overlay */}
            {(uiState === "dead" || uiState === "submit") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/85 backdrop-blur-sm px-6">
                <p className="font-display text-4xl font-light text-foreground">Game Over</p>
                <div className="text-center">
                  <p className="font-display text-3xl text-primary">{uiScore.toLocaleString()}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">Level {uiLevel} · {uiScore.toLocaleString()} pts</p>
                </div>

                {!submitted ? (
                  <div className="w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      maxLength={30}
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && submitScore()}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center font-mono"
                    />
                    <button
                      onClick={submitScore}
                      disabled={submitting || !playerName.trim()}
                      className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
                    >
                      {submitting ? "Saving..." : "Save score"}
                    </button>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-primary">✓ Score saved!</p>
                )}

                <button
                  onClick={startGame}
                  className="w-full py-2 rounded-xl border border-border font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  Play again
                </button>
              </div>
            )}
          </div>

          {/* Pause button during play */}
          {uiState === "playing" && (
            <button
              onClick={() => setState("paused")}
              className="mt-3 font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              tap to pause
            </button>
          )}
        </div>

        {/* Leaderboard */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="border border-border rounded-xl bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Leaderboard</p>
              <button onClick={fetchLB} className="font-mono text-[9px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                refresh
              </button>
            </div>

            {loadingLB ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <p className="font-mono text-[10px] text-muted-foreground/50 text-center py-4">
                No scores yet.<br />Be the first!
              </p>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.map((entry, i) => (
                  <div key={entry.id} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${i === 0 ? "bg-primary/10" : ""}`}>
                    <span className={`font-mono text-[10px] w-4 text-right shrink-0 ${i === 0 ? "text-primary font-bold" : "text-muted-foreground/40"}`}>
                      {i + 1}
                    </span>
                    <span className={`text-xs font-medium flex-1 truncate ${i === 0 ? "text-primary" : "text-foreground"}`}>
                      {entry.name}
                    </span>
                    <div className="text-right shrink-0">
                      <p className={`font-mono text-[11px] tabular-nums ${i === 0 ? "text-primary font-bold" : "text-foreground"}`}>
                        {entry.score.toLocaleString()}
                      </p>
                      <p className="font-mono text-[9px] text-muted-foreground/40">
                        lvl {entry.level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 border border-border rounded-xl bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Power-ups</p>
            <div className="space-y-2">
              {Object.entries(puDesc).map(([key, desc]) => {
                const colors = { wide: "bg-[#c8e03c]", multi: "bg-[#4a9f6f]", slow: "bg-[#6b9fc4]", laser: "bg-[#e84040]" };
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${colors[key as keyof typeof colors]} flex items-center justify-center font-mono text-[8px] text-white font-bold shrink-0`}>
                      {desc[0]}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{desc.slice(4)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
