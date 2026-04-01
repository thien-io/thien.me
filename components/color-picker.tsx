"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "thien-color";

const COLORS = [
  { name: "amber",      swatch: "hsl(27 58% 46%)"  },
  { name: "gold",       swatch: "hsl(45 72% 44%)"  },
  { name: "beige",      swatch: "hsl(35 45% 52%)"  },
  { name: "copper",     swatch: "hsl(25 65% 46%)"  },
  { name: "terracotta", swatch: "hsl(17 58% 50%)"  },
  { name: "coral",      swatch: "hsl(12 68% 52%)"  },
  { name: "crimson",    swatch: "hsl(348 65% 46%)" },
  { name: "rose",       swatch: "hsl(350 54% 50%)" },
  { name: "mauve",      swatch: "hsl(320 38% 50%)" },
  { name: "lavender",   swatch: "hsl(265 50% 55%)" },
  { name: "plum",       swatch: "hsl(285 45% 46%)" },
  { name: "indigo",     swatch: "hsl(240 52% 54%)" },
  { name: "ocean",      swatch: "hsl(210 60% 50%)" },
  { name: "sky",        swatch: "hsl(200 68% 48%)" },
  { name: "steel",      swatch: "hsl(205 45% 44%)" },
  { name: "teal",       swatch: "hsl(178 48% 36%)" },
  { name: "mint",       swatch: "hsl(160 48% 40%)" },
  { name: "sage",       swatch: "hsl(150 40% 38%)" },
  { name: "forest",     swatch: "hsl(135 48% 34%)" },
  { name: "olive",      swatch: "hsl(75 45% 38%)"  },
  { name: "slate",      swatch: "hsl(215 28% 50%)" },
] as const;

type ColorName = typeof COLORS[number]["name"];

export function ColorPicker() {
  const [active,  setActive]  = useState<ColorName>("amber");
  const [open,    setOpen]    = useState(false);
  const [hovered, setHovered] = useState<ColorName | null>(null);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) ?? "amber") as ColorName;
    setActive(saved);
  }, []);

  function select(name: ColorName) {
    setActive(name);
    setOpen(false);
    setHovered(null);
    applyColor(name);
    localStorage.setItem(STORAGE_KEY, name);
  }

  function applyColor(name: ColorName) {
    document.documentElement.setAttribute("data-color", name);
  }

  function handleHoverEnter(name: ColorName) {
    setHovered(name);
    applyColor(name);
  }

  function handleHoverLeave() {
    setHovered(null);
    applyColor(active);
  }

  const previewColor = COLORS.find(c => c.name === (hovered ?? active))!;
  const activeColor  = COLORS.find(c => c.name === active)!;

  return (
    <div className="relative">
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); applyColor(active); setHovered(null); }} />
          <div className="absolute bottom-full mb-2 left-0 z-20 bg-card border border-border rounded-2xl p-3 shadow-xl"
            style={{ width: "220px" }}>

            {/* Preview strip */}
            <div className="flex items-center gap-2 mb-3 px-0.5">
              <div
                className="w-5 h-5 rounded-full ring-1 ring-black/10 shrink-0 transition-all duration-150"
                style={{ background: previewColor.swatch }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-all duration-150">
                {hovered ?? active}
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => select(c.name)}
                  onMouseEnter={() => handleHoverEnter(c.name)}
                  onMouseLeave={handleHoverLeave}
                  aria-label={`${c.name} theme`}
                  className={`w-7 h-7 rounded-full transition-all duration-100 hover:scale-125 ${
                    active === c.name
                      ? "ring-2 ring-offset-2 ring-offset-card ring-foreground/40 scale-110"
                      : ""
                  }`}
                  style={{ background: c.swatch }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all w-8 h-8 flex items-center justify-center"
        aria-label="Change accent color"
      >
        <div
          className="w-3.5 h-3.5 rounded-full ring-1 ring-border"
          style={{ background: activeColor.swatch }}
        />
      </button>
    </div>
  );
}
