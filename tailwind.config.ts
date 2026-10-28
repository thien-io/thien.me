import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans:    ["var(--font-ui)"],
        ui:      ["var(--font-ui)"],
        serif:   ["var(--font-serif)"],
        display: ["var(--font-serif)"],
        mono:    ["var(--font-ui)"],
      },
      colors: {
        paper:   "var(--paper)",
        surface: { DEFAULT: "var(--surface)", 2: "var(--surface-2)" },
        ink:     "var(--ink)",
        soft:    "var(--muted)",
        moss:    { DEFAULT: "var(--accent)", hover: "var(--accent-hover)" },
        field:   { DEFAULT: "var(--field)", 2: "var(--field-2)", 3: "var(--field-3)", ink: "var(--field-ink)" },
        ball:    "var(--ball)",

        // Legacy names used by the blog, admin and media pages
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted-hsl))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent-hsl))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.32, 0.72, 0, 1)",
        expo:  "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
