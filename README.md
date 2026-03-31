# thien.me — Tennis Coach Personal Site

A minimal, elegant personal website built with Next.js 14, Tailwind CSS, Supabase, and Spotify integration.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom design tokens
- **UI**: Radix UI + shadcn/ui primitives
- **Backend**: Supabase (PostgreSQL)
- **Auth/DB**: Supabase Row Level Security
- **Music**: Spotify Web API
- **Deployment**: Vercel (recommended)

---

## 1. Local Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Install dependencies
```bash
cd thien-me
npm install
```

### Create your .env.local
```bash
cp .env.local.example .env.local
```

Then fill in the values (instructions below).

---

## 2. Supabase Setup

### Step 1 — Create a project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **New project**
3. Name it `thien-me`, choose a region close to you (e.g. US East)
4. Save your database password somewhere safe

### Step 2 — Run the SQL
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste the contents of `supabase-setup.sql` and click **Run**

This creates the `guestbook` table with proper Row Level Security policies.

### Step 3 — Get your keys
1. In Supabase, go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Paste both into your `.env.local`.

---

## 3. Spotify Setup

This lets your site show what you're currently listening to.

### Step 1 — Create a Spotify App
1. Go to [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create app**
3. Fill in:
   - App name: `thien.me`
   - Redirect URI: `http://localhost:3000` (exact)
4. Save. Copy your **Client ID** and **Client Secret** into `.env.local`

### Step 2 — Get your Refresh Token (one-time setup)

You need to authorize your own Spotify account once to get a long-lived refresh token.

**a) Build the authorization URL**

Replace `YOUR_CLIENT_ID` and open this URL in your browser:

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-currently-playing,user-read-playback-state,user-top-read
```

**b) Authorize and grab the code**

Spotify will redirect you to something like:
```
http://localhost:3000/?code=AQD...xyz
```

Copy the `code` value (everything after `?code=`).

**c) Exchange code for refresh token**

Run this in your terminal (replace the placeholders):

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://localhost:3000"
```

The response will contain a `refresh_token`. Copy it into your `.env.local` as `SPOTIFY_REFRESH_TOKEN`.

> The refresh token doesn't expire unless you revoke it — you only do this once.

---

## 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 5. Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B — GitHub + Vercel dashboard
1. Push your repo to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Add all environment variables from `.env.local` in the **Environment Variables** section
5. Click **Deploy**

### Custom domain
1. In Vercel dashboard → your project → **Settings → Domains**
2. Add `thien.me`
3. Update your domain's DNS to point to Vercel (they walk you through it)

---

## 6. Customizing the site

| File | What to change |
|------|---------------|
| `app/page.tsx` | Your intro text, stats, CTA buttons |
| `app/coaching/page.tsx` | Pricing, session types, email address |
| `app/about/page.tsx` | Your bio, timeline events |
| `components/sidebar.tsx` | Your name, social links, nav items |
| `app/globals.css` | Color palette (CSS variables at top) |

### Change colors
Open `app/globals.css`. The `:root` block controls light mode, `.dark` controls dark mode. All colors use HSL — tweak the values to match your brand.

### Change fonts
The site uses **Cormorant Garamond** (display) and **DM Mono** (monospace). To swap fonts, update the `@import` line in `globals.css` and the `font-family` variables.

---

## Project Structure

```
thien-me/
├── app/
│   ├── api/
│   │   ├── guestbook/route.ts   ← Supabase CRUD
│   │   └── spotify/route.ts     ← Spotify now-playing
│   ├── about/page.tsx
│   ├── coaching/page.tsx
│   ├── guestbook/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── sidebar.tsx              ← Nav + theme toggle
│   ├── spotify-widget.tsx       ← Now playing widget
│   └── theme-provider.tsx
├── supabase-setup.sql           ← Run this in Supabase
├── .env.local.example
└── README.md
```
