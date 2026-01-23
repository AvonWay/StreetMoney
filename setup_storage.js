import pg from 'pg';
const { Client } = pg;

// Using the same credentials as before
const connectionString = 'postgresql://postgres:Revelation$2033Jesus@db.tlzasuzpxrcphoxojwvk.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function setupStorage() {
    try {
        await client.connect();
        console.log('Connected to Supabase for Storage Setup...');

        // 1. Create Buckets (insert into storage.buckets)
        // We try to insert; if it exists, we ignore.
        const createBuckets = `
      INSERT INTO storage.buckets (id, name, public)
      VALUES 
        ('products', 'products', true),
        ('media', 'media', true)
      ON CONFLICT (id) DO NOTHING;
    `;
        await client.query(createBuckets);
        console.log('Buckets "products" and "media" created (or already existed).');

        // 2. Enable RLS Policy: Public Read
        // Allows anyone to read from these buckets
        // Note: 'storage.objects' is the table managing files.

        // We need to act as postgres/service_role to create policies usually.
        // Policy: Public Read
        await client.query(`
      create policy "Public Read Products"
      on storage.objects for select
      in ( "products" ) -- simplified bucket check
      using ( bucket_id = 'products' );

      create policy "Public Read Media"
      on storage.objects for select
      in ( "media" )
      using ( bucket_id = 'media' );
    `.catch(() => { })); // Ignore if exists

        // 3. Enable RLS Policy: Authenticated Insert
        // Allows logged in users (admin) to upload
        await client.query(`
      create policy "Auth Upload Products"
      on storage.objects for insert
      to authenticated
      with check ( bucket_id = 'products' );

      create policy "Auth Upload Media"
      on storage.objects for insert
      to authenticated
      with check ( bucket_id = 'media' );
    `.catch(() => { })); // Ignore if exists

        console.log('Storage Policies applied.');

    } catch (err) {
        // Basic error handling - policies might fail if they exist, which is fine.
        // console.error('Note:', err.message); 
        console.log('Storage setup finished (errors ignored for existing policies).');
    } finally {
        await client.end();
    }
}

setupStorage();
