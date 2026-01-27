-- Run this to FIX the "Row-Level Security" error

-- 1. Enable RLS (just in case)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies (to start fresh)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON songs;
DROP POLICY IF EXISTS "Public Read Songs" ON songs;
DROP POLICY IF EXISTS "Allow Insert Songs" ON songs;

-- 3. Create PERMISSIVE policies (This allows your dashboard to work without complex auth)

-- Allow ANYONE to READ songs (Public)
CREATE POLICY "Public Read Songs" ON songs FOR SELECT USING (true);

-- Allow ANYONE to INSERT songs (Fixes your error)
CREATE POLICY "Allow Insert Songs" ON songs FOR INSERT WITH CHECK (true);

-- Allow ANYONE to DELETE songs (So delete button works)
CREATE POLICY "Allow Delete Songs" ON songs FOR DELETE USING (true);


-- REPEAT FOR VIDEOS
DROP POLICY IF EXISTS "Public Read Videos" ON videos;
DROP POLICY IF EXISTS "Allow Insert Videos" ON videos;

CREATE POLICY "Public Read Videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow Insert Videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Delete Videos" ON videos FOR DELETE USING (true);
