# Supabase connection + Testimonials — Design

## Context

thien.me (Next.js 14 App Router, Tailwind, framer-motion) has no backend yet. The
user has a shared Supabase project named `thien` (project ref `vvgqbyfvrxsepipqqwrz`)
already used by other personal sites, holding tables like `movies`, `photos`,
`guestbook_entries`, `tournaments`, and shared `site_*` config tables keyed by
`site_key`. thien.me is not yet a consumer of this project.

`.env.local` already contains `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_SECRET`
placeholders, but the Supabase values point at an orphaned project ref
(`qmiaeiugiutamtjeipzy`) that doesn't match any project on the account. These
will be replaced with real `thien` project credentials.

Goal: connect thien.me to the `thien` Supabase project, and add a testimonials
feature — a homepage preview section, a full `/testimonials` page with a public
submission form, and an unlisted admin page to curate (hide/delete) entries
after the fact.

## Decisions from brainstorming

- Submissions publish immediately (no pre-approval queue). Curation happens
  after the fact via an admin page.
- Fields: name, free-text context (e.g. "Tennis · Twin Lakes"), quote. No star
  rating, no photo/avatar — explicit non-goals for v1.
- Display: static card grid (not a marquee/carousel), matching the existing
  bordered-card visual language used on `/coaching` and `/about`.
- Admin auth uses the existing `ADMIN_SECRET` env var + the Supabase
  `service_role` key (standard Next.js API-route admin pattern), not a
  Postgres-side secret/RPC trick.
- No rate-limiting or CAPTCHA for v1 — only a honeypot field. Explicit
  non-goal; revisit if the form gets spammed.

## Supabase setup

Project: `thien` (`vvgqbyfvrxsepipqqwrz`).

### New table: `public.testimonials`

| column | type | constraints |
|---|---|---|
| `id` | uuid | pk, default `gen_random_uuid()` |
| `name` | text | not null, 1–80 chars |
| `context` | text | not null, 1–120 chars |
| `quote` | text | not null, 1–600 chars |
| `hidden` | boolean | not null, default `false` |
| `created_at` | timestamptz | not null, default `now()` |

RLS enabled:
- `SELECT` for `anon`/`authenticated` where `hidden = false`.
- `INSERT` for `anon`/`authenticated` with `WITH CHECK (hidden = false)`.
- No `UPDATE`/`DELETE` policy for anon — those only happen via the service-role
  client in the admin API route, which bypasses RLS entirely.

## Env vars (`.env.local`)

Replace with real `thien` project values:
- `NEXT_PUBLIC_SUPABASE_URL=https://vvgqbyfvrxsepipqqwrz.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<thien anon key>`
- `SUPABASE_SERVICE_ROLE_KEY=<thien service_role key>`
- `ADMIN_SECRET` stays as-is (already set, reused for admin gating).

## App changes

### Supabase clients
- `lib/supabase/client.ts` — anon-key client, safe to use in Server Components,
  Route Handlers, and (via `NEXT_PUBLIC_*` vars) the browser.
- `lib/supabase/admin.ts` — service-role client. Imported only inside
  `app/api/admin/**` route handlers; never imported from client components.

### Public submission
- `app/api/testimonials/route.ts` (`POST`): validates `name`/`context`/`quote`
  lengths server-side, checks a honeypot field (silently returns success
  without inserting if filled), inserts a row via the anon client.
- `components/testimonial-form.tsx` (client component): name/context/quote
  inputs + hidden honeypot field, pending/error/success states, styled to
  match existing bordered `bg-card` inputs. On success, calls
  `router.refresh()` so the parent Server Component re-fetches and the new
  entry shows immediately.

### Display
- `components/testimonial-card.tsx`: bordered `bg-card` card — `font-mono`
  uppercase name/context label, `font-display` quote text. Pure presentational,
  no `'use client'` needed.
- `app/page.tsx`: drop the top-level `'use client'` directive, make it an
  async Server Component (its children `Hero` and `ScrollReveal` are already
  client components, so this is safe to compose from a server parent). Fetch
  the 3 most recent visible testimonials and render them in a small grid with
  a "Read more →" link to `/testimonials`. If zero testimonials exist, the
  section doesn't render at all.
- `app/testimonials/page.tsx`: async Server Component. Fetches all visible
  testimonials ordered by `created_at desc`, renders the full card grid (or a
  "No testimonials yet" empty state), then renders `<TestimonialForm />`
  below.

### Admin curation
- `app/admin/testimonials/page.tsx`: client component, not linked from any
  nav. Password field for the admin secret (kept in component state only,
  resent with each request — not persisted). Lists all testimonials (including
  hidden ones) with hide/unhide toggle and a delete button (with confirm).
- `app/api/admin/testimonials/route.ts`: `GET` (list all), `PATCH` (toggle
  `hidden`), `DELETE` (remove row). Each checks a secret in the request body
  against `process.env.ADMIN_SECRET` before touching the service-role client;
  returns 401 on mismatch without leaking details.

### Navigation
- Add a "Testimonials" entry to `components/sidebar.tsx` (`mainLinks`) and
  `components/footer.tsx` (`NAV_LINKS`), alongside Home/About/Bookings/Pricing.
  The admin page is intentionally left out of both.

## Error handling

- Submission form: inline error message on validation/network failure, submit
  button disabled while pending, success clears the form and shows a
  confirmation message.
- Admin page: wrong secret shows "Invalid secret"; API returns 401.
- Empty states handled explicitly (see Display section) rather than rendering
  awkward empty grids.

## Verification

- `npm run dev`; submit a testimonial through `/testimonials` and confirm it
  appears there and (once there are 3+) on the homepage.
- Use the admin page to hide and then delete a test entry, confirming it
  disappears from public views immediately.
- Run Supabase's security advisor (`get_advisors`, type `security`) after
  creating the table/policies to catch any RLS gaps before considering the
  work done.
