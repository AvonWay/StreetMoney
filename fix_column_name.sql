-- Run this in your Supabase SQL Editor to fix the column name mismatch

-- 1. Rename 'song_url' to 'url' to match the code's expectation
ALTER TABLE songs RENAME COLUMN song_url TO url;

-- 2. Verify: This makes the 'songs' table have: id, name, url, filename
