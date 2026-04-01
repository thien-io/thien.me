"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point { x: number; y: number; }

interface LeaderboardEntry {
  id: string; name: string; score: number; created_at: string;
}

type GameState = "menu" | "playing" | "dead" | "submit";
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL = 20;
const BASE_INTERVAL = 130; // ms per tick

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SnakePage() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef<GameState>("menu");
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Game state refs
  const snakeRef   = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef     = useRef<Dir>("RIGHT");
  const nextDirRef = useRef<Dir>("RIGHT");
  const foodRef    = useRef<Point>({ x: 15, y: 10 });
  const scoreRef   = useRef(0);
  const colsRef    = useRef(20);
  const rowsRef    = useRef(20);

  // React state (UI only)
  const [uiState, setUiState]         = useState<GameState>("menu");
  const [uiScore, setUiScore]         = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName]   = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [loadingLB, setLoadingLB]     = useState(false);

  const setState = (s: GameState) => {
    stateRef.current = s;
    setUiState(s);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const cols = () => colsRef.current;
  const rows = () => rowsRef.current;

  const randFood = useCallback((): Point => {
    const snake = snakeRef.current;
    let p: Point;
    do {
      p = { x: Math.floor(Math.random() * cols()), y: Math.floor(Math.random() * rows()) };
    } while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
  }, []);

  // ── Draw ──────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width; const ch = canvas.height;
    const isDark = document.documentElement.classList.contains("dark");

    // Background
    ctx.fillStyle = isDark ? "#0e1015" : "#f5f0e8";
    ctx.fillRect(0, 0, cw, ch);

    // Grid dots (subtle)
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
    for (let gx = 0; gx < cols(); gx++) {
      for (let gy = 0; gy < rows(); gy++) {
        ctx.beginPath();
        ctx.arc(gx * CELL + CELL / 2, gy * CELL + CELL / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Food
    const food = foodRef.current;
    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    ctx.fillStyle = "#e84040";
    ctx.beginPath();
    ctx.arc(fx, fy, CELL * 0.35, 0, Math.PI * 2);
    ctx.fill();
    // Shine
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(fx - 2, fy - 2, CELL * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const alpha = isHead ? 1 : Math.max(0.35, 1 - i * 0.015);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = isHead ? "#c8e03c" : "#8aaa20";
      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, isHead ? 5 : 3);
      ctx.fill();

      // Eyes on head
      if (isHead) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = isDark ? "#0e1015" : "#f5f0e8";
        const d = dirRef.current;
        const ex1 = d === "LEFT" ? seg.x * CELL + 4 : d === "RIGHT" ? seg.x * CELL + CELL - 6 : seg.x * CELL + 5;
        const ey1 = d === "UP"   ? seg.y * CELL + 4 : d === "DOWN"  ? seg.y * CELL + CELL - 6 : seg.y * CELL + 5;
        const ex2 = d === "LEFT" ? seg.x * CELL + 4 : d === "RIGHT" ? seg.x * CELL + CELL - 6 : seg.x * CELL + CELL - 7;
        const ey2 = d === "UP"   ? seg.y * CELL + 4 : d === "DOWN"  ? seg.y * CELL + CELL - 6 : seg.y * CELL + CELL - 7;
        ctx.beginPath(); ctx.arc(ex1, ey1, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey2, 2, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }, []);

  // ── Tick ──────────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (stateRef.current !== "playing") return;

    dirRef.current = nextDirRef.current;
    const snake = snakeRef.current;
    const head = snake[0];
    const d = dirRef.current;

    const next: Point = {
      x: head.x + (d === "RIGHT" ? 1 : d === "LEFT" ? -1 : 0),
      y: head.y + (d === "DOWN"  ? 1 : d === "UP"   ? -1 : 0),
    };

    // Wall collision
    if (next.x < 0 || next.x >= cols() || next.y < 0 || next.y >= rows()) {
      setState("dead");
      draw();
      return;
    }

    // Self collision (skip tail tip which will be removed)
    if (snake.slice(0, -1).some(s => s.x === next.x && s.y === next.y)) {
      setState("dead");
      draw();
      return;
    }

    const ateFood = next.x === foodRef.current.x && next.y === foodRef.current.y;

    // Move
    const newSnake = [next, ...snake];
    if (!ateFood) newSnake.pop();

    snakeRef.current = newSnake;

    if (ateFood) {
      scoreRef.current += 10;
      setUiScore(scoreRef.current);
      foodRef.current = randFood();
    }

    draw();

    // Speed increases: min 55ms at long snake lengths
    const interval = Math.max(55, BASE_INTERVAL - Math.floor(scoreRef.current / 50) * 5);
    timerRef.current = setTimeout(tick, interval);
  }, [draw, randFood]);

  // ── Start game ───────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const c = cols(); const r = rows();
    const startX = Math.floor(c / 2);
    const startY = Math.floor(r / 2);
    snakeRef.current  = [{ x: startX, y: startY }, { x: startX - 1, y: startY }, { x: startX - 2, y: startY }];
    dirRef.current    = "RIGHT";
    nextDirRef.current = "RIGHT";
    scoreRef.current  = 0;
    setUiScore(0);
    setSubmitted(false);
    setPlayerName("");
    foodRef.current = randFood();
    setState("playing");
    timerRef.current = setTimeout(tick, BASE_INTERVAL);
  }, [randFood, tick]);

  // ── Fetch leaderboard ─────────────────────────────────────────────────────────
  const fetchLB = useCallback(async () => {
    setLoadingLB(true);
    try {
      const r = await fetch("/api/snake-leaderboard");
      const d = await r.json();
      setLeaderboard(d.entries || []);
    } catch { setLeaderboard([]); }
    finally { setLoadingLB(false); }
  }, []);

  useEffect(() => { fetchLB(); }, [fetchLB]);

  // ── Submit score ──────────────────────────────────────────────────────────────
  const submitScore = useCallback(async () => {
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/snake-leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName.trim(), score: scoreRef.current }),
      });
      setSubmitted(true);
      await fetchLB();
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  }, [playerName, submitting, fetchLB]);

  // ── Canvas resize ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const size = Math.min(container.clientWidth, 420);
      const cellCount = Math.floor(size / CELL);
      const actual = cellCount * CELL;
      canvas.width  = actual;
      canvas.height = actual;
      colsRef.current = cellCount;
      rowsRef.current = cellCount;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // ── Cleanup timer ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // ── Shared direction press ────────────────────────────────────────────────────
  const pressDir = useCallback((newDir: Dir) => {
    if (stateRef.current !== "playing") return;
    const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (newDir !== opposite[dirRef.current]) nextDirRef.current = newDir;
  }, []);

  // ── Keyboard controls ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const newDir = map[e.key];
      if (!newDir) return;
      pressDir(newDir);
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pressDir]);

  // ── Touch swipe controls ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let touchStart: Point | null = null;

    const onTouchStart = (e: TouchEvent) => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart || stateRef.current !== "playing") return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      const cur = dirRef.current;
      const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      let newDir: Dir;
      if (Math.abs(dx) > Math.abs(dy)) {
        newDir = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        newDir = dy > 0 ? "DOWN" : "UP";
      }
      if (newDir !== opposite[cur]) nextDirRef.current = newDir;
      touchStart = null;
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  // ── Draw static canvas on menu/dead ──────────────────────────────────────────
  useEffect(() => {
    if (uiState === "menu" || uiState === "dead") draw();
  }, [uiState, draw]);

  return (
    <div>
      <section className="relative px-8 md:px-16 pt-24 pb-6 md:pt-32 overflow-hidden">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Game</p>
        <h1 className="font-display text-4xl font-light">Snake</h1>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 pb-16 items-start">
        {/* Canvas area */}
        <div className="flex-1 min-w-0 flex flex-col items-center">
          {/* HUD */}
          {uiState === "playing" && (
            <div className="w-full max-w-[420px] flex items-center justify-between px-1 mb-2">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Score</span>
              <span className="font-mono text-sm font-medium text-foreground tabular-nums">{uiScore}</span>
            </div>
          )}

          {/* Canvas */}
          <div className="relative w-full max-w-[420px]">
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl border border-border touch-none select-none"
            />

            {/* Menu overlay */}
            {uiState === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-xl bg-background/75 backdrop-blur-sm">
                <div className="text-center">
                  <p className="font-display text-6xl font-light text-primary italic">Snake</p>
                </div>
                <div className="text-center space-y-1 px-8">
                  <p className="font-mono text-[10px] text-muted-foreground">Arrow keys or WASD to move</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Swipe on mobile</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Don&apos;t hit the walls or yourself</p>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:opacity-90 transition-opacity"
                >
                  Play
                </button>
              </div>
            )}

            {/* Game over overlay */}
            {(uiState === "dead" || uiState === "submit") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/85 backdrop-blur-sm px-6">
                <p className="font-display text-4xl font-light text-foreground">Game Over</p>
                <div className="text-center">
                  <p className="font-display text-3xl text-primary">{uiScore}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">{uiScore} pts</p>
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
                  className="w-full py-2 rounded-xl border border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                >
                  Play again
                </button>
              </div>
            )}
          </div>

          {/* D-pad controls */}
          <div className="mt-5 w-full max-w-[420px] flex flex-col items-center gap-1 select-none">
            <button
              onPointerDown={() => pressDir("UP")}
              className="w-14 h-14 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground active:bg-primary/15 active:text-primary active:scale-95 transition-all touch-manipulation"
              aria-label="Up"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
            <div className="flex gap-1">
              <button
                onPointerDown={() => pressDir("LEFT")}
                className="w-14 h-14 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground active:bg-primary/15 active:text-primary active:scale-95 transition-all touch-manipulation"
                aria-label="Left"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-14 h-14 rounded-xl bg-muted/30" />
              <button
                onPointerDown={() => pressDir("RIGHT")}
                className="w-14 h-14 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground active:bg-primary/15 active:text-primary active:scale-95 transition-all touch-manipulation"
                aria-label="Right"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <button
              onPointerDown={() => pressDir("DOWN")}
              className="w-14 h-14 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground active:bg-primary/15 active:text-primary active:scale-95 transition-all touch-manipulation"
              aria-label="Down"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
          </div>
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
                    <span className={`font-mono text-[11px] tabular-nums shrink-0 ${i === 0 ? "text-primary font-bold" : "text-foreground"}`}>
                      {entry.score.toLocaleString()}
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

