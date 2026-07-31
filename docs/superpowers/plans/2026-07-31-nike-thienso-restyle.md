# Nike / thien.so Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the existing thien.me coaching site in the Nike / thien.so visual language (monochrome + royal-blue accent, Bebas Neue condensed headlines, sticky top nav + mobile tab bar) without changing any content, route, or functionality.

**Architecture:** A skin swap in three layers. (1) The token layer — `app/globals.css` + `tailwind.config.ts` — is rewritten to the new palette/fonts/motion. (2) The nav shell — a new sticky top nav and mobile bottom tab bar replace the left sidebar; `layout.tsx` is rewired. (3) Every page and shared component gets a class-level restyle applying one documented set of shared patterns. Data access, API routes, MDX content, and copy are untouched.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS v3, lucide-react, next/font not used (fonts via Google Fonts `@import`), TypeScript.

## Global Constraints

- **No new npm dependencies.** Bebas Neue loads via the existing Google Fonts `@import` in `app/globals.css`; the logo is a static asset.
- **Do not touch** `app/api/**`, `lib/**`, MDX content under `content/**` or `app/blog/[slug]`, or any user-facing copy. Presentation only.
- **No routes added or removed.** Every existing page must still render with original content and behavior.
- **Accent blue:** `#1f5fd8` → HSL `219 75% 48%`. Use `--primary` for it everywhere; never hardcode the hex in JSX (except where a raw brand color already exists, e.g. Venmo `#3D95CE`, tennis-ball `#c8e03c`).
- **Verification per task:** `npm run build` must succeed with no new TypeScript/lint errors. Where a task changes visible layout, also note the dev-server visual check. There is no unit-test framework in this repo — do not invent one.
- **Commit after every task** with a `style:` or `feat:`/`refactor:` prefix and the Co-Authored-By trailer:
  ```
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  ```
- Work happens on branch `restyle-nike-thienso` (already created).

## Shared Restyle Patterns (referenced by every page/component task)

Apply these substitutions consistently. When a task says "apply the shared patterns," it means this glossary:

- **Eyebrow label:** `font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground`
- **Big heading:** `font-heading uppercase leading-[0.9] tracking-[0.01em]` at `text-4xl md:text-6xl` (section headings) or larger for page titles. Remove `font-display`, `font-light`, and `italic` serif treatments.
- **Primary button (pill, solid blue):**
  `inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90`
- **Secondary button (pill, invert on hover):**
  `inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background`
- **Card:** `rounded-md border border-border bg-card transition-colors hover:border-primary/50` (hard-ish edges, thin border, blue hover). Drop warm-gold hover tints.
- **Link accent:** hover/active color → `text-primary` (was gold/primary already, but now blue via token).
- **Section rhythm:** keep existing `content-wrap` + `px-8 md:px-16 py-16 md:py-24`.
- **Apple motion:** add `ease-[cubic-bezier(0.32,0.72,0,1)]` to notable hover/reveal transitions where a task calls for it.

Do **not** change text content, `href`s, data fetching, or component props anywhere.

---

### Task 1: Token layer — fonts, palette, motion

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: `--font-heading` CSS var + `font-heading` Tailwind family; blue `--primary` (`219 75% 48%`); `--ease-apple`; `.prose-thien` headings in Bebas. All later tasks consume `font-heading`, `text-primary`, `bg-primary`, `border-border`, `text-muted-foreground`.

- [ ] **Step 1: Update the Google Fonts import** in `app/globals.css` — add Bebas Neue, keep DM Sans + DM Mono, drop Cormorant. Replace the existing `@import url("https://fonts.googleapis.com/...")` line with:

```css
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap");
```

- [ ] **Step 2: Replace the `:root` font + color vars** in `app/globals.css`. Replace the existing `:root { ... }` block with:

