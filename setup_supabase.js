import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Revelation$2033Jesus@db.tlzasuzpxrcphoxojwvk.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function setupDatabase() {
    try {
        await client.connect();
        console.log('Connected to Supabase successfully.');

        // 1. Profiles Table
        // referencing auth.users requires that auth.users exists (which is intrinsic to Supabase)
        // We use IF NOT EXISTS to be safe.
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
        email TEXT,
        role TEXT DEFAULT 'user'
      );
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    `);
        console.log('Created profiles table with RLS.');

        // 2. Products Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        price NUMERIC(10, 2),
        stripe_link TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true
      );
      ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    `);
        console.log('Created products table with RLS.');

        // 3. Media Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.media (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT,
        file_url TEXT,
        cover_art_url TEXT
      );
      ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
    `);
        console.log('Created media table with RLS.');

        // 4. Contacts Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.contacts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT,
        phone TEXT
      );
      ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
    `);
        console.log('Created contacts table with RLS.');

        console.log('Database setup complete!');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
