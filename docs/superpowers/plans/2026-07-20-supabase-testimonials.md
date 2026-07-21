# Supabase Connection + Testimonials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect thien.me to the `thien` Supabase project (`vvgqbyfvrxsepipqqwrz`) and ship a testimonials feature: a homepage preview section, a full `/testimonials` page with a public submission form, and an unlisted `/admin/testimonials` page to curate entries afterward.

**Architecture:** Next.js 14 App Router, Server Components fetch testimonials directly via a thin Supabase data-access layer (`lib/supabase/*`). One public API route handles submissions (anon key, RLS-governed); one admin API route handles list/hide/delete (service-role key, gated by `ADMIN_SECRET` header, bypasses RLS). No client-side Supabase SDK usage — all DB access happens server-side (Route Handlers and Server Components).

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, `@supabase/supabase-js`, Supabase Postgres + RLS.

## Global Constraints

- Supabase project: `thien`, ref `vvgqbyfvrxsepipqqwrz`, URL `https://vvgqbyfvrxsepipqqwrz.supabase.co`.
- Testimonials publish immediately on submission — no pre-approval queue. Curation (hide/delete) happens after the fact via the admin page.
- Testimonial fields: `name` (1–80 chars), `context` (1–120 chars, free text), `quote` (1–600 chars). No star rating, no photo/avatar — explicit non-goals for v1.
- No rate-limiting or CAPTCHA for v1 — only a honeypot field on the public form.
- Display is a static card grid (not a marquee/carousel), matching the bordered `bg-card` card style used on `/coaching` and `/about`.
- The admin page (`/admin/testimonials`) is never linked from `Sidebar` or `Footer` nav.
- `SUPABASE_SERVICE_ROLE_KEY` must only ever be imported by code under `app/api/admin/**` (via `lib/supabase/admin.ts` / `lib/supabase/testimonials-admin.ts`) — never by a client component or the public submission route.
- Match existing code style: double quotes, function-declaration exports (see `lib/posts.ts`), Tailwind utility classes matching patterns already in `app/about/page.tsx` and `app/coaching/page.tsx`.

---

### Task 1: Connect the project to Supabase

**Files:**
- Modify: `package.json` (add dependencies)
- Modify: `.env.local`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/admin.ts`

**Interfaces:**
- Produces: `supabase` (named export, `lib/supabase/client.ts`) — anon-key Supabase client, safe for Server Components and Route Handlers.
- Produces: `supabaseAdmin` (named export, `lib/supabase/admin.ts`) — service-role Supabase client, server-only (guarded by the `server-only` package).

- [ ] **Step 1: Install dependencies**

```bash
npm install @supabase/supabase-js server-only
```

- [ ] **Step 2: Replace the Supabase env vars with real `thien` project credentials**

Edit `.env.local` — replace the existing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` lines (they currently point at an orphaned project ref) with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vvgqbyfvrxsepipqqwrz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3FieWZ2cnhzZXBpcHFxd3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDA0NjksImV4cCI6MjA5MjI3NjQ2OX0.2bYmLPznMYpZalXDDjTAYZHt6ZpI6EgcEe7X2Ov_clQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3FieWZ2cnhzZXBpcHFxd3J6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcwMDQ2OSwiZXhwIjoyMDkyMjc2NDY5fQ.9em1XwBuDI7VBsp5qfRYsylLHEH9WXJzflsfB3x83Ek
```

Leave `ADMIN_SECRET` and every other line untouched.

- [ ] **Step 3: Create the anon client**

`lib/supabase/client.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

- [ ] **Step 4: Create the service-role admin client**

`lib/supabase/admin.ts`:

```ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
```

- [ ] **Step 5: Verify the connection with a throwaway smoke test**

Create a temporary file `scratch-smoke-test.mjs` in the project root:

