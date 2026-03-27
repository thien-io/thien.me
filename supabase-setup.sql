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
