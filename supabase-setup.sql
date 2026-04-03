-- Run this in your Supabase SQL Editor
-- Go to: https://app.supabase.com → your project → SQL Editor

-- 1. Create the guestbook table
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) <= 60),
  message TEXT NOT NULL CHECK (char_length(message) <= 300),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to READ entries (public guestbook)
CREATE POLICY "Allow public read"
  ON guestbook FOR SELECT
  USING (true);

-- 4. Allow anyone to INSERT entries (open guestbook)
CREATE POLICY "Allow public insert"
  ON guestbook FOR INSERT
  WITH CHECK (true);

-- 5. Optional: Create an index for faster ordering
CREATE INDEX guestbook_created_at_idx ON guestbook (created_at DESC);

-- ── Brick Breaker Leaderboard ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 30),
  score INTEGER NOT NULL CHECK (score > 0),
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read leaderboard"
  ON leaderboard FOR SELECT USING (true);

CREATE POLICY "Allow public insert leaderboard"
  ON leaderboard FOR INSERT WITH CHECK (true);

CREATE INDEX leaderboard_score_idx ON leaderboard (score DESC);

-- ── Pong Leaderboard ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pong_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 30),
  score INTEGER NOT NULL CHECK (score >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pong_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read pong"
  ON pong_leaderboard FOR SELECT USING (true);

CREATE POLICY "Allow public insert pong"
  ON pong_leaderboard FOR INSERT WITH CHECK (true);

CREATE INDEX pong_score_idx ON pong_leaderboard (score DESC);

-- ── Snake Leaderboard ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS snake_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 30),
  score INTEGER NOT NULL CHECK (score > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE snake_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read snake"
  ON snake_leaderboard FOR SELECT USING (true);

CREATE POLICY "Allow public insert snake"
  ON snake_leaderboard FOR INSERT WITH CHECK (true);

CREATE INDEX snake_score_idx ON snake_leaderboard (score DESC);

-- ── Ball Rush Leaderboard ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ballrush_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 30),
  score INTEGER NOT NULL CHECK (score > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ballrush_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read ballrush"
  ON ballrush_leaderboard FOR SELECT USING (true);

CREATE POLICY "Allow public insert ballrush"
  ON ballrush_leaderboard FOR INSERT WITH CHECK (true);

CREATE INDEX ballrush_score_idx ON ballrush_leaderboard (score DESC);

-- ── Tennis Tanks Leaderboard ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tennistanks_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 30),
  score INTEGER NOT NULL CHECK (score >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tennistanks_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read tennistanks"
  ON tennistanks_leaderboard FOR SELECT USING (true);

CREATE POLICY "Allow public insert tennistanks"
  ON tennistanks_leaderboard FOR INSERT WITH CHECK (true);

CREATE INDEX tennistanks_score_idx ON tennistanks_leaderboard (score DESC);

-- ── Site Likes ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_likes (
  id INTEGER PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

-- Seed the single row
INSERT INTO site_likes (id, count) VALUES (1, 0)
  ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read likes"
  ON site_likes FOR SELECT USING (true);

-- Atomic increment function (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_likes()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE site_likes SET count = count + 1 WHERE id = 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