```js
import { createClient } from "@supabase/supabase-js";

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await client.from("social_links").select("id").limit(1);
if (error) {
  console.error("FAILED:", error.message);
  process.exit(1);
}
console.log("OK, connected. Sample row:", data);
```

Run: `node --env-file=.env.local scratch-smoke-test.mjs`
Expected: `OK, connected. Sample row: [ { id: '...' } ]` (no error).

Delete the file afterward: `rm scratch-smoke-test.mjs`

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json lib/supabase/client.ts lib/supabase/admin.ts
git commit -m "supabase: connect thien.me to the thien project"
```

`.env.local` is gitignored and won't be included — confirm with `git status` that it's not staged.

---

### Task 2: Create the `testimonials` table

**Files:**
- No repo files — this task applies a migration directly to the `thien` Supabase project via MCP tools.

**Interfaces:**
- Produces: `public.testimonials` table with columns `id, name, context, quote, hidden, created_at`, RLS enabled, consumed by Tasks 3 and 4.

- [ ] **Step 1: Apply the migration**

Call the `mcp__claude_ai_Supabase__apply_migration` tool with `project_id: "vvgqbyfvrxsepipqqwrz"`, `name: "create_testimonials"`, and this SQL:

```sql
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 1 and char_length(name) <= 80),
  context text not null check (char_length(context) >= 1 and char_length(context) <= 120),
  quote text not null check (char_length(quote) >= 1 and char_length(quote) <= 600),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Public can view visible testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (hidden = false);

create policy "Public can submit testimonials"
  on public.testimonials for insert
  to anon, authenticated
  with check (hidden = false);
```

- [ ] **Step 2: Verify the table and policies**

Call `mcp__claude_ai_Supabase__list_tables` with `project_id: "vvgqbyfvrxsepipqqwrz"`, `schemas: ["public"]`, `verbose: true`.
Expected: `public.testimonials` appears with `rls_enabled: true` and the 6 columns above.

- [ ] **Step 3: Check for RLS/security gaps**

Call `mcp__claude_ai_Supabase__get_advisors` with `project_id: "vvgqbyfvrxsepipqqwrz"`, `type: "security"`.
Expected: no new warnings referencing `testimonials` (e.g. no "RLS disabled" or "policy missing" notices).

No commit — this task only changes remote Supabase state.

---

### Task 3: Public data layer + submission API route

**Files:**
- Create: `lib/supabase/testimonials.ts`
- Create: `app/api/testimonials/route.ts`

**Interfaces:**
- Consumes: `supabase` from `lib/supabase/client.ts` (Task 1); `public.testimonials` table (Task 2).
- Produces: `Testimonial` type (`{ id: string; name: string; context: string; quote: string; created_at: string }`), `getVisibleTestimonials(limit?: number): Promise<Testimonial[]>`, `insertTestimonial(input: { name: string; context: string; quote: string }): Promise<void>` — all from `lib/supabase/testimonials.ts`, consumed by Tasks 5 and 6.
- Produces: `POST /api/testimonials` route.

- [ ] **Step 1: Write the data-access module**

`lib/supabase/testimonials.ts`:

```ts
import { supabase } from "@/lib/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  context: string;
  quote: string;
  created_at: string;
}

