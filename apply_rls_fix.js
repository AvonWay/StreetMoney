import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Revelation$2033Jesus@db.tlzasuzpxrcphoxojwvk.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function applyFix() {
    try {
        await client.connect();
        console.log('Connected to Supabase (Postgres).');

        const sql = `
        -- Run this to FIX the "Row-Level Security" error
        
        -- 1. Enable RLS (just in case)
        ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
        
        -- 2. Drop existing restrictive policies (to start fresh)
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON songs;
        DROP POLICY IF EXISTS "Public Read Songs" ON songs;
        DROP POLICY IF EXISTS "Allow Insert Songs" ON songs;
        DROP POLICY IF EXISTS "Allow Delete Songs" ON songs;
        
        -- 3. Create PERMISSIVE policies
        
        -- Allow ANYONE to READ songs (Public)
        CREATE POLICY "Public Read Songs" ON songs FOR SELECT USING (true);
        
        -- Allow ANYONE to INSERT songs
        CREATE POLICY "Allow Insert Songs" ON songs FOR INSERT WITH CHECK (true);
        
        -- Allow ANYONE to DELETE songs
        CREATE POLICY "Allow Delete Songs" ON songs FOR DELETE USING (true);
        
        -- REPEAT FOR VIDEOS
        DROP POLICY IF EXISTS "Public Read Videos" ON videos;
        DROP POLICY IF EXISTS "Allow Insert Videos" ON videos;
        DROP POLICY IF EXISTS "Allow Delete Videos" ON videos;
        
        CREATE POLICY "Public Read Videos" ON videos FOR SELECT USING (true);
        CREATE POLICY "Allow Insert Videos" ON videos FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow Delete Videos" ON videos FOR DELETE USING (true);
        `;

        await client.query(sql);
        console.log('RLS Policies applied successfully.');

    } catch (err) {
        console.error('Error applying fix:', err);
    } finally {
        await client.end();
    }
}

applyFix();
