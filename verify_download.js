import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDownload() {
    // 1. Get a song URL from the DB
    const { data: songs, error } = await supabase
        .from('songs')
        .select('name, url')
        .limit(1);

    if (error) {
        console.error('Error fetching song:', error);
        return;
    }

    if (songs.length === 0) {
        console.log('No songs in DB to test.');
        return;
    }

    const song = songs[0];
    console.log(`Testing URL for: ${song.name}`);
    console.log(`URL: ${song.url}`);

    try {
        const res = await fetch(song.url, { method: 'HEAD' });
        console.log(`Status: ${res.status} ${res.statusText}`);

        if (!res.ok) {
            const getBody = await fetch(song.url);
            const text = await getBody.text();
            console.log('Error Body:', text);
        } else {
            console.log('URL is accessible.');
        }

    } catch (e) {
        console.error('Fetch error:', e.message);
    }
}

verifyDownload();
