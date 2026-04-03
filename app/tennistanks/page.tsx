"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LBEntry { id: string; name: string; score: number; created_at: string; }

type Phase =
  | "menu"
  | "player-aim"     // player adjusting angle/power
  | "player-fire"    // player's ball in flight
  | "ai-think"       // AI "thinking" pause
  | "ai-fire"        // AI ball in flight
  | "round-end"      // brief pause after a hit
  | "game-over";

interface BallState {
  x: number; y: number;
  vx: number; vy: number;
  bounces: number;
  active: boolean;
  trail: Array<{ x: number; y: number }>;
}

interface Explosion {
  x: number; y: number; r: number; life: number; maxLife: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GRAVITY   = 0.18;
const MAX_POWER = 18;
const WIN_SCORE = 5;
const TANK_W    = 32;
const TANK_H    = 20;
const BALL_R    = 7;
const MAX_BOUNCE= 4;

// ─── Terrain generation ───────────────────────────────────────────────────────

function makeTerrain(w: number, h: number, seed: number): number[] {
  const base = h * 0.60;
  const t: number[] = [];
  for (let x = 0; x < w; x++) {
    let y = base;
    y += Math.sin(x * 0.018 + seed) * 35;
    y += Math.sin(x * 0.038 + seed * 1.7) * 18;
    y += Math.sin(x * 0.009 + seed * 0.4) * 28;
    t.push(Math.round(y));
  }
  // Smooth
  for (let pass = 0; pass < 4; pass++) {
    for (let x = 2; x < w - 2; x++) {
      t[x] = Math.round((t[x-2] + t[x-1] + t[x] + t[x+1] + t[x+2]) / 5);
    }
  }
  // Flatten player zones
  const flatLeft  = Math.round(w * 0.10);
  const flatRight = Math.round(w * 0.90);
  const leftY  = t[flatLeft];
  const rightY = t[flatRight];
  for (let x = 0; x < Math.round(w * 0.20); x++) {
    t[x] = leftY;
  }
  for (let x = Math.round(w * 0.80); x < w; x++) {
    t[x] = rightY;
  }
  return t;
}

function terrainAt(terrain: number[], x: number): number {
  const ix = Math.max(0, Math.min(terrain.length - 1, Math.round(x)));
  return terrain[ix];
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function drawTerrain(ctx: CanvasRenderingContext2D, terrain: number[], w: number, h: number, isDark: boolean) {
  // Fill gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    grad.addColorStop(0, "#2a4a18"); grad.addColorStop(1, "#162a08");
  } else {
    grad.addColorStop(0, "#5aa82c"); grad.addColorStop(1, "#3c7818");
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x < w; x++) ctx.lineTo(x, terrain[x]);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
  // Top edge highlight
  ctx.beginPath();
  ctx.moveTo(0, terrain[0]);
  for (let x = 1; x < w; x++) ctx.lineTo(x, terrain[x]);
  ctx.strokeStyle = isDark ? "#4a7828" : "#70c038";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, isDark: boolean) {
  const g = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  if (isDark) {
    g.addColorStop(0, "#080f18"); g.addColorStop(1, "#152030");
  } else {
    g.addColorStop(0, "#5ab0d8"); g.addColorStop(1, "#b8e0f0");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawNet(ctx: CanvasRenderingContext2D, x: number, terrain: number[], isDark: boolean) {
  const groundY = terrainAt(terrain, x);
  const top = groundY - 60;
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, groundY); ctx.stroke();
  for (let y = top; y < groundY; y += 8) {
    ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x + 3, y); ctx.stroke();
  }
  ctx.fillStyle = "#fff";
  ctx.fillRect(x - 4, top - 2, 8, 4);
  ctx.fillStyle = isDark ? "#888" : "#aaa";
  ctx.fillRect(x - 2, groundY - 4, 4, 4);
}

function drawTank(
  ctx: CanvasRenderingContext2D,
  x: number, groundY: number,
  angle: number,   // radians, negative = up-left
  power: number,   // 0-1
  isPlayer: boolean,
  isDark: boolean,
  showAim: boolean,
  terrain: number[],
) {
  const y = groundY - TANK_H / 2;
  const dir = isPlayer ? 1 : -1; // +1 = fire right, -1 = fire left

  // Body
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = isPlayer
    ? (isDark ? "#4a8cd4" : "#3070c0")
    : (isDark ? "#d47a3a" : "#c05820");
  ctx.beginPath();
  ctx.roundRect(-TANK_W / 2, -TANK_H / 2, TANK_W, TANK_H, 5);
  ctx.fill();

  // Wheels
  const wR = 7;
  const wOffsets = [-10, 0, 10];
  ctx.fillStyle = isDark ? "#333" : "#222";
  for (const wx of wOffsets) {
    ctx.beginPath(); ctx.arc(wx, TANK_H / 2 - 2, wR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = isDark ? "#555" : "#444";
    ctx.lineWidth = 1.5; ctx.stroke();
  }

  // Turret base
  ctx.fillStyle = isPlayer
    ? (isDark ? "#5a9ce4" : "#4080d0")
    : (isDark ? "#e48a4a" : "#d06830");
  ctx.beginPath(); ctx.arc(0, -TANK_H / 2, 9, 0, Math.PI * 2); ctx.fill();

  // Barrel (racket handle)
  const barrelLen = 22;
  const bx2 = Math.cos(angle) * dir * barrelLen;
  const by2 = -Math.sin(angle) * barrelLen;
  ctx.strokeStyle = isPlayer
    ? (isDark ? "#6aacf4" : "#5090e0")
    : (isDark ? "#f49a5a" : "#e07840");
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, -TANK_H / 2); ctx.lineTo(bx2, -TANK_H / 2 + by2); ctx.stroke();

  // Racket head at tip
  const tx = bx2, ty = -TANK_H / 2 + by2;
  ctx.strokeStyle = isPlayer ? "#ecf53a" : "#ecf53a";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(tx, ty, 7, 5, angle * dir, 0, Math.PI * 2); ctx.stroke();

  ctx.restore();

  // Aim trajectory preview (player only, during aiming)
  if (showAim && isPlayer) {
    const power_ = power * MAX_POWER;
    const vx0 = Math.cos(angle) * dir * power_;
    const vy0 = -Math.sin(angle) * power_;
    let px = x, py = y - TANK_H / 2;
    let pvx = vx0, pvy = vy0;
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = isDark ? "rgba(236,245,58,0.4)" : "rgba(236,245,58,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, py);
    for (let i = 0; i < 50; i++) {
      px += pvx; py += pvy; pvy += GRAVITY;
      if (px < 0 || px >= terrain.length) break;
      if (py >= terrainAt(terrain, px)) break;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawBallInFlight(ctx: CanvasRenderingContext2D, ball: BallState) {
  if (!ball.active) return;
  // Trail
  for (let i = 0; i < ball.trail.length; i++) {
    const t = ball.trail[i];
    const alpha = (i / ball.trail.length) * 0.4;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ecf53a";
    ctx.beginPath(); ctx.arc(t.x, t.y, BALL_R * 0.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Ball
  const bg = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, BALL_R);
  bg.addColorStop(0, "#f0f860"); bg.addColorStop(1, "#b8c010");
  ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fillStyle = bg; ctx.fill();
  // Seams
  ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R * 0.6, 0.2, Math.PI - 0.2); ctx.stroke();
}

function drawExplosions(ctx: CanvasRenderingContext2D, explosions: Explosion[]) {
  for (const e of explosions) {
    const t = e.life / e.maxLife;
    ctx.globalAlpha = t;
    // Outer ring
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (1 - t * 0.3), 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${45 + t * 30}, 100%, ${50 + t * 20}%)`;
    ctx.fill();
    // Inner
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 0.5 * (1 - t * 0.5), 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TennisTanksPage() {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>("menu");

  // Canvas dims
  const cwRef = useRef(800);
  const chRef = useRef(400);

  // Game state
  const terrainRef   = useRef<number[]>([]);
  const playerXRef   = useRef(0);
  const aiXRef       = useRef(0);
  const playerScRef  = useRef(0);
  const aiScRef      = useRef(0);
  const angleRef     = useRef(45 * Math.PI / 180);  // player aim angle
  const powerRef     = useRef(0);                   // 0-1
  const chargingRef  = useRef(false);
  const chargeStart  = useRef(0);
  const ballRef      = useRef<BallState>({ x:0, y:0, vx:0, vy:0, bounces:0, active:false, trail:[] });
  const windRef      = useRef(0);
  const explosionsRef= useRef<Explosion[]>([]);
  const aiThinkTimer = useRef(0);
  const roundMsgRef  = useRef("");
  const roundMsgTimer= useRef(0);
  const seedRef      = useRef(Math.random() * 100);

  // UI state
  const [phase, setPhase]     = useState<Phase>("menu");
  const [uiPlayerSc, setUPS]  = useState(0);
  const [uiAiSc, setUAS]      = useState(0);
  const [uiAngle, setUiAngle] = useState(45);
  const [uiPower, setUiPower] = useState(0);
  const [uiWind, setUiWind]   = useState(0);
  const [uiMsg, setUiMsg]     = useState("");
  const [lb, setLb]           = useState<LBEntry[]>([]);
  const [pname, setPname]     = useState("");
  const [submitting, setSub]  = useState(false);
  const [submitted, setSubed] = useState(false);
  const [lbLoad, setLbLoad]   = useState(false);

  const setPhaseB = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  const W = () => cwRef.current;
  const H = () => chRef.current;

  // ── Simulate a shot to find landing x ────────────────────────────────────────
  const simulateLanding = (sx: number, sy: number, vx: number, vy: number, wind: number): number => {
    let px = sx, py = sy, pvx = vx, pvy = vy;
    const t = terrainRef.current;
    for (let i = 0; i < 2000; i++) {
      px += pvx; py += pvy; pvy += GRAVITY; pvx += wind * 0.004;
      if (px < 0 || px >= t.length) return px;
      if (py >= terrainAt(t, px)) return px;
    }
    return px;
  };

  // ── Render frame ──────────────────────────────────────────────────────────────
  const render = useCallback(() => {
    const c = cvsRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains("dark");
    const ww = W(), hh = H();
    const terrain = terrainRef.current;
    if (terrain.length === 0) return;

    const pX = playerXRef.current;
    const aX = aiXRef.current;
    const pGY = terrainAt(terrain, pX);
    const aGY = terrainAt(terrain, aX);
    const ph = phaseRef.current;

    ctx.clearRect(0, 0, ww, hh);
    drawSky(ctx, ww, hh, isDark);
    drawTerrain(ctx, terrain, ww, hh, isDark);

    // Net at center
    drawNet(ctx, ww / 2, terrain, isDark);

    // Player tank
    drawTank(ctx, pX, pGY, angleRef.current, powerRef.current, true, isDark,
      ph === "player-aim", terrain);

    // AI tank
    drawTank(ctx, aX, aGY, angleRef.current, powerRef.current, false, isDark,
      false, terrain);

    // Ball
    drawBallInFlight(ctx, ballRef.current);

    // Explosions
    drawExplosions(ctx, explosionsRef.current);

    // AI think bubbles
    if (ph === "ai-think") {
      const elapsed = Date.now() - aiThinkTimer.current;
      const dots = ".".repeat((Math.floor(elapsed / 300) % 3) + 1);
      ctx.fillStyle = isDark ? "#fff" : "#333";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(dots, aX, aGY - TANK_H - 20);
    }

    // Power bar (during aiming)
    if (ph === "player-aim") {
      const barX = pX - 30, barY = pGY - TANK_H - 35;
      const barW = 60, barH = 6;
      ctx.fillStyle = isDark ? "#333" : "#ccc";
      ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 3); ctx.fill();
      ctx.fillStyle = `hsl(${120 - powerRef.current * 120}, 80%, 50%)`;
      ctx.beginPath(); ctx.roundRect(barX, barY, barW * powerRef.current, barH, 3); ctx.fill();
    }

    // Round message
    if (roundMsgRef.current) {
      ctx.globalAlpha = Math.min(1, roundMsgTimer.current / 20);
      ctx.fillStyle = isDark ? "#fff" : "#333";
      ctx.font = "bold 18px serif";
      ctx.textAlign = "center";
      ctx.fillText(roundMsgRef.current, ww / 2, hh / 2);
      ctx.globalAlpha = 1;
    }
  }, []);

  // ── Animation loop ────────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    const ph = phaseRef.current;
    if (ph === "menu" || ph === "game-over") { render(); return; }

    const terrain = terrainRef.current;
    const ww = W();

    // Update ball flight
    if ((ph === "player-fire" || ph === "ai-fire") && ballRef.current.active) {
      const b = ballRef.current;
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 12) b.trail.shift();

      b.x  += b.vx;
      b.y  += b.vy;
      b.vy += GRAVITY;
      b.vx += windRef.current * 0.004;

      // Wall bounce
      if (b.x < BALL_R) { b.x = BALL_R; b.vx = Math.abs(b.vx) * 0.85; b.bounces++; }
      if (b.x > ww - BALL_R) { b.x = ww - BALL_R; b.vx = -Math.abs(b.vx) * 0.85; b.bounces++; }

      // Terrain bounce
      const ty = terrainAt(terrain, b.x);
      if (b.y + BALL_R >= ty) {
        b.y  = ty - BALL_R;
        b.vy = -b.vy * 0.55;
        b.vx *=  0.80;
        b.bounces++;
        if (Math.abs(b.vy) < 1) { b.active = false; } // ball stopped
      }

      // Max bounces
      if (b.bounces >= MAX_BOUNCE) { b.active = false; }

      // Out of canvas top
      if (b.y < -200) { b.active = false; }

      // Hit detection
      if (b.active) {
        const pX = playerXRef.current;
        const aX = aiXRef.current;
        const pGY = terrainAt(terrain, pX);
        const aGY = terrainAt(terrain, aX);

        if (ph === "player-fire") {
          const dist = Math.hypot(b.x - aX, b.y - (aGY - TANK_H / 2));
          if (dist < TANK_W * 0.75) {
            // Player scores!
            b.active = false;
            explosionsRef.current.push({ x: aX, y: aGY - TANK_H, r: 40, life: 30, maxLife: 30 });
            playerScRef.current++;
            setUPS(playerScRef.current);
            roundMsgRef.current = "You scored!";
            roundMsgTimer.current = 0;
            if (playerScRef.current >= WIN_SCORE) {
              setPhaseB("game-over");
            } else {
              setPhaseB("round-end");
            }
          }
        } else if (ph === "ai-fire") {
          const dist = Math.hypot(b.x - pX, b.y - (pGY - TANK_H / 2));
          if (dist < TANK_W * 0.75) {
            // AI scores!
            b.active = false;
            explosionsRef.current.push({ x: pX, y: pGY - TANK_H, r: 40, life: 30, maxLife: 30 });
            aiScRef.current++;
            setUAS(aiScRef.current);
            roundMsgRef.current = "AI scored!";
            roundMsgTimer.current = 0;
            if (aiScRef.current >= WIN_SCORE) {
              setPhaseB("game-over");
            } else {
              setPhaseB("round-end");
            }
          }
        }
      }

      // Ball gone with no hit → next turn
      const currentPh = phaseRef.current;
      if (!b.active && currentPh !== "round-end" && currentPh !== "game-over") {
        if (currentPh === "player-fire") {
          startAiTurn();
        } else if (currentPh === "ai-fire") {
          setPhaseB("player-aim");
          windRef.current = (Math.random() - 0.5) * 8;
          setUiWind(Math.round(windRef.current * 10) / 10);
        }
      }
    }

    // Round end: advance after brief pause
    if (ph === "round-end") {
      roundMsgTimer.current++;
      if (roundMsgTimer.current > 90) {
        roundMsgRef.current = "";
        roundMsgTimer.current = 0;
        if (phaseRef.current !== "game-over") {
          startAiTurn();
        }
      }
    }

    // AI think → fire
    if (ph === "ai-think") {
      const elapsed = Date.now() - aiThinkTimer.current;
      if (elapsed > 1800) {
        fireAiShot();
      }
    }

    // Update explosions
    explosionsRef.current = explosionsRef.current
      .map(e => ({ ...e, life: e.life - 1 }))
      .filter(e => e.life > 0);

    render();
    rafRef.current = requestAnimationFrame(loop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  // ── AI logic ──────────────────────────────────────────────────────────────────
  const startAiTurn = () => {
    windRef.current = (Math.random() - 0.5) * 8;
    setUiWind(Math.round(windRef.current * 10) / 10);
    setPhaseB("ai-think");
    aiThinkTimer.current = Date.now();
  };

  const fireAiShot = () => {
    const terrain = terrainRef.current;
    const aX = aiXRef.current;
    const pX = playerXRef.current;
    const aGY = terrainAt(terrain, aX);
    const sy = aGY - TANK_H - 2;

    // Find best angle by simulation
    let bestAngle = 45 * Math.PI / 180;
    let bestDist  = Infinity;
    const testPower = (6 + Math.random() * 8) * MAX_POWER / 18;

    for (let deg = 10; deg <= 80; deg += 3) {
      const a = deg * Math.PI / 180;
      const vx = -Math.cos(a) * testPower; // AI fires left
      const vy = -Math.sin(a) * testPower;
      const lx = simulateLanding(aX, sy, vx, vy, windRef.current);
      const d  = Math.abs(lx - pX);
      if (d < bestDist) { bestDist = d; bestAngle = a; }
    }

    // Add some error
    bestAngle += (Math.random() - 0.5) * (20 * Math.PI / 180);
    bestAngle  = Math.max(10 * Math.PI / 180, Math.min(80 * Math.PI / 180, bestAngle));
    const actualPower = testPower * (0.85 + Math.random() * 0.3);

    const vx = -Math.cos(bestAngle) * actualPower;
    const vy = -Math.sin(bestAngle) * actualPower;

    ballRef.current = { x: aX, y: sy, vx, vy, bounces: 0, active: true, trail: [] };
    setPhaseB("ai-fire");
  };

  // ── Player fire ───────────────────────────────────────────────────────────────
  const playerFire = useCallback(() => {
    if (phaseRef.current !== "player-aim") return;
    const terrain = terrainRef.current;
    const pX  = playerXRef.current;
    const pGY = terrainAt(terrain, pX);
    const sy  = pGY - TANK_H - 2;
    const p   = powerRef.current * MAX_POWER;
    const a   = angleRef.current;
    const vx  = Math.cos(a) * p;
    const vy  = -Math.sin(a) * p;
    ballRef.current = { x: pX, y: sy, vx, vy, bounces: 0, active: true, trail: [] };
    setPhaseB("player-fire");
  }, []);

  // ── Start game ────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const ww = W(), hh = H();
    seedRef.current = Math.random() * 100;
    terrainRef.current = makeTerrain(ww, hh, seedRef.current);
    playerXRef.current = Math.round(ww * 0.12);
    aiXRef.current     = Math.round(ww * 0.88);
    playerScRef.current = 0;
    aiScRef.current     = 0;
    angleRef.current    = 40 * Math.PI / 180;
    powerRef.current    = 0.5;
    chargingRef.current = false;
    ballRef.current     = { x: 0, y: 0, vx: 0, vy: 0, bounces: 0, active: false, trail: [] };
    explosionsRef.current = [];
    roundMsgRef.current  = "";
    windRef.current      = (Math.random() - 0.5) * 6;
    setUPS(0); setUAS(0);
    setUiAngle(40); setUiPower(50);
    setUiWind(Math.round(windRef.current * 10) / 10);
    setSubed(false); setPname("");
    setPhaseB("player-aim");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (phaseRef.current !== "player-aim") return;
      if (e.key === "ArrowUp") {
        angleRef.current = Math.min(85 * Math.PI / 180, angleRef.current + 3 * Math.PI / 180);
        setUiAngle(Math.round(angleRef.current * 180 / Math.PI));
      }
      if (e.key === "ArrowDown") {
        angleRef.current = Math.max(5 * Math.PI / 180, angleRef.current - 3 * Math.PI / 180);
        setUiAngle(Math.round(angleRef.current * 180 / Math.PI));
      }
      if ((e.key === " " || e.code === "Space") && !chargingRef.current) {
        chargingRef.current = true;
        chargeStart.current = Date.now();
        e.preventDefault();
      }
      if (e.key === "Enter") startGame();
    };
    const onUp = (e: KeyboardEvent) => {
      if (phaseRef.current !== "player-aim") return;
      if ((e.key === " " || e.code === "Space") && chargingRef.current) {
        chargingRef.current = false;
        playerFire();
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [playerFire, startGame]);

  // ── Power charge tick ─────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (!chargingRef.current) return;
      const elapsed = (Date.now() - chargeStart.current) / 2000; // 2 sec to full
      const p = Math.min(1, elapsed);
      powerRef.current = p;
      setUiPower(Math.round(p * 100));
    }, 30);
    return () => clearInterval(id);
  }, []);

  // ── Canvas resize ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const c = cvsRef.current;
      if (!c) return;
      const parent = c.parentElement;
      if (!parent) return;
      const w = Math.min(parent.clientWidth, 900);
      const h = Math.round(w * 0.5);
      c.width = w; c.height = h;
      cwRef.current = w; chRef.current = h;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Draw menu/gameover static ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "menu" && phase !== "game-over") return;
    const c = cvsRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const isDark = document.documentElement.classList.contains("dark");
    const ww = W(), hh = H();
    if (terrainRef.current.length === 0) {
      terrainRef.current = makeTerrain(ww, hh, seedRef.current);
      playerXRef.current = Math.round(ww * 0.12);
      aiXRef.current     = Math.round(ww * 0.88);
    }
    const terrain = terrainRef.current;
    drawSky(ctx, ww, hh, isDark);
    drawTerrain(ctx, terrain, ww, hh, isDark);
    drawNet(ctx, ww / 2, terrain, isDark);
    drawTank(ctx, playerXRef.current, terrainAt(terrain, playerXRef.current),
      40 * Math.PI / 180, 0.5, true, isDark, false, terrain);
    drawTank(ctx, aiXRef.current, terrainAt(terrain, aiXRef.current),
      40 * Math.PI / 180, 0.5, false, isDark, false, terrain);
  }, [phase]);

  // ── Cleanup ───────────────────────────────────────────────────────────────────
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // ── Leaderboard ───────────────────────────────────────────────────────────────
  const fetchLb = useCallback(async () => {
    setLbLoad(true);
    try {
      const r = await fetch("/api/tennistanks-leaderboard");
      const d = await r.json();
      setLb(d.entries ?? []);
    } catch { setLb([]); } finally { setLbLoad(false); }
  }, []);

  useEffect(() => { fetchLb(); }, [fetchLb]);

  const submitScore = useCallback(async () => {
    if (!pname.trim() || submitting) return;
    setSub(true);
    const score = playerScRef.current;
    try {
      await fetch("/api/tennistanks-leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pname.trim(), score }),
      });
      setSubed(true);
      await fetchLb();
    } catch { /* silent */ } finally { setSub(false); }
  }, [pname, submitting, fetchLb]);

  // ── Angle slider ──────────────────────────────────────────────────────────────
  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deg = parseInt(e.target.value);
    angleRef.current = deg * Math.PI / 180;
    setUiAngle(deg);
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  const isGameOver = phase === "game-over";
  const playerWon  = playerScRef.current >= WIN_SCORE;

  return (
    <div>
      <section className='relative px-8 md:px-16 pt-28 pb-3 md:pt-32 overflow-hidden'>
        <p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2'>
          Game
        </p>
        <h1 className='font-display text-4xl font-light'>Tennis Tanks</h1>
      </section>

      <div className='flex flex-col lg:flex-row gap-6 px-3 md:px-8 pb-6 md:pb-16 items-start justify-center'>
        {/* Canvas area */}
        <div className='flex-1 min-w-0 flex flex-col items-center'>
          {/* Score HUD */}
          {phase !== 'menu' && (
            <div className='w-full flex items-center justify-between px-1 mb-2'>
              <div className='flex items-center gap-2'>
                <span className='font-mono text-[10px] text-blue-500 uppercase tracking-widest'>
                  You
                </span>
                <span className='font-mono text-sm font-bold text-blue-400 tabular-nums'>
                  {uiPlayerSc}
                </span>
              </div>
              <div className='text-center'>
                <span className='font-mono text-[9px] text-muted-foreground uppercase tracking-widest'>
                  {uiWind !== 0 &&
                    `Wind ${uiWind > 0 ? '→' : '←'} ${Math.abs(uiWind).toFixed(1)}`}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-mono text-sm font-bold text-orange-400 tabular-nums'>
                  {uiAiSc}
                </span>
                <span className='font-mono text-[10px] text-orange-500 uppercase tracking-widest'>
                  AI
                </span>
              </div>
            </div>
          )}

          <div className='relative w-full'>
            <canvas
              ref={cvsRef}
              className='w-full rounded-xl border border-border select-none'
            />

            {/* Menu overlay */}
            {phase === 'menu' && (
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-xl bg-background/75 backdrop-blur-sm'>
                <div className='text-center'>
                  <p className='font-display text-5xl font-light text-primary italic'>
                    Tennis Tanks
                  </p>
                  <p className='font-mono text-[10px] text-muted-foreground mt-2'>
                    aim, charge, fire — first to {WIN_SCORE} wins
                  </p>
                </div>
                <div className='text-center space-y-1.5 px-6'>
                  <p className='font-mono text-[10px] text-muted-foreground'>
                    ↑ / ↓ arrows to adjust angle
                  </p>
                  <p className='font-mono text-[10px] text-muted-foreground'>
                    Hold Space to charge power, release to fire
                  </p>
                  <p className='font-mono text-[10px] text-muted-foreground'>
                    Ball bounces off walls &amp; terrain — watch the wind!
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className='px-8 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:opacity-90 transition-opacity'
                >
                  Play
                </button>
              </div>
            )}

            {/* Game over overlay */}
            {isGameOver && (
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/85 backdrop-blur-sm px-6'>
                <p className='font-display text-3xl font-light'>
                  {playerWon ? 'You Won!' : 'AI Won'}
                </p>
                <div className='flex items-center gap-6'>
                  <div className='text-center'>
                    <p className='font-mono text-2xl font-bold text-blue-400'>
                      {uiPlayerSc}
                    </p>
                    <p className='font-mono text-[9px] text-muted-foreground mt-0.5'>
                      You
                    </p>
                  </div>
                  <p className='font-mono text-muted-foreground'>–</p>
                  <div className='text-center'>
                    <p className='font-mono text-2xl font-bold text-orange-400'>
                      {uiAiSc}
                    </p>
                    <p className='font-mono text-[9px] text-muted-foreground mt-0.5'>
                      AI
                    </p>
                  </div>
                </div>
                {!submitted ? (
                  <div className='w-full space-y-2'>
                    <input
                      type='text'
                      placeholder='Your name'
                      maxLength={30}
                      value={pname}
                      onChange={(e) => setPname(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitScore()}
                      className='w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center font-mono'
                    />
                    <button
                      onClick={submitScore}
                      disabled={submitting || !pname.trim()}
                      className='w-full py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity'
                    >
                      {submitting ? 'Saving...' : 'Save score'}
                    </button>
                  </div>
                ) : (
                  <p className='font-mono text-xs text-primary'>
                    ✓ Score saved!
                  </p>
                )}
                <button
                  onClick={startGame}
                  className='w-full py-2 rounded-xl border border-border font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-all'
                >
                  Play again
                </button>
              </div>
            )}
          </div>

          {/* Controls panel */}
          {phase === 'player-aim' && (
            <div className='mt-4 w-full bg-card border border-border rounded-xl p-4 space-y-3'>
              <div className='flex items-center gap-4'>
                <span className='font-mono text-[10px] text-muted-foreground w-16 shrink-0'>
                  Angle
                </span>
                <input
                  type='range'
                  min={5}
                  max={85}
                  value={uiAngle}
                  onChange={handleAngleChange}
                  className='flex-1 accent-primary'
                />
                <span className='font-mono text-xs tabular-nums w-8 text-right'>
                  {uiAngle}°
                </span>
              </div>
              <div className='flex items-center gap-4'>
                <span className='font-mono text-[10px] text-muted-foreground w-16 shrink-0'>
                  Power
                </span>
                <div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full rounded-full transition-all'
                    style={{
                      width: `${uiPower}%`,
                      background: `hsl(${120 - uiPower * 1.2}, 80%, 50%)`,
                    }}
                  />
                </div>
                <span className='font-mono text-xs tabular-nums w-8 text-right'>
                  {uiPower}%
                </span>
              </div>
              <p className='font-mono text-[10px] text-muted-foreground text-center'>
                Hold{' '}
                <kbd className='px-1 py-0.5 border border-border rounded text-[9px]'>
                  Space
                </kbd>{' '}
                to charge · Release to fire
              </p>
            </div>
          )}

          {phase === 'ai-think' && (
            <div className='mt-4 w-full bg-card border border-border rounded-xl p-3 text-center'>
              <p className='font-mono text-[10px] text-muted-foreground'>
                AI is aiming...
              </p>
            </div>
          )}

          {phase === 'player-fire' && (
            <div className='mt-4 w-full bg-card border border-border rounded-xl p-3 text-center'>
              <p className='font-mono text-[10px] text-muted-foreground'>
                Ball in flight...
              </p>
            </div>
          )}

          {phase === 'ai-fire' && (
            <div className='mt-4 w-full bg-card border border-border rounded-xl p-3 text-center'>
              <p className='font-mono text-[10px] text-orange-400'>Incoming!</p>
            </div>
          )}

          {/* Mobile controls */}
          {phase === 'player-aim' && (
            <div className='mt-3 flex gap-2 w-full'>
              <button
                onPointerDown={() => {
                  const id = setInterval(() => {
                    angleRef.current = Math.min(
                      (85 * Math.PI) / 180,
                      angleRef.current + (3 * Math.PI) / 180,
                    );
                    setUiAngle(Math.round((angleRef.current * 180) / Math.PI));
                  }, 80);
                  const stop = () => clearInterval(id);
                  window.addEventListener('pointerup', stop, { once: true });
                  window.addEventListener('pointercancel', stop, {
                    once: true,
                  });
                }}
                className='flex-1 h-12 rounded-xl border border-border bg-card font-mono text-xs text-muted-foreground active:bg-primary/10 active:text-primary touch-manipulation'
              >
                Angle ↑
              </button>
              <button
                onPointerDown={() => {
                  const id = setInterval(() => {
                    angleRef.current = Math.max(
                      (5 * Math.PI) / 180,
                      angleRef.current - (3 * Math.PI) / 180,
                    );
                    setUiAngle(Math.round((angleRef.current * 180) / Math.PI));
                  }, 80);
                  const stop = () => clearInterval(id);
                  window.addEventListener('pointerup', stop, { once: true });
                  window.addEventListener('pointercancel', stop, {
                    once: true,
                  });
                }}
                className='flex-1 h-12 rounded-xl border border-border bg-card font-mono text-xs text-muted-foreground active:bg-primary/10 active:text-primary touch-manipulation'
              >
                Angle ↓
              </button>
              <button
                onPointerDown={() => {
                  chargingRef.current = true;
                  chargeStart.current = Date.now();
                }}
                onPointerUp={() => {
                  if (chargingRef.current) {
                    chargingRef.current = false;
                    playerFire();
                  }
                }}
                onPointerCancel={() => {
                  chargingRef.current = false;
                }}
                className='flex-[2] h-12 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide active:opacity-80 touch-manipulation'
              >
                Hold to charge · Release to fire
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className='w-full lg:w-64 shrink-0'>
          <div className='border border-border rounded-xl bg-card p-5'>
            <div className='flex items-center justify-between mb-4'>
              <p className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground'>
                Leaderboard
              </p>
              <button
                onClick={fetchLb}
                className='font-mono text-[9px] text-muted-foreground/50 hover:text-muted-foreground transition-colors'
              >
                refresh
              </button>
            </div>
            <p className='font-mono text-[9px] text-muted-foreground/50 mb-3'>
              score = points scored
            </p>
            {lbLoad ? (
              <div className='space-y-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-8 bg-muted animate-pulse rounded-lg'
                  />
                ))}
              </div>
            ) : lb.length === 0 ? (
              <p className='font-mono text-[10px] text-muted-foreground/50 text-center py-4'>
                No scores yet.
                <br />
                Be the first!
              </p>
            ) : (
              <div className='space-y-1.5'>
                {lb.map((e, i) => (
                  <div
                    key={e.id}
                    className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${i === 0 ? 'bg-primary/10' : ''}`}
                  >
                    <span
                      className={`font-mono text-[10px] w-4 text-right shrink-0 ${i === 0 ? 'text-primary font-bold' : 'text-muted-foreground/40'}`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-xs font-medium flex-1 truncate ${i === 0 ? 'text-primary' : 'text-foreground'}`}
                    >
                      {e.name}
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums shrink-0 ${i === 0 ? 'text-primary font-bold' : 'text-foreground'}`}
                    >
                      {e.score}
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
