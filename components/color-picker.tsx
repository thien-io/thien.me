"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "thien-color";

const COLORS = [
  { name: "amber",      swatch: "hsl(27 58% 46%)"  },
  { name: "sage",       swatch: "hsl(150 40% 38%)" },
  { name: "ocean",      swatch: "hsl(210 60% 50%)" },
  { name: "rose",       swatch: "hsl(350 54% 50%)" },
  { name: "lavender",   swatch: "hsl(265 50% 55%)" },
  { name: "teal",       swatch: "hsl(178 48% 36%)" },
  { name: "terracotta", swatch: "hsl(17 58% 50%)"  },
] as const;

type ColorName = typeof COLORS[number]["name"];

export function ColorPicker() {
  const [active, setActive] = useState<ColorName>("amber");
  const [open, setOpen]     = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) ?? "amber") as ColorName;
    setActive(saved);
  }, []);

  function select(name: ColorName) {
    setActive(name);
    setOpen(false);
    document.documentElement.setAttribute("data-color", name);
    localStorage.setItem(STORAGE_KEY, name);
  }

  const activeColor = COLORS.find(c => c.name === active)!;

  return (
    <div className="relative">
      {/* Swatches popover */}
      {open && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 bg-card border border-border rounded-xl p-2 shadow-lg flex gap-1.5">
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => select(c.name)}
                title={c.name}
                aria-label={`${c.name} theme`}
                className={`w-5 h-5 rounded-full transition-all hover:scale-110 ${
                  active === c.name
                    ? "ring-2 ring-offset-2 ring-offset-card ring-foreground/40 scale-110"
                    : ""
                }`}
                style={{ background: c.swatch }}
              />
            ))}
          </div>
        </>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-8 h-8 flex items-center justify-center"
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
