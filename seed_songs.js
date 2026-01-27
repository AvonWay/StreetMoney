const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadsDir = path.join(__dirname, 'public', 'uploads');

async function seedSongs() {
    try {
        const files = fs.readdirSync(uploadsDir);
        const songs = files.filter(file => file.endsWith('.mp3')).map(file => {
            return {
                name: path.parse(file).name,
                url: `/uploads/${file}`,
                created_at: new Date()
            };
        });

        console.log(`Found ${songs.length} songs. Inserting...`);

        for (const song of songs) {
            // Check if exists to avoid duplicates (optional, based on url)
            const { data: existing } = await supabase.from('songs').select('id').eq('url', song.url).single();

            if (!existing) {
                const { error } = await supabase.from('songs').insert(song);
                if (error) console.error(`Error inserting ${song.name}:`, error.message);
                else console.log(`Inserted: ${song.name}`);
            } else {
                console.log(`Skipped (exists): ${song.name}`);
            }
        }

        console.log('Seeding complete.');

    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

seedSongs();
