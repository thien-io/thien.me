"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Paddle { x: number; y: number; w: number; h: number; }
interface Ball   { x: number; y: number; vx: number; vy: number; r: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; }

type GameState = "menu" | "playing" | "paused" | "dead" | "point";

interface LeaderboardEntry { id: string; name: string; score: number; created_at: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const PADDLE_W_RATIO  = 0.22;   // paddle width as fraction of canvas width
const PADDLE_H        = 10;
const BALL_R          = 8;
const PLAYER_Y_OFFSET = 55;     // from bottom
const CPU_Y_OFFSET    = 55;     // from top
const BASE_SPEED      = 5.5;
const MAX_SPEED       = 14;
const CPU_BASE_REACT  = 0.055;  // how fast CPU tracks ball (fraction per frame)

// ─── Component ────────────────────────────────────────────────────────────────

export default function PongPage() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const stateRef    = useRef<GameState>("menu");
  const rafRef      = useRef<number>(0);
  const lastRef     = useRef<number>(0);

  const ballRef     = useRef<Ball>({ x: 0, y: 0, vx: 0, vy: 0, r: BALL_R });
  const playerRef   = useRef<Paddle>({ x: 0, y: 0, w: 80, h: PADDLE_H });
  const cpuRef      = useRef<Paddle>({ x: 0, y: 0, w: 80, h: PADDLE_H });
  const particlesRef= useRef<Particle[]>([]);

  const playerScoreRef = useRef(0);
  const livesRef       = useRef(3);
  const rallyRef       = useRef(0);   // consecutive hits — increases speed
  const pointTimerRef  = useRef(0);   // pause after a point

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
  const getCH = () => canvasRef.current?.height ?? 560;

