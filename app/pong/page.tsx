"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Paddle { x: number; y: number; w: number; h: number; }
interface Ball   { x: number; y: number; vx: number; vy: number; r: number; }
interface LeaderboardEntry { id: string; name: string; score: number; created_at: string; }
type GameState = "menu" | "playing" | "paused" | "dead" | "point";

// ─── Constants ────────────────────────────────────────────────────────────────

const PADDLE_H        = 12;
const BALL_R          = 7;
const PLAYER_Y_OFFSET = 52;
const CPU_Y_OFFSET    = 52;
const BASE_SPEED      = 6;
const MAX_SPEED       = 13;
const PADDLE_W_RATIO  = 0.28;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PongPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<GameState>("menu");
  const rafRef    = useRef<number>(0);
  const lastRef   = useRef<number>(0);

  const ballRef   = useRef<Ball>({ x: 0, y: 0, vx: 0, vy: 0, r: BALL_R });
  const playerRef = useRef<Paddle>({ x: 0, y: 0, w: 80, h: PADDLE_H });
  const cpuRef    = useRef<Paddle>({ x: 0, y: 0, w: 80, h: PADDLE_H });

  const playerScoreRef = useRef(0);
  const livesRef       = useRef(3);
  const rallyRef       = useRef(0);
  const pointTimerRef  = useRef(0);
  const cpuErrorRef    = useRef(0); // intentional CPU positioning error

  const [uiState,  setUiState]  = useState<GameState>("menu");
  const [uiScore,  setUiScore]  = useState(0);
  const [uiLives,  setUiLives]  = useState(3);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName,  setPlayerName]  = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [loadingLB,   setLoadingLB]   = useState(false);

  const setState = (s: GameState) => { stateRef.current = s; setUiState(s); };

  const getCW = () => canvasRef.current?.width  ?? 320;
  const getCH = () => canvasRef.current?.height ?? 576;

  // ── Leaderboard ──────────────────────────────────────────────────────────────
  const fetchLB = useCallback(async () => {
    setLoadingLB(true);
    try {
      const r = await fetch("/api/pong-leaderboard");
      const d = await r.json();
      setLeaderboard(d.entries || []);
    } catch { setLeaderboard([]); }
    finally { setLoadingLB(false); }
  }, []);

  // Fetch on mount
  useEffect(() => { fetchLB(); }, [fetchLB]);

  const submitScore = useCallback(async () => {
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/pong-leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName.trim(), score: playerScoreRef.current }),
      });
      setSubmitted(true);
      fetchLB();
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  }, [playerName, submitting, fetchLB]);

  // ── Reset ball ───────────────────────────────────────────────────────────────
  const resetBall = useCallback(() => {
    const cw = getCW(); const ch = getCH();
    rallyRef.current = 0;
    // Serve toward player, slight random angle
    const angle = (Math.random() * 30 - 15) * (Math.PI / 180);
    const spd   = BASE_SPEED;
    ballRef.current = {
      x: cw / 2, y: ch / 2,
      vx: Math.sin(angle) * spd,
      vy: spd * Math.cos(angle),   // always toward player first
      r: BALL_R,
    };
  }, []);

  // ── Init ─────────────────────────────────────────────────────────────────────
  const initGame = useCallback(() => {
    const cw = getCW(); const ch = getCH();
    const pw = cw * PADDLE_W_RATIO;
    playerRef.current = { x: cw / 2 - pw / 2, y: ch - PLAYER_Y_OFFSET, w: pw, h: PADDLE_H };
    cpuRef.current    = { x: cw / 2 - pw / 2, y: CPU_Y_OFFSET - PADDLE_H, w: pw, h: PADDLE_H };
    playerScoreRef.current = 0;
    livesRef.current = 3;
    rallyRef.current = 0;
    cpuErrorRef.current = 0;
    setUiScore(0); setUiLives(3);
    resetBall();
  }, [resetBall]);

  const startGame = useCallback(() => {
    setSubmitted(false); setPlayerName("");
    initGame();
    setState("playing");
  }, [initGame]);

  // ── Draw ─────────────────────────────────────────────────────────────────────
  const draw = useCallback((ctx: CanvasRenderingContext2D, cw: number, ch: number, isDark: boolean) => {
    ctx.fillStyle = isDark ? "#0a0c10" : "#f2ece0";
    ctx.fillRect(0, 0, cw, ch);

    // Dashed centre line
    ctx.save();
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, ch / 2); ctx.lineTo(cw, ch / 2);
    ctx.stroke();
    ctx.restore();

    // CPU paddle (top) — yellow-green
    ctx.fillStyle = isDark ? "#b8cc30" : "#8a9e20";
    ctx.beginPath();
    ctx.roundRect(cpuRef.current.x, cpuRef.current.y, cpuRef.current.w, cpuRef.current.h, 5);
    ctx.fill();

    // Player paddle (bottom) — neutral
    ctx.fillStyle = isDark ? "#e8e0d0" : "#1a1410";
    ctx.beginPath();
    ctx.roundRect(playerRef.current.x, playerRef.current.y, playerRef.current.w, playerRef.current.h, 5);
    ctx.fill();

    // Ball — solid, no glow
    ctx.fillStyle = "#c8e03c";
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.r, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.font = "9px DM Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";
    ctx.fillText("CPU", cw / 2, CPU_Y_OFFSET + 18);
    ctx.fillText("YOU", cw / 2, ch - PLAYER_Y_OFFSET - 10);
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    if (stateRef.current !== "playing" && stateRef.current !== "point") return;
    const dt = Math.min(ts - lastRef.current, 32);
    lastRef.current = ts;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width; const ch = canvas.height;
    const isDark = document.documentElement.classList.contains("dark");

    // Point pause
    if (stateRef.current === "point") {
      pointTimerRef.current -= dt;
      draw(ctx, cw, ch, isDark);
      if (pointTimerRef.current <= 0) setState("playing");
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    const ball   = ballRef.current;
    const player = playerRef.current;
    const cpu    = cpuRef.current;

    // ── CPU AI ──────────────────────────────────────────────────────────────────
    // CPU tracks ball centre with intentional imprecision that shrinks with score
    // Introduce a small per-frame positional error so it misses occasionally
    if (Math.random() < 0.07) {
      cpuErrorRef.current = (Math.random() - 0.5) * cpu.w * 0.9;
    }
    const targetX    = ball.x + cpuErrorRef.current - cpu.w / 2;
    const difficulty = Math.min(0.06 + playerScoreRef.current * 0.005, 0.68);
    const maxMove    = cw * difficulty * (dt / 16);
    const diff       = targetX - cpu.x;
    cpu.x += Math.sign(diff) * Math.min(Math.abs(diff), maxMove);
    cpu.x  = Math.max(0, Math.min(cw - cpu.w, cpu.x));

    // ── Move ball ───────────────────────────────────────────────────────────────
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Side walls — plain reflect
    if (ball.x - ball.r <= 0) {
      ball.x = ball.r;
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + ball.r >= cw) {
      ball.x = cw - ball.r;
      ball.vx = -Math.abs(ball.vx);
    }

    // ── Paddle collision helper ──────────────────────────────────────────────────
    // Returns true if ball overlaps paddle rect
    const overlaps = (pad: Paddle) =>
      ball.x + ball.r > pad.x &&
      ball.x - ball.r < pad.x + pad.w &&
      ball.y + ball.r > pad.y &&
      ball.y - ball.r < pad.y + pad.h;

    // ── Player paddle (bottom) ──────────────────────────────────────────────────
    if (ball.vy > 0 && overlaps(player)) {
      // Push ball above paddle
      ball.y = player.y - ball.r;
      // Angle from hit position: -1 (left) to +1 (right) → maps to angle
      const t     = ((ball.x - player.x) / player.w) * 2 - 1; // -1..1
      const angle = t * 65 * (Math.PI / 180); // max ±65°
      rallyRef.current++;
      const spd = Math.min(BASE_SPEED + rallyRef.current * 0.3, MAX_SPEED);
      ball.vx = spd * Math.sin(angle);
      ball.vy = -spd * Math.abs(Math.cos(angle)); // always go up
    }

    // ── CPU paddle (top) ────────────────────────────────────────────────────────
    if (ball.vy < 0 && overlaps(cpu)) {
      // Push ball below CPU paddle
      ball.y = cpu.y + cpu.h + ball.r;
      const t     = ((ball.x - cpu.x) / cpu.w) * 2 - 1;
      const angle = t * 55 * (Math.PI / 180); // narrower angle for CPU
      rallyRef.current++;
      const spd = Math.min(BASE_SPEED + rallyRef.current * 0.3, MAX_SPEED);
      ball.vx = spd * Math.sin(angle);
      ball.vy = spd * Math.abs(Math.cos(angle)); // always go down
    }

    // ── Scoring ──────────────────────────────────────────────────────────────────
    // Ball past CPU (player scores)
    if (ball.y + ball.r < 0) {
      playerScoreRef.current++;
      setUiScore(playerScoreRef.current);
      resetBall();
      stateRef.current = "point";
      pointTimerRef.current = 900;
      draw(ctx, cw, ch, isDark);
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    // Ball past player (CPU scores — lose a life)
    if (ball.y - ball.r > ch) {
      livesRef.current--;
      setUiLives(livesRef.current);
      if (livesRef.current <= 0) {
        setState("dead");
        fetchLB();
        draw(ctx, cw, ch, isDark);
        return;
      }
      resetBall();
      stateRef.current = "point";
      pointTimerRef.current = 1100;
      draw(ctx, cw, ch, isDark);
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    draw(ctx, cw, ch, isDark);
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, resetBall, fetchLB]);

  // ── Loop start/stop ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (uiState === "playing") {
      lastRef.current = performance.now();
      rafRef.current  = requestAnimationFrame(loop);
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
      const w = Math.min(container.clientWidth, 380);
      const h = Math.min(Math.round(w * 1.8), Math.round(window.innerHeight * 0.62));
      canvas.width = w; canvas.height = h;
      const pw = w * PADDLE_W_RATIO;
      if (stateRef.current !== "menu") {
        playerRef.current.w = pw;
        playerRef.current.y = h - PLAYER_Y_OFFSET;
        cpuRef.current.w    = pw;
        cpuRef.current.y    = CPU_Y_OFFSET - PADDLE_H;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Controls ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const movePlayer = (clientX: number) => {
      if (stateRef.current !== "playing" && stateRef.current !== "point") return;
      const rect = canvas.getBoundingClientRect();
      const mx   = (clientX - rect.left) * (canvas.width / rect.width);
      const p    = playerRef.current;
      p.x = Math.max(0, Math.min(canvas.width - p.w, mx - p.w / 2));
    };

    const onMouseMove = (e: MouseEvent) => movePlayer(e.clientX);
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); movePlayer(e.touches[0].clientX); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (stateRef.current === "playing") setState("paused");
        else if (stateRef.current === "paused") {
          setState("playing");
          lastRef.current = performance.now();
          rafRef.current  = requestAnimationFrame(loop);
        }
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [loop]);

  // ── Static canvas on menu/dead ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || (uiState !== "menu" && uiState !== "dead")) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#0a0c10" : "#f2ece0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.restore();
  }, [uiState]);

  return (
    <div>
      <section className="relative px-8 md:px-16 pt-6 pb-3 md:pt-32 overflow-hidden">

        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Games</p>
        <h1 className="font-display text-4xl font-light">Pong</h1>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 px-3 md:px-8 pb-6 md:pb-16 items-start">
        {/* Game */}
        <div className="flex-1 min-w-0 flex flex-col items-center">
          {(uiState === "playing" || uiState === "paused" || uiState === "point") && (
            <div className="w-full max-w-[380px] flex items-center justify-between px-1 mb-2">
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < uiLives ? "text-primary" : "text-muted-foreground/20"}`}>●</span>
                ))}
              </div>
              <span className="font-mono text-sm font-medium text-foreground tabular-nums">
                {uiScore} <span className="text-muted-foreground/40 text-xs">pts</span>
              </span>
            </div>
          )}

          <div className="relative w-full max-w-[380px]">
            <canvas ref={canvasRef}
              className="w-full rounded-xl border border-border touch-none select-none cursor-none" />

            {uiState === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-xl bg-background/75 backdrop-blur-sm">
                <div className="text-center">
                  <p className="font-display text-6xl font-light text-foreground">Pong</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-2">vs the computer</p>
                </div>
                <div className="text-center space-y-1.5 px-8">
                  <p className="font-mono text-[10px] text-muted-foreground">Move your paddle with mouse or touch</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Score by getting past the CPU</p>
                  <p className="font-mono text-[10px] text-muted-foreground">CPU gets harder as your score grows</p>
                  <p className="font-mono text-[10px] text-muted-foreground">3 lives — don&apos;t let it past you</p>
                </div>
                <button onClick={startGame}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:opacity-90 transition-opacity">
                  Play
                </button>
              </div>
            )}

            {uiState === "paused" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-xl bg-background/85 backdrop-blur-sm">
                <p className="font-display text-4xl font-light text-muted-foreground">Paused</p>
                <button onClick={() => { setState("playing"); lastRef.current = performance.now(); rafRef.current = requestAnimationFrame(loop); }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
                  Resume
                </button>
                <button onClick={() => setState("menu")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Quit
                </button>
              </div>
            )}

            {uiState === "dead" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/88 backdrop-blur-sm px-6">
                <p className="font-display text-4xl font-light text-foreground">Game Over</p>
                <div className="text-center">
                  <p className="font-display text-3xl text-primary">{uiScore}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">points scored</p>
                </div>
                {!submitted ? (
                  <div className="w-full space-y-2">
                    <input type="text" placeholder="Your name" maxLength={30}
                      value={playerName} onChange={e => setPlayerName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && submitScore()}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center font-mono" />
                    <button onClick={submitScore} disabled={submitting || !playerName.trim()}
                      className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity">
                      {submitting ? "Saving..." : "Save score"}
                    </button>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-primary">✓ Score saved!</p>
                )}
                <button onClick={startGame}
                  className="w-full py-2 rounded-xl border border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                  Play again
                </button>
              </div>
            )}
          </div>

          {uiState === "playing" && (
            <button onClick={() => setState("paused")}
              className="mt-3 font-mono text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              tap to pause
            </button>
          )}
        </div>

        {/* Leaderboard */}
        <div className="w-full lg:w-60 shrink-0">
          <div className="border border-border rounded-xl bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Leaderboard</p>
              <button onClick={fetchLB} className="font-mono text-[9px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">refresh</button>
            </div>
            {loadingLB ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <p className="font-mono text-[10px] text-muted-foreground/50 text-center py-6">No scores yet.<br />Be the first!</p>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.map((e, i) => (
                  <div key={e.id} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${i === 0 ? "bg-primary/10" : ""}`}>
                    <span className={`font-mono text-[10px] w-4 text-right shrink-0 ${i === 0 ? "text-primary font-bold" : "text-muted-foreground/40"}`}>{i + 1}</span>
                    <span className={`text-xs font-medium flex-1 truncate ${i === 0 ? "text-primary" : "text-foreground"}`}>{e.name}</span>
                    <span className={`font-mono text-[11px] tabular-nums shrink-0 ${i === 0 ? "text-primary font-bold" : "text-foreground"}`}>{e.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 border border-border rounded-xl bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">How it works</p>
            <div className="space-y-2">
              {[
                "Score by getting past the CPU paddle",
                "Ball speeds up each rally",
                "CPU reacts faster as your score grows",
                "3 lives — one lost each time CPU scores",
              ].map((t, i) => (
                <p key={i} className="font-mono text-[10px] text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-primary shrink-0">–</span>{t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