```css
:root {
  --font-heading: "Bebas Neue", "DM Sans", system-ui, sans-serif;
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-mono: "DM Mono", monospace;

  --background: 0 0% 100%;
  --foreground: 240 6% 7%;
  --card: 0 0% 100%;
  --card-foreground: 240 6% 7%;
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --primary: 219 75% 48%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 96%;
  --secondary-foreground: 240 6% 7%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 42%;
  --accent: 0 0% 96%;
  --accent-foreground: 240 6% 7%;
  --ring: 219 75% 48%;
  --radius: 0.5rem;

  --ease-apple: cubic-bezier(0.32, 0.72, 0, 1);
}
```

- [ ] **Step 3: Retire the serif `font-display` utility.** In `app/globals.css`, replace:

```css
.font-display { font-family: var(--font-display); }
.font-mono    { font-family: var(--font-mono); }
```

with:

```css
.font-heading { font-family: var(--font-heading); letter-spacing: 0.01em; }
.font-mono    { font-family: var(--font-mono); }
```

- [ ] **Step 4: Swap `.prose-thien` serif headings to Bebas.** In `app/globals.css`, in the `.prose-thien h2` and `.prose-thien h3` rules, change `font-family: var(--font-display);` to `font-family: var(--font-heading);` and add `text-transform: uppercase;` to each; change their `font-weight` to `400`. Leave all other prose rules unchanged.

- [ ] **Step 5: Update `tailwind.config.ts` fonts.** Replace the `fontFamily` block:

```ts
      fontFamily: {
        sans:    ["DM Sans", "system-ui", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
        heading: ["Bebas Neue", "DM Sans", "sans-serif"],
      },
```

- [ ] **Step 6: Add pill radius + apple ease to Tailwind theme.** In `tailwind.config.ts`, inside `theme.extend`, add:

```ts
      transitionTimingFunction: {
        apple: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
```
(Keep the existing `borderRadius`, `colors`, `keyframes`, `animation`.)

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: Build succeeds. (Warm-gold and Cormorant are now gone globally; pages will look monochrome even before per-page work.)

- [ ] **Step 8: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "$(printf 'style: rewrite token layer to monochrome + blue, Bebas Neue\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 2: Favicon + apple-icon from modern-logo.png

**Files:**
- Create: `app/icon.png` (copied from `~/Desktop/modern-logo.png`)
- Delete: `app/icon.svg`
- Modify: `app/apple-icon.tsx`

**Interfaces:**
- Produces: App-Router favicon (`app/icon.png`) and Apple touch icon rendering the logo.

- [ ] **Step 1: Copy the logo into the app**

```bash
cp ~/Desktop/modern-logo.png app/icon.png
```

- [ ] **Step 2: Remove the old SVG favicon**

```bash
git rm app/icon.svg
```

