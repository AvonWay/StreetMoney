const fs = require('fs');
const path = require('path');

const baseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1/songs';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
};

const uploadsDir = path.join(__dirname, 'public', 'uploads');

async function checkExists(url) {
    try {
        const res = await fetch(`${baseUrl}?url=eq.${encodeURIComponent(url)}&select=id`, { headers });
        const data = await res.json();
        return data.length > 0;
    } catch (e) {
        return false;
    }
}

async function insertSong(song) {
    try {
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(song)
        });
        if (res.ok) console.log('Inserted: ' + song.name);
        else console.log('Failed to insert ' + song.name + ': ' + await res.text());
    } catch (e) {
        console.log('Error inserting ' + song.name + ': ' + e.message);
    }
}

async function seedSongs() {
    try {
        const files = fs.readdirSync(uploadsDir);
        const songs = files.filter(file => file.endsWith('.mp3')).map(file => {
            return {
                name: path.parse(file).name,
                url: `/uploads/${file}`,
                created_at: new Date().toISOString()
            };
        });

        console.log(`Found ${songs.length} songs. Processing...`);

        for (const song of songs) {
            if (await checkExists(song.url)) {
                console.log(`Skipped (exists): ${song.name}`);
            } else {
                await insertSong(song);
            }
        }
        console.log('Done.');

    } catch (err) {
        console.error('Error:', err);
    }
}

seedSongs();
