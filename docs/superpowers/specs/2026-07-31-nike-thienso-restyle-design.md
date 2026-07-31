# Restyle thien.me in the Nike / thien.so visual language

**Date:** 2026-07-31
**Status:** Approved, ready for planning

## Goal

Reskin the existing thien.me tennis/pickleball coaching site to match the
visual language of nike.com and the sibling site thien.so, while keeping every
page, route, piece of content, and piece of functionality exactly as-is. This
is a **skin swap** at the design-system level — the token layer, the nav/layout
shell, and per-page class names change; data, logic, copy, and routes do not.

## Non-goals / guardrails

- No changes to API routes (`app/api/**`), Supabase/Spotify/TMDB logic, or
  `lib/**` data access.
- No changes to MDX blog content or any user-facing copy.
- No new pages or routes; no removed pages or routes.
- No new npm dependencies (Bebas Neue loads via the existing Google Fonts
  `@import`; the logo is a static asset).
- Pure presentation: JSX class names, the token layer, and the nav shell.

## Reference design DNA (from thien.so / nike.com)

- **Headlines:** Bebas Neue — tall, condensed, UPPERCASE, `leading-[0.9]`.
- **Body:** clean sans (DM Sans / system). Serif (Cormorant) retired.
- **Eyebrow labels:** tiny mono, `text-[10px]`, `tracking-[0.2em]`, uppercase.
- **Palette:** near-monochrome — near-black type on white — with a single
  accent (the logo's royal blue) on links, active nav, and the primary CTA.
- **Nav:** sticky top bar (wordmark + uppercase links + pill CTA) on desktop;
  fixed bottom icon tab bar on mobile.
- **Shapes:** pill buttons/nav (`999px`); hard-edged cards; Nike-style 3px-gap
  image grids.
- **Motion:** Apple easing `cubic-bezier(0.32, 0.72, 0, 1)`, ~500ms.

## Decisions (confirmed with user)

1. **Navigation:** replace the left sidebar with a sticky top nav + mobile
   bottom tab bar (authentic thien.so/Nike pattern).
2. **Headlines:** adopt Bebas Neue condensed caps; retire Cormorant serif.
3. **Color:** monochrome base + the logo's royal blue (~`#1f5fd8`) as the single
   accent.
4. **Hero:** keep the interactive bouncing-tennis-ball canvas; restyle only the
   surrounding text/CTA. Balls stay tennis-yellow.

## Design

### 1. Design tokens — `app/globals.css` + `tailwind.config.ts`

Rewrite the token layer, replacing the warm-gold palette:

- Fonts: add `Bebas Neue` to the Google Fonts import; expose as
  `--font-heading` and a `font-heading` utility (or Tailwind `fontFamily`
  entry). Keep DM Sans (`--font-sans`) and DM Mono (`--font-mono`). Remove
  Cormorant Garamond and the `font-display` serif usage.
- Colors (HSL vars, keeping the existing `hsl(var(--x))` Tailwind wiring):
  - `--background` white, `--foreground` near-black (`#111113`),
    `--muted-foreground` mid-gray, `--border` light gray, `--card` white.
  - `--primary` = logo royal blue `~#1f5fd8`, `--primary-foreground` white.
  - `--ring`/`--accent` derived from the same blue.
- Radius: introduce a pill radius for buttons/nav (`999px`); keep card radius
  small/sharp.
- Motion: add an `--ease-apple` cubic-bezier and use it on hover/reveal
  transitions. Existing keyframes (fade-in, timeline, marquee, orb, scrollHint,
  spotify-eq) are preserved.
- `.prose-thien` blog styles: swap the serif headings to Bebas; keep the rest.

### 2. Navigation — replace the sidebar

- **New** `components/site-nav.tsx`: sticky top header. Left =
  `modern-logo.png` mark + `THIEN` wordmark in Bebas. Center/right = uppercase
  bold nav links (Home / About / Testimonials / Bookings / Pricing) with a blue
  active-underline (active detection via `usePathname`, `/` exact, others
  `startsWith`). Right = blue pill "Book a session" CTA.
- **New** `components/tab-bar.tsx`: fixed bottom icon tab bar, `md:hidden`,
  same nav items with lucide icons, active item in blue. Mobile top bar shows
  the wordmark + a compact CTA.
- **Delete** `components/sidebar.tsx` and its usage.
- `app/layout.tsx`: render `<SiteNav />` above `{children}`, drop the
  `flex`/`md:ml-56` sidebar offset, keep `<Footer />`. Add bottom padding on
  mobile so content clears the tab bar (matches thien.so's `padding-bottom`).

### 3. Hero — `components/hero.tsx`

Canvas logic untouched. Restyle the text layer only: eyebrow → mono
micro-label; "Hey, I'm Thien." → giant Bebas uppercase; CTA → blue pill. Tennis
balls remain `#c8e03c`.

### 4. Pages & shared components

Systematic class-level restyle, reusing shared patterns across:
`app/page.tsx`, `about`, `testimonials`, `booking` (+ `twin`, `lakeridge`,
`fern-park`, `farmington-valley`), `pricing`, `movies`, `music`, `coaching`,
`blog` + `blog/[slug]`, `admin/testimonials`; and components `blog-list`,
`testimonial-card`, `testimonial-form`, `spotify-widget`, `marquee-text`,
`cal-embed`, `scroll-reveal`, `scroll-timeline`.

Patterns applied consistently:

- Eyebrow labels → `font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground`.
- Section headings → Bebas uppercase, `text-4xl`–`text-6xl`, `leading-[0.9]`.
- Cards/tiles → hard-edged, thin border, blue hover accent; Nike 3px-gap grids
  for poster walls (movies/music) where it fits.
- Buttons → pill. Primary = solid blue. Secondary = border that inverts to
  solid foreground on hover.

Content, props, and data flow are unchanged in every file.

### 5. Favicon & footer mark

- Copy `~/Desktop/modern-logo.png` into the repo (e.g. `app/icon.png`, which
  Next.js App Router auto-serves as the favicon). Remove/replace the old
  `app/icon.svg`.
- Update `app/apple-icon.tsx` to render the logo.
- `components/footer.tsx`: replace the `PetalMark` SVG with the
  `modern-logo.png` image; restyle footer nav links to the new mono/uppercase
  style.

## Success criteria

- `next build` succeeds; no TypeScript/lint errors introduced.
- Every existing route still renders with its original content and behavior
  (booking flow, Cal embed, Spotify/movies data, testimonials submit + admin,
  blog MDX).
- Desktop shows a sticky top nav; mobile shows a bottom tab bar; the sidebar is
  gone.
- Headlines render in Bebas Neue uppercase; accent color is the logo blue;
  no warm-gold or serif remains.
- Favicon and footer both show `modern-logo.png`.
- The hero's bouncing-ball interaction still works.