export async function getVisibleTestimonials(limit?: number): Promise<Testimonial[]> {
  let query = supabase
    .from("testimonials")
    .select("id, name, context, quote, created_at")
    .eq("hidden", false)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function insertTestimonial(input: {
  name: string;
  context: string;
  quote: string;
}): Promise<void> {
  const { error } = await supabase.from("testimonials").insert({
    name: input.name,
    context: input.context,
    quote: input.quote,
  });
  if (error) throw error;
}
```

- [ ] **Step 2: Write the submission route**

`app/api/testimonials/route.ts`:

```ts
import { NextResponse } from "next/server";
import { insertTestimonial } from "@/lib/supabase/testimonials";

const MAX_LENGTHS = { name: 80, context: 120, quote: 600 };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, context, quote, website } = body as Record<string, unknown>;

  // Honeypot: bots fill hidden fields, real visitors never see this one.
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const nameOk = typeof name === "string" && name.trim().length >= 1 && name.length <= MAX_LENGTHS.name;
  const contextOk = typeof context === "string" && context.trim().length >= 1 && context.length <= MAX_LENGTHS.context;
  const quoteOk = typeof quote === "string" && quote.trim().length >= 1 && quote.length <= MAX_LENGTHS.quote;

  if (!nameOk || !contextOk || !quoteOk) {
    return NextResponse.json(
      { error: "Please fill out all fields within the length limits." },
      { status: 400 }
    );
  }

  try {
    await insertTestimonial({
      name: (name as string).trim(),
      context: (context as string).trim(),
      quote: (quote as string).trim(),
    });
  } catch (err) {
    console.error("Failed to insert testimonial", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 3: Verify with the dev server**

Run: `npm run dev` (leave running in background)

Valid submission:
```bash
curl -s -i -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","context":"Tennis · Test","quote":"Great coach, learned a ton.","website":""}'
```
Expected: `HTTP/1.1 201` and body `{"ok":true}`.

Honeypot triggers silently:
```bash
curl -s -i -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","context":"x","quote":"x","website":"http://spam.example"}'
```
Expected: `HTTP/1.1 200` and body `{"ok":true}` — confirm no new row was inserted by calling `mcp__claude_ai_Supabase__execute_sql` with `project_id: "vvgqbyfvrxsepipqqwrz"` and `query: "select count(*) from public.testimonials where name = 'Bot';"` — expected count `0`.

Validation failure:
```bash
curl -s -i -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{"name":"","context":"x","quote":"x"}'
```
Expected: `HTTP/1.1 400` and an `error` message in the body.

Clean up the test row: call `mcp__claude_ai_Supabase__execute_sql` with `query: "delete from public.testimonials where name = 'Test User';"`.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/testimonials.ts app/api/testimonials/route.ts
git commit -m "testimonials: add public data layer and submission endpoint"
```

---

### Task 4: Admin data layer + admin API route

**Files:**
- Create: `lib/supabase/testimonials-admin.ts`
- Create: `app/api/admin/testimonials/route.ts`

**Interfaces:**
- Consumes: `supabaseAdmin` from `lib/supabase/admin.ts` (Task 1); `Testimonial` type from `lib/supabase/testimonials.ts` (Task 3); `public.testimonials` table (Task 2).
- Produces: `AdminTestimonial` type (`Testimonial & { hidden: boolean }`), `listAllTestimonials(): Promise<AdminTestimonial[]>`, `setTestimonialHidden(id: string, hidden: boolean): Promise<void>`, `deleteTestimonial(id: string): Promise<void>` — all from `lib/supabase/testimonials-admin.ts`, consumed by Task 7.
- Produces: `GET/PATCH/DELETE /api/admin/testimonials` routes, gated by an `x-admin-secret` header checked against `process.env.ADMIN_SECRET`.

- [ ] **Step 1: Write the admin data-access module**

`lib/supabase/testimonials-admin.ts`:

```ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Testimonial } from "@/lib/supabase/testimonials";

export interface AdminTestimonial extends Testimonial {
  hidden: boolean;
}

export async function listAllTestimonials(): Promise<AdminTestimonial[]> {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("id, name, context, quote, hidden, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setTestimonialHidden(id: string, hidden: boolean): Promise<void> {
  const { error } = await supabaseAdmin.from("testimonials").update({ hidden }).eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}
```

- [ ] **Step 2: Write the admin route**

`app/api/admin/testimonials/route.ts`:

```ts
import { NextResponse } from "next/server";
import {
  listAllTestimonials,
  setTestimonialHidden,
  deleteTestimonial,
} from "@/lib/supabase/testimonials-admin";

function isAuthorized(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return typeof secret === "string" && secret.length > 0 && secret === process.env.ADMIN_SECRET;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const testimonials = await listAllTestimonials();
  return NextResponse.json({ testimonials });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { id, hidden } = (body ?? {}) as Record<string, unknown>;
  if (typeof id !== "string" || typeof hidden !== "boolean") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  await setTestimonialHidden(id, hidden);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { id } = (body ?? {}) as Record<string, unknown>;
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  await deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify with the dev server**

Ensure `npm run dev` is still running. First insert a test row via `mcp__claude_ai_Supabase__execute_sql`:
`query: "insert into public.testimonials (name, context, quote) values ('Admin Test', 'ctx', 'quote text') returning id;"` — note the returned `id`.

Wrong secret:
```bash
curl -s -i http://localhost:3000/api/admin/testimonials -H "x-admin-secret: wrong"
```
Expected: `HTTP/1.1 401`.

Correct secret lists the row:
```bash
curl -s http://localhost:3000/api/admin/testimonials -H "x-admin-secret: thienpassword"
```
Expected: JSON body containing a testimonial with `name: "Admin Test"`.

Hide it (replace `<id>` with the id from the insert):
```bash
curl -s -i -X PATCH http://localhost:3000/api/admin/testimonials \
  -H "Content-Type: application/json" -H "x-admin-secret: thienpassword" \
  -d '{"id":"<id>","hidden":true}'
```
Expected: `HTTP/1.1 200`, `{"ok":true}`. Confirm via `execute_sql`: `select hidden from public.testimonials where id = '<id>';` returns `true`.

Delete it:
```bash
curl -s -i -X DELETE http://localhost:3000/api/admin/testimonials \
  -H "Content-Type: application/json" -H "x-admin-secret: thienpassword" \
  -d '{"id":"<id>"}'
```
Expected: `HTTP/1.1 200`, `{"ok":true}`. Confirm via `execute_sql`: `select count(*) from public.testimonials where id = '<id>';` returns `0`.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/testimonials-admin.ts app/api/admin/testimonials/route.ts
git commit -m "testimonials: add admin data layer and moderation endpoint"
```

---

### Task 5: `/testimonials` page — card, form, and page

**Files:**
- Create: `components/testimonial-card.tsx`
- Create: `components/testimonial-form.tsx`
- Create: `app/testimonials/page.tsx`

**Interfaces:**
- Consumes: `Testimonial` type and `getVisibleTestimonials` from `lib/supabase/testimonials.ts` (Task 3); `ScrollReveal` from `components/scroll-reveal.tsx`; `ParallaxSection` from `components/parallax-section.tsx`.
- Produces: `TestimonialCard` (`components/testimonial-card.tsx`, props `{ testimonial: Testimonial }`), `TestimonialForm` (`components/testimonial-form.tsx`, no props) — both consumed by Task 6 (`TestimonialCard` only) and reused here.

- [ ] **Step 1: Write the card component**

`components/testimonial-card.tsx`:

```tsx
import type { Testimonial } from "@/lib/supabase/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-6 border border-border rounded-xl bg-card h-full flex flex-col">
      <p className="font-display text-lg md:text-xl font-light text-foreground leading-relaxed mb-4 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
        {testimonial.name}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
        {testimonial.context}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Write the submission form**

`components/testimonial-form.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function TestimonialForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [quote, setQuote] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("pending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, context, quote, website }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setName("");
      setContext("");
      setQuote("");
      setStatus("success");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Name
        </label>
        <input
          id="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
        />
      </div>

      <div>
        <label htmlFor="context" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Context <span className="normal-case tracking-normal text-muted-foreground/70">(e.g. &quot;Tennis · Twin Lakes&quot;)</span>
        </label>
        <input
          id="context"
          required
          maxLength={120}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
        />
      </div>

      <div>
        <label htmlFor="quote" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Your testimonial
        </label>
        <textarea
          id="quote"
          required
          maxLength={600}
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground leading-relaxed focus:outline-none focus:border-primary/40 transition-all resize-none"
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
      {status === "success" && <p className="text-sm text-primary">Thanks for sharing — your testimonial is live.</p>}

      <button
        type="submit"
        disabled={status === "pending"}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "pending" ? "Submitting…" : "Submit testimonial"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Write the page**

`app/testimonials/page.tsx`:

```tsx
import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import { TestimonialCard } from "@/components/testimonial-card";
import { TestimonialForm } from "@/components/testimonial-form";
import { getVisibleTestimonials } from "@/lib/supabase/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What players I've coached have to say about their time on court.",
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await getVisibleTestimonials();

  return (
    <div>
      <section className="relative px-8 md:px-16 pt-28 pb-14 md:pt-32 md:pb-20 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]">
            words
          </span>
        </ParallaxSection>

        <div className="relative z-10">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
              Testimonials
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
              What players<br /><em className="text-primary">say.</em>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {testimonials.map((t) => (
              <ScrollReveal key={t.id}>
                <TestimonialCard testimonial={t} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-16">
            No testimonials yet — be the first to share your experience.
          </p>
        )}
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
          Share yours
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-8">
          Leave a testimonial.
        </h2>
        <TestimonialForm />
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Verify manually**

Run `npm run dev`, open `http://localhost:3000/testimonials`.
Expected: page loads with the "No testimonials yet" empty state (table is empty after Task 3/4 cleanup), the form renders below. Submit the form with real values; expected: success message appears, and the new card appears in the grid above without a full page reload (the empty-state message is replaced by the grid).

- [ ] **Step 5: Commit**

```bash
git add components/testimonial-card.tsx components/testimonial-form.tsx app/testimonials/page.tsx
git commit -m "testimonials: add /testimonials page with card grid and submission form"
```

---

### Task 6: Homepage testimonials section

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getVisibleTestimonials` from `lib/supabase/testimonials.ts` (Task 3), `TestimonialCard` from `components/testimonial-card.tsx` (Task 5).

- [ ] **Step 1: Convert the homepage to an async Server Component and add the section**

Replace the full contents of `app/page.tsx`:

```tsx
import { Hero } from '@/components/hero';
import { ScrollReveal } from '@/components/scroll-reveal';
import { TestimonialCard } from '@/components/testimonial-card';
import { getVisibleTestimonials } from '@/lib/supabase/testimonials';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const testimonials = await getVisibleTestimonials(3);

  return (
    <div>
      <Hero />

      <div className='content-wrap'>
        <div className='h-px bg-border/50 mx-8 md:mx-16' />

        {testimonials.length > 0 && (
          <>
            <section className='px-8 md:px-16 py-16 md:py-24'>
              <ScrollReveal>
                <p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8'>
                  Testimonials
                </p>
                <h2 className='font-display text-3xl md:text-4xl font-light text-foreground mb-10'>
                  What players say.
                </h2>
              </ScrollReveal>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                {testimonials.map((t) => (
                  <ScrollReveal key={t.id}>
                    <TestimonialCard testimonial={t} />
                  </ScrollReveal>
                ))}
              </div>
              <Link
                href='/testimonials'
                className='font-mono text-[11px] uppercase tracking-wider text-primary hover:underline'
              >
                Read more →
              </Link>
            </section>

            <div className='h-px bg-border/50 mx-8 md:mx-16' />
          </>
        )}

        {/* Contact */}
        <section className='px-8 md:px-16 py-16 md:py-24'>
          <ScrollReveal>
            <p className='font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8'>
              Contact
            </p>
            <h2 className='font-display text-3xl md:text-4xl font-light text-foreground mb-4'>
              Get in touch.
            </h2>
            <p className='text-muted-foreground max-w-sm leading-relaxed mb-8'>
              Have a question, want to book a lesson, or just want to say hi.
            </p>
            <div className='flex flex-row gap-3'>
              <Link
                href='/booking'
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' />
                </svg>
                Book a session
              </Link>
              <a
                href='mailto:hello@thien.me'
                aria-label='Send an email'
                className='inline-flex items-center px-3 py-2.5 rounded-xl border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75' />
                </svg>
              </a>
              <a
                href='https://venmo.com/thienmtran'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Venmo'
                className='inline-flex items-center px-3 py-2.5 rounded-xl border border-border bg-card hover:border-[#3D95CE]/40 hover:bg-[#3D95CE]/5 transition-all'
              >
                <svg viewBox='2 2 18 13' className='w-4 h-4' fill='#3D95CE' aria-hidden='true'>
                  <path d='M19.07 2C19.54 2.78 19.75 3.58 19.75 4.6c0 3.17-2.71 7.29-4.91 10.18H9.94L7.76 2.97l4.67-.45 1.12 8.96c1.04-1.7 2.33-4.38 2.33-6.2 0-.99-.17-1.67-.44-2.23L19.07 2z' />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Restart `npm run dev` if needed. Insert 3 test rows via `execute_sql` (`insert into public.testimonials (name, context, quote) values ('A','ctx a','quote a'), ('B','ctx b','quote b'), ('C','ctx c','quote c');`), reload `http://localhost:3000/`.
Expected: a "Testimonials" section appears between the hero and the contact section with 3 cards and a "Read more →" link to `/testimonials`.

Then delete the test rows: `delete from public.testimonials where name in ('A','B','C');` and reload.
Expected: the testimonials section disappears entirely (no empty grid), page still renders normally.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "homepage: add testimonials preview section"
```

---

### Task 7: Admin curation page

**Files:**
- Create: `app/admin/testimonials/page.tsx`
- Create: `app/admin/testimonials/admin-client.tsx`

**Interfaces:**
- Consumes: `AdminTestimonial` type from `lib/supabase/testimonials-admin.ts` (Task 4, type-only import); `GET/PATCH/DELETE /api/admin/testimonials` (Task 4).

- [ ] **Step 1: Write the client component**

`app/admin/testimonials/admin-client.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import type { AdminTestimonial } from "@/lib/supabase/testimonials-admin";

export function AdminTestimonialsClient() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid secret");
        return;
      }
      setTestimonials(data.testimonials);
      setAuthed(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleHidden(id: string, hidden: boolean) {
    const res = await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ id, hidden }),
    });
    if (res.ok) {
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, hidden } : t)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial permanently?")) return;
    const res = await fetch("/api/admin/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  }

  if (!authed) {
    return (
      <div className="px-8 md:px-16 py-16 max-w-sm">
        <h1 className="font-display text-3xl font-light mb-6">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-8 md:px-16 py-16">
      <h1 className="font-display text-3xl font-light mb-8">Testimonials ({testimonials.length})</h1>
      <div className="space-y-3 max-w-2xl">
        {testimonials.map((t) => (
          <div key={t.id} className="p-4 border border-border rounded-xl bg-card flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-foreground mb-1">{t.quote}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t.name} · {t.context} {t.hidden && "· hidden"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleHidden(t.id, !t.hidden)}
                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                {t.hidden ? "Unhide" : "Hide"}
              </button>
              <button
                onClick={() => remove(t.id)}
                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-red-600 hover:border-red-600/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the page wrapper**

`app/admin/testimonials/page.tsx`:

```tsx
import type { Metadata } from "next";
import { AdminTestimonialsClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin · Testimonials",
  robots: { index: false, follow: false },
};

export default function AdminTestimonialsPage() {
  return <AdminTestimonialsClient />;
}
```

- [ ] **Step 3: Verify manually**

Open `http://localhost:3000/admin/testimonials`. Enter an incorrect secret; expected: "Invalid secret" error shown, page stays on the login form. Enter `thienpassword`; expected: list of all testimonials loads (including any hidden ones). Click "Hide" on one; expected: it's labeled "· hidden" and reloading `http://localhost:3000/testimonials` no longer shows it. Click "Delete" on one, confirm the browser dialog; expected: it disappears from the admin list immediately.

- [ ] **Step 4: Commit**

```bash
git add app/admin/testimonials/page.tsx app/admin/testimonials/admin-client.tsx
git commit -m "testimonials: add admin curation page"
```

---

### Task 8: Add Testimonials to site navigation

**Files:**
- Modify: `components/sidebar.tsx`
- Modify: `components/footer.tsx`

**Interfaces:**
- None — this task only edits static nav-link arrays; it does not touch data-layer or route code from prior tasks.

- [ ] **Step 1: Add the nav icon and link to the sidebar**

In `components/sidebar.tsx`, add `Quote` to the `lucide-react` import on line 6-10:

```ts
import {
  Home, BookOpen, Menu, X, Mail,
  ChevronDown, CalendarCheck,
  CircleDollarSign, Quote,
} from "lucide-react";
```

Then update the `mainLinks` array to insert a Testimonials entry after About:

```ts
const mainLinks = [
  { href: "/",             label: "Home",         icon: Home,     custom: false },
  { href: "/about",        label: "About",        icon: BookOpen, custom: false },
  { href: "/testimonials", label: "Testimonials", icon: Quote,    custom: false },
  {
    href: '/booking',
    label: 'Bookings',
    icon: CalendarCheck,
    custom: false,
    pickleIcon: false,
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: CircleDollarSign,
    custom: false,
    pickleIcon: false,
  },

];
```

- [ ] **Step 2: Add the link to the footer**

In `components/footer.tsx`, update `NAV_LINKS`:

```ts
const NAV_LINKS = [
  { href: "/",             label: "home"         },
  { href: "/about",        label: "about"        },
  { href: "/testimonials", label: "testimonials" },
  { href: "/booking",      label: "bookings"     },
  { href: "/pricing",      label: "pricing"      },
];
```

- [ ] **Step 3: Verify manually**

Reload any page. Expected: "Testimonials" appears in the desktop sidebar between About and Bookings, is clickable and navigates to `/testimonials` with the active-state highlight applied when on that page. Expected: "testimonials" appears in the footer nav row in the same position, on every page (footer is likely rendered from a shared layout — confirm by checking `app/layout.tsx` if it's not visible).

- [ ] **Step 4: Commit**

```bash
git add components/sidebar.tsx components/footer.tsx
git commit -m "nav: add testimonials link to sidebar and footer"
```

---

### Task 9: Final verification pass

**Files:**
- None — verification only.

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: build completes with no type errors or failed page generation (the `force-dynamic` exports on `/` and `/testimonials` should show as `ƒ (Dynamic)` in the route summary, not prerendered).

- [ ] **Step 2: Security advisor sweep**

Call `mcp__claude_ai_Supabase__get_advisors` with `project_id: "vvgqbyfvrxsepipqqwrz"`, `type: "security"`.
Expected: no warnings referencing `public.testimonials`.

- [ ] **Step 3: End-to-end manual walkthrough**

With `npm run dev` running:
1. Visit `/testimonials`, submit a real testimonial through the form. Expected: success message, card appears in the grid.
2. Visit `/`. Expected: testimonials section now appears (since at least 1 exists) showing the new card, with a working "Read more →" link.
3. Visit `/admin/testimonials`, log in with `thienpassword`. Expected: the same testimonial is listed.
4. Hide it. Expected: it disappears from `/` and `/testimonials` on reload, but still appears (marked "· hidden") in the admin list.
5. Delete it. Expected: it's gone from the admin list; `/` no longer shows the testimonials section (back to zero).

- [ ] **Step 4: Confirm no stray files**

Run: `git status`
Expected: clean working tree (no leftover `scratch-smoke-test.mjs` or other temp files), all 8 feature commits present in `git log --oneline -10`.