- [ ] **Step 3: Rewrite `app/apple-icon.tsx`** to render the logo on a white field. Replace the whole file with:

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logo = await readFile(join(process.cwd(), "app/icon.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={148} height={148} alt="" style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds; `/icon.png` and `/apple-icon` are emitted. Confirm in browser dev tools the tab favicon is the logo after `npm run dev`.

- [ ] **Step 5: Commit**

```bash
git add app/icon.png app/apple-icon.tsx
git commit -m "$(printf 'feat: use modern-logo.png as favicon and apple icon\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 3: New nav items module

**Files:**
- Create: `components/nav-items.tsx`

**Interfaces:**
- Produces: `NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[]` consumed by Tasks 4 and 5.

- [ ] **Step 1: Create `components/nav-items.tsx`**

```tsx
import { Home, BookOpen, Quote, CalendarCheck, CircleDollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: BookOpen },
  { href: "/testimonials", label: "Reviews", icon: Quote },
  { href: "/booking", label: "Bookings", icon: CalendarCheck },
  { href: "/pricing", label: "Pricing", icon: CircleDollarSign },
];
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds (module unused yet — that's fine).

- [ ] **Step 3: Commit**

```bash
git add components/nav-items.tsx
git commit -m "$(printf 'feat: shared nav items module\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 4: Sticky top nav

**Files:**
- Create: `components/site-nav.tsx`

**Interfaces:**
- Consumes: `NAV_ITEMS` from `components/nav-items.tsx`.
- Produces: `SiteNav` default-exported React component (client). Consumed by Task 5 (`layout.tsx`).

- [ ] **Step 1: Create `components/site-nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { NAV_ITEMS } from "./nav-items";
import logo from "../app/icon.png";

export function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-border bg-background/90 backdrop-blur-md">
      {/* Desktop */}
      <div className="mx-auto hidden h-16 max-w-5xl items-center justify-between px-8 md:flex md:px-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="thien.me" width={26} height={26} className="h-6 w-auto" priority />
          <span className="font-heading text-2xl leading-none tracking-[0.02em]">THIEN</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "border-b-2 pb-0.5 text-[11px] font-bold uppercase tracking-[0.06em] transition-colors",
                isActive(item.href)
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="rounded-full bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book
          </Link>
        </nav>
      </div>
      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between px-5 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="thien.me" width={24} height={24} className="h-6 w-auto" priority />
          <span className="font-heading text-xl leading-none tracking-[0.02em]">THIEN</span>
        </Link>
        <Link
          href="/booking"
          className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-primary-foreground"
        >
          Book
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds. (Importing a PNG as a static import requires `app/icon.png` to exist — Task 2 created it.)

- [ ] **Step 3: Commit**

```bash
git add components/site-nav.tsx
git commit -m "$(printf 'feat: sticky top nav in Nike/thien.so style\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 5: Mobile bottom tab bar

**Files:**
- Create: `components/tab-bar.tsx`

**Interfaces:**
- Consumes: `NAV_ITEMS`.
- Produces: `TabBar` component. Consumed by Task 6 (`layout.tsx`).

- [ ] **Step 1: Create `components/tab-bar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { NAV_ITEMS } from "./nav-items";

export function TabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-[60] flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur-md md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-2 text-[9px] font-bold uppercase tracking-[0.04em]",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.25 : 1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/tab-bar.tsx
git commit -m "$(printf 'feat: mobile bottom tab bar\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 6: Wire the nav shell into layout; remove sidebar

**Files:**
- Modify: `app/layout.tsx`
- Delete: `components/sidebar.tsx`
- Modify: `app/globals.css` (remove `.sidebar-link` rules; add mobile bottom padding)

**Interfaces:**
- Consumes: `SiteNav` (Task 4), `TabBar` (Task 5), existing `Footer`.

- [ ] **Step 1: Rewrite the `RootLayout` body** in `app/layout.tsx`. Replace the imports for `Sidebar`/`Footer` and the `<body>` markup. New imports:

```tsx
import { SiteNav } from "@/components/site-nav";
import { TabBar } from "@/components/tab-bar";
import { Footer } from "@/components/footer";
```

New `<body>` (keep the existing `<head>` block unchanged):

```tsx
      <body>
        <SiteNav />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <TabBar />
      </body>
```

- [ ] **Step 2: Delete the sidebar component**

```bash
git rm components/sidebar.tsx
```

- [ ] **Step 3: Remove `.sidebar-link` rules and add mobile tab-bar clearance** in `app/globals.css`. Delete the two `.sidebar-link` / `.sidebar-link.active` rules. Append:

```css
/* Clear the fixed mobile tab bar */
@media (max-width: 767px) {
  body { padding-bottom: 76px; }
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Succeeds with no unresolved import of `Sidebar`. If any other file imports `@/components/sidebar`, grep and remove those imports (there should be none outside `layout.tsx`).

Run: `grep -rn "components/sidebar" app components` → Expected: no results.

- [ ] **Step 5: Visual check**

Run `npm run dev`; confirm desktop shows the sticky top nav (no left offset/whitespace gap) and mobile (<768px) shows the bottom tab bar. The old `md:ml-56` gap must be gone.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "$(printf 'feat: replace sidebar with top nav + tab bar shell\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 7: Footer — logo mark + restyle

**Files:**
- Modify: `components/footer.tsx`

- [ ] **Step 1: Replace the `PetalMark` SVG with the logo image and restyle.** In `components/footer.tsx`: remove the entire `PetalMark` function; add `import Image from "next/image";` and `import logo from "../app/icon.png";` at the top. Replace the bottom-row petal `<span>` that renders `<PetalMark size={18} />` with:

```tsx
          <span className="text-muted-foreground" aria-hidden="true">
            <Image src={logo} alt="" width={22} height={22} className="h-[22px] w-auto opacity-70" />
          </span>
```

- [ ] **Step 2: Restyle the footer nav links to the new mono/uppercase style** (already mono; ensure blue hover). The existing link class `font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors` — change `hover:text-foreground` to `hover:text-primary`. Same for the site-name row if desired (leave as-is otherwise).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/footer.tsx
git commit -m "$(printf 'style: footer uses logo mark, blue link hover\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 8: Hero — restyle text layer (keep canvas)

**Files:**
- Modify: `components/hero.tsx`

- [ ] **Step 1: Restyle the hero text block only.** Do NOT touch the canvas/`useEffect`/ball logic or `#c8e03c`. In the returned JSX, replace the eyebrow, `<h1>`, and CTA:

Eyebrow `<p>` → keep text, class stays `font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-10 hero-item`.

Replace the `<h1>` block with:

```tsx
        <h1 className="font-heading uppercase leading-[0.9] mb-10">
          <span className="block text-[clamp(3.5rem,10vw,9rem)] text-foreground hero-item"
                style={{ animationDelay: "130ms" }}>Hey, I&apos;m</span>
          <span className="block text-[clamp(3.5rem,10vw,9rem)] text-primary hero-item"
                style={{ animationDelay: "260ms" }}>Thien.</span>
        </h1>
```

Replace the CTA `<Link>` class with the shared primary-button pill:

```tsx
          <Link href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Book a session
          </Link>
```

Leave the intro paragraph and its inline `<a>` links; just change their `hover:text-primary` (already primary — now blue via token). No other edits.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Visual check**

`npm run dev` → confirm the giant Bebas headline, blue "Thien.", pill CTA, and that clicking the hero still drops bouncing tennis balls.

- [ ] **Step 4: Commit**

```bash
git add components/hero.tsx
git commit -m "$(printf 'style: hero headline in Bebas, blue accent, pill CTA\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 9: Home page restyle

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Apply shared patterns to the home sections.** In `app/page.tsx`:
  - Each eyebrow `<p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8'>` — keep as-is (already matches).
  - Each section `<h2 className='font-display text-3xl md:text-4xl font-light text-foreground mb-...'>` → change to `className='font-heading uppercase text-4xl md:text-5xl leading-[0.9] text-foreground mb-...'` (keep the trailing `mb-*` value that's already there).
  - The "Read more →" link: change `text-primary hover:underline` — keep (blue now).
  - Contact buttons: the "Book a session" `<Link>` → make it the shared primary pill (`rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90`, keep the calendar `<svg>` child). The email and Venmo `<a>` icon buttons → `rounded-full` instead of `rounded-xl`, `border-border hover:border-primary/50 hover:text-primary` (Venmo keeps its `#3D95CE` hover). Keep all `href`s and SVGs.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "$(printf 'style: restyle home page sections\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 10: About + Coaching pages

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/coaching/page.tsx`

- [ ] **Step 1: Read both files**, then apply the Shared Restyle Patterns: eyebrows → mono label; every `font-display ... font-light` (and any `italic` serif) heading → `font-heading uppercase leading-[0.9]` at a comparable size (`text-4xl md:text-6xl` for page titles, `text-3xl md:text-4xl` for subsections); any buttons/CTAs → pill styles; any cards → the shared card class; gold/`primary` accents now read blue automatically. Do not change copy, images, or structure.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Visual check** `/about` and `/coaching` in dev.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx app/coaching/page.tsx
git commit -m "$(printf 'style: restyle about and coaching pages\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 11: Booking pages (index + 4 venues)

**Files:**
- Modify: `app/booking/page.tsx`
- Modify: `app/booking/twin/page.tsx`
- Modify: `app/booking/lakeridge/page.tsx`
- Modify: `app/booking/fern-park/page.tsx`
- Modify: `app/booking/farmington-valley/page.tsx`
- Possibly Modify: `components/cal-embed.tsx` (only wrapper/heading classes; do NOT change Cal config/theme logic)

- [ ] **Step 1: Read `app/booking/page.tsx` and the four venue pages.** Apply the Shared Restyle Patterns to headings (Bebas uppercase), eyebrows, venue cards/links (shared card class, `rounded-full` for any pill buttons), and CTAs. Keep every venue name, address, `href`, and the `<CalEmbed>` usage intact.

- [ ] **Step 2: Restyle `components/cal-embed.tsx` chrome only** — if it has a visible heading/wrapper, apply Bebas heading + spacing. Do NOT alter the Cal `calLink`, config object, or the `theme` baked into the iframe (per recent commit `cal-embed: bake theme into iframe config`).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Visual check** — load `/booking` and one venue page; confirm the Cal.com embed still loads and books.

- [ ] **Step 5: Commit**

```bash
git add app/booking components/cal-embed.tsx
git commit -m "$(printf 'style: restyle booking pages and cal embed chrome\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 12: Pricing page

**Files:**
- Modify: `app/pricing/page.tsx`

- [ ] **Step 1: Read the file** and apply Shared Restyle Patterns: Bebas uppercase headings, mono eyebrows, price cards → shared card class with `rounded-md` (Nike hard edges), primary pill CTAs, blue accents. Keep all prices, tiers, and copy.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/pricing/page.tsx
git commit -m "$(printf 'style: restyle pricing page\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 13: Movies + Music (+ spotify-widget, marquee-text)

**Files:**
- Modify: `app/movies/page.tsx`
- Modify: `app/music/page.tsx`
- Modify: `components/spotify-widget.tsx`
- Modify: `components/marquee-text.tsx`

- [ ] **Step 1: Read all four files.** Apply Shared Restyle Patterns. For the poster/album grids, tighten to a Nike-style tight-gap grid (`gap-[3px]` or `gap-1`) with hard corners and `hover:scale-[1.02] ease-[cubic-bezier(0.32,0.72,0,1)] duration-500` on images where a hover already exists. Headings → Bebas uppercase; eyebrows → mono. Do NOT change the TMDB/Spotify data fetching, `next/image` `remotePatterns` usage, or the EQ-bar / marquee animation logic (the `.spotify-bar` and `.marquee-running` keyframes stay).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Visual check** — `/movies` and `/music`; confirm posters/albums load and the Spotify EQ + marquee still animate.

- [ ] **Step 4: Commit**

```bash
git add app/movies/page.tsx app/music/page.tsx components/spotify-widget.tsx components/marquee-text.tsx
git commit -m "$(printf 'style: restyle movies and music with tight grids\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 14: Testimonials page, card, form, admin

**Files:**
- Modify: `app/testimonials/page.tsx`
- Modify: `components/testimonial-card.tsx`
- Modify: `components/testimonial-form.tsx`
- Modify: `app/admin/testimonials/page.tsx`
- Modify: `app/admin/testimonials/admin-client.tsx`

- [ ] **Step 1: Read the five files.** Apply Shared Restyle Patterns: Bebas uppercase headings, mono eyebrows, testimonial cards → shared card class, form inputs → `rounded-md border-border focus:border-primary focus:ring-primary`, submit buttons → primary pill, admin action buttons → pill styles. **Do NOT change** the honeypot field (recent commit renamed it to avoid autofill collisions), form field `name`s, the submit handler, or the admin approve/hide/delete logic and API calls.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Visual check** — `/testimonials` renders cards; the submit form validates and posts; `/admin/testimonials` still gates + lists (do not submit real changes unless intended).

- [ ] **Step 4: Commit**

```bash
git add app/testimonials components/testimonial-card.tsx components/testimonial-form.tsx app/admin
git commit -m "$(printf 'style: restyle testimonials, form, and admin\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 15: Blog (list + post) + blog-list + scroll reveal utilities

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `components/blog-list.tsx`
- Check only: `components/scroll-reveal.tsx`, `components/scroll-timeline.tsx` (restyle only if they emit visible chrome; their JS behavior stays)

- [ ] **Step 1: Read `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `components/blog-list.tsx`.** Apply Shared Restyle Patterns to list headings, post titles (Bebas uppercase), post-meta (mono), and list-item cards. The MDX body renders through `.prose-thien`, already updated in Task 1 — do not restyle rendered MDX inline. Do NOT change frontmatter parsing, `gray-matter`, `next-mdx-remote`, or routing.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Visual check** — `/blog` list and one `/blog/[slug]` post; confirm MDX renders with Bebas headings and blue code/accent.

- [ ] **Step 4: Commit**

```bash
git add app/blog components/blog-list.tsx components/scroll-reveal.tsx components/scroll-timeline.tsx
git commit -m "$(printf 'style: restyle blog list and posts\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 16: Final full-site verification

**Files:** none (verification only)

- [ ] **Step 1: Clean production build**

Run: `npm run build`
Expected: Succeeds with no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: No new errors introduced by this work.

- [ ] **Step 3: Grep for leftovers**

Run: `grep -rn "font-display\|Cormorant\|PetalMark\|components/sidebar" app components`
Expected: no results (serif and sidebar fully retired).

- [ ] **Step 4: Manual sweep in dev** (`npm run dev`) — visit `/`, `/about`, `/coaching`, `/testimonials`, `/booking` (+ one venue), `/pricing`, `/movies`, `/music`, `/blog` (+ one post). Confirm on each: sticky top nav (desktop) / bottom tab bar (mobile), Bebas uppercase headings, blue accent, logo favicon + footer mark, no warm-gold or serif, and all interactive bits (hero balls, Cal embed, Spotify EQ, testimonial form) still work.

- [ ] **Step 5: Commit any final fixups**, then the branch is ready for review/merge.

```bash
git commit -am "$(printf 'style: final restyle sweep fixups\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')" || echo "nothing to commit"
```

---

## Self-Review

**Spec coverage:**
- Token layer (fonts/colors/radius/motion) → Task 1 ✓
- Favicon + apple-icon → Task 2 ✓
- Top nav → Tasks 3+4 ✓; mobile tab bar → Task 5 ✓; sidebar removal + layout rewire → Task 6 ✓
- Hero restyle (keep canvas) → Task 8 ✓
- Footer logo mark → Task 7 ✓
- Every page/component restyle: home (9), about+coaching (10), booking+venues+cal (11), pricing (12), movies+music+spotify+marquee (13), testimonials+card+form+admin (14), blog+list+prose (15/Task 1) ✓
- `.prose-thien` headings → Task 1 Step 4 ✓
- Guardrails (no API/lib/content/copy changes) → Global Constraints, restated per task ✓
- Success criteria (build passes, routes intact, nav swap, Bebas, blue, favicon, hero works) → Task 16 ✓

**Placeholder scan:** Foundation tasks (1–8) carry complete code. Page tasks (9–15) use the documented Shared Restyle Patterns glossary as a concrete, DRY transformation applied per file — the implementer reads each file and applies named substitutions, which is the right granularity for a reskin (bespoke full-file rewrites would be noise). No "TBD"/"handle edge cases" left.

**Type consistency:** `NAV_ITEMS`/`NavItem` defined in Task 3, consumed identically in Tasks 4 & 5. `SiteNav`, `TabBar` named consistently in Tasks 4/5/6. `app/icon.png` created in Task 2, imported in Tasks 4 & 7. `font-heading`, `--primary`, `--ease-apple`/`ease-apple` defined in Task 1, used throughout.
