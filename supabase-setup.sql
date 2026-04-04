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

-- ── Ladder ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ladder_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ladder_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read ladder_locations"    ON ladder_locations FOR SELECT USING (true);
CREATE POLICY "Allow service insert ladder_locations" ON ladder_locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service delete ladder_locations" ON ladder_locations FOR DELETE USING (true);

-- Seed the 4 locations
INSERT INTO ladder_locations (slug, name) VALUES
  ('twin-lakes',        'Twin Lakes Beach Club'),
  ('lakeridge',         'Lakeridge'),
  ('farmington-valley', 'Farmington Valley Racquet Club'),
  ('fern-park',         'Fern Park Tennis Association')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS ladder_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES ladder_locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 60),
  rank INTEGER NOT NULL DEFAULT 999,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ladder_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read ladder_players"   ON ladder_players FOR SELECT USING (true);
CREATE POLICY "Allow service insert ladder_players" ON ladder_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update ladder_players" ON ladder_players FOR UPDATE USING (true);
CREATE POLICY "Allow service delete ladder_players" ON ladder_players FOR DELETE USING (true);

CREATE INDEX ladder_players_location_rank_idx ON ladder_players (location_id, rank ASC);

CREATE TABLE IF NOT EXISTS ladder_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES ladder_locations(id) ON DELETE CASCADE,
  winner_id UUID NOT NULL REFERENCES ladder_players(id) ON DELETE CASCADE,
  loser_id  UUID NOT NULL REFERENCES ladder_players(id) ON DELETE CASCADE,
  score TEXT NOT NULL CHECK (char_length(score) >= 1 AND char_length(score) <= 80),
  played_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ladder_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read ladder_matches"    ON ladder_matches FOR SELECT USING (true);
CREATE POLICY "Allow service insert ladder_matches" ON ladder_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service delete ladder_matches" ON ladder_matches FOR DELETE USING (true);

CREATE INDEX ladder_matches_location_date_idx ON ladder_matches (location_id, played_at DESC);

-- Helper functions to atomically increment win/loss counters
CREATE OR REPLACE FUNCTION increment_player_wins(player_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE ladder_players SET wins = wins + 1 WHERE id = player_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_player_losses(player_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE ladder_players SET losses = losses + 1 WHERE id = player_id;
END;
$$;

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