  // ── Particles ────────────────────────────────────────────────────────────────
  const burst = (x: number, y: number, color: string) => {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
      });
    }
  };

  // ── Reset ball to centre ─────────────────────────────────────────────────────
  const resetBall = useCallback((dir: 1 | -1) => {
    const cw = getCW(); const ch = getCH();
    rallyRef.current = 0;
    const angle = (Math.random() * 50 - 25) * (Math.PI / 180);
    ballRef.current = {
      x: cw / 2, y: ch / 2,
      vx: Math.sin(angle) * BASE_SPEED,
      vy: dir * BASE_SPEED * Math.cos(angle),
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
    particlesRef.current = [];
    setUiScore(0); setUiLives(3);
    resetBall(1);
  }, [resetBall]);

  const startGame = useCallback(() => {
    setSubmitted(false); setPlayerName("");
    initGame();
    setState("playing");
  }, [initGame]);

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

  // ── Draw ─────────────────────────────────────────────────────────────────────
  const draw = useCallback((ctx: CanvasRenderingContext2D, cw: number, ch: number, isDark: boolean) => {
    // Background
    ctx.fillStyle = isDark ? "#0a0c10" : "#f2ece0";
    ctx.fillRect(0, 0, cw, ch);

    // Centre dashed line
    ctx.setLineDash([8, 10]);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ch / 2); ctx.lineTo(cw, ch / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Particles
    for (const p of particlesRef.current) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Paddles
    const padColor = isDark ? "#e8e0d0" : "#1a1410";
    // CPU paddle (top)
    ctx.fillStyle = isDark ? "#c8e03c" : "#8a9e20";
    ctx.beginPath();
    ctx.roundRect(cpuRef.current.x, cpuRef.current.y, cpuRef.current.w, cpuRef.current.h, 5);
    ctx.fill();
    // Player paddle (bottom)
    ctx.fillStyle = padColor;
    ctx.beginPath();
    ctx.roundRect(playerRef.current.x, playerRef.current.y, playerRef.current.w, playerRef.current.h, 5);
    ctx.fill();

    // Ball — with glow
    ctx.shadowColor = "#c8e03c";
    ctx.shadowBlur  = 12;
    ctx.fillStyle = "#c8e03c";
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Labels
    ctx.font = "10px DM Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
    ctx.fillText("CPU", cw / 2, CPU_Y_OFFSET + 20);
    ctx.fillText("YOU", cw / 2, ch - PLAYER_Y_OFFSET - 12);
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

    // Point-pause state
    if (stateRef.current === "point") {
      pointTimerRef.current -= dt;
      draw(ctx, cw, ch, isDark);
      if (pointTimerRef.current <= 0) {
        setState("playing");
      }
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    // ── Update particles ──
    for (const p of particlesRef.current) {
      p.x += p.vx; p.y += p.vy; p.life -= 0.045;
    }
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    // ── CPU AI ──────────────────────────────────────────────────────────────────
    const cpu    = cpuRef.current;
    const ball   = ballRef.current;
    const player = playerRef.current;

    // React speed increases slightly with score
    const reactSpeed = CPU_BASE_REACT + playerScoreRef.current * 0.0008;
    const cpuCentre  = cpu.x + cpu.w / 2;
    const diff       = ball.x - cpuCentre;
    // Add a small prediction lag based on rally count — gets sharper as rally grows
    const lag        = Math.max(0, 18 - rallyRef.current * 0.6);
    cpu.x += (diff - lag * Math.sign(diff)) * Math.min(reactSpeed, 0.92);
    cpu.x = Math.max(0, Math.min(cw - cpu.w, cpu.x));

    // ── Ball movement ──
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Side walls
    if (ball.x - ball.r < 0)  { ball.x = ball.r;    ball.vx =  Math.abs(ball.vx); }
    if (ball.x + ball.r > cw) { ball.x = cw - ball.r; ball.vx = -Math.abs(ball.vx); }

    // ── Paddle collisions ────────────────────────────────────────────────────────
    const hitPaddle = (pad: Paddle, dir: number) => {
      const hitPos = (ball.x - pad.x) / pad.w; // 0–1
      const angle  = (-140 + hitPos * 140) * (Math.PI / 180); // -70° to +70°
      rallyRef.current++;
      const speed = Math.min(BASE_SPEED + rallyRef.current * 0.25, MAX_SPEED);
      ball.vx = speed * Math.sin(angle);
      ball.vy = dir  * speed * Math.cos(angle);
      burst(ball.x, ball.y, "#c8e03c");
    };

    // CPU paddle (top — ball moving up)
    if (
      ball.vy < 0 &&
      ball.y - ball.r <= cpu.y + cpu.h &&
      ball.y - ball.r >= cpu.y - 4 &&
      ball.x >= cpu.x && ball.x <= cpu.x + cpu.w
    ) {
      ball.y = cpu.y + cpu.h + ball.r;
      hitPaddle(cpu, 1);
    }

    // Player paddle (bottom — ball moving down)
    if (
      ball.vy > 0 &&
      ball.y + ball.r >= player.y &&
      ball.y + ball.r <= player.y + player.h + 4 &&
      ball.x >= player.x - 2 && ball.x <= player.x + player.w + 2
    ) {
      ball.y = player.y - ball.r;
      hitPaddle(player, -1);
    }

    // ── Score / lives ─────────────────────────────────────────────────────────────
    // Ball past CPU (player scores)
    if (ball.y - ball.r < 0) {
      playerScoreRef.current++;
      setUiScore(playerScoreRef.current);
      burst(ball.x, 0, "#4a9f6f");
      resetBall(1);
      stateRef.current = "point";
      pointTimerRef.current = 900;
    }

    // Ball past player (CPU scores — lose a life)
    if (ball.y + ball.r > ch) {
      livesRef.current--;
      setUiLives(livesRef.current);
      burst(ball.x, ch, "#e84040");
      if (livesRef.current <= 0) {
        setState("dead");
        fetchLB();
        draw(ctx, cw, ch, isDark);
        return;
      }
      resetBall(1);
      stateRef.current = "point";
      pointTimerRef.current = 1100;
    }

    draw(ctx, cw, ch, isDark);
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, resetBall, fetchLB]);

  // ── Start/stop loop on state change ─────────────────────────────────────────
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
      const h = Math.round(w * 1.8);
      canvas.width  = w;
      canvas.height = h;
      // Re-position paddles on resize
      const pw = w * PADDLE_W_RATIO;
      if (stateRef.current !== "menu") {
        playerRef.current.y = h - PLAYER_Y_OFFSET;
        playerRef.current.w = pw;
        cpuRef.current.w    = pw;
        cpuRef.current.y    = CPU_Y_OFFSET - PADDLE_H;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Mouse / touch controls ────────────────────────────────────────────────────
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
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      movePlayer(e.touches[0].clientX);
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

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
    window.addEventListener("keydown", onKey);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [loop]);

  // ── Draw static bg on menu/dead ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || (uiState !== "menu" && uiState !== "dead")) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#0a0c10" : "#f2ece0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setLineDash([8, 10]);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [uiState]);

  return (
    <div>
      <section className="px-8 md:px-16 pt-24 pb-6 md:pt-32">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Game</p>
        <h1 className="font-display text-4xl font-light">Pong</h1>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 pb-16 items-start">
        {/* Game area */}
        <div className="flex-1 min-w-0 flex flex-col items-center">
          {/* HUD */}
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
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl border border-border touch-none select-none cursor-none"
            />

            {/* Menu overlay */}
            {uiState === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-xl bg-background/75 backdrop-blur-sm">
                <div className="text-center">
                  <p className="font-display text-6xl font-light text-foreground mb-1">Pong</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-2">vs the computer</p>
                </div>
                <div className="text-center space-y-1.5 px-8">
                  <p className="font-mono text-[10px] text-muted-foreground">Move your paddle with mouse or touch</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Score by getting past the CPU paddle</p>
                  <p className="font-mono text-[10px] text-muted-foreground">CPU gets faster as your score grows</p>
                  <p className="font-mono text-[10px] text-muted-foreground">3 lives — don't let it past you</p>
                </div>
                <button onClick={startGame}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:opacity-90 transition-opacity">
                  Play
                </button>
              </div>
            )}

            {/* Paused overlay */}
            {uiState === "paused" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-xl bg-background/85 backdrop-blur-sm">
                <p className="font-display text-4xl font-light text-muted-foreground">Paused</p>
                <button
                  onClick={() => { setState("playing"); lastRef.current = performance.now(); rafRef.current = requestAnimationFrame(loop); }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
                  Resume
                </button>
                <button onClick={() => setState("menu")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Quit
                </button>
              </div>
            )}

            {/* Game over overlay */}
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
              <p className="font-mono text-[10px] text-muted-foreground/50 text-center py-6">
                No scores yet.<br />Be the first!
              </p>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.map((e, i) => (
                  <div key={e.id} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${i === 0 ? "bg-primary/10" : ""}`}>
                    <span className={`font-mono text-[10px] w-4 text-right shrink-0 ${i === 0 ? "text-primary font-bold" : "text-muted-foreground/40"}`}>
                      {i + 1}
                    </span>
                    <span className={`text-xs font-medium flex-1 truncate ${i === 0 ? "text-primary" : "text-foreground"}`}>
                      {e.name}
                    </span>
                    <span className={`font-mono text-[11px] tabular-nums shrink-0 ${i === 0 ? "text-primary font-bold" : "text-foreground"}`}>
                      {e.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 border border-border rounded-xl bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">How it works</p>
            <div className="space-y-2">
              {[
                "Score by getting the ball past the CPU",
                "Ball speeds up with each rally",
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
