const baseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1/songs';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
};

const songs = [
    "10 GANG COMMANDMENTS - STREETZ -03.mp3",
    "1766522919990-703956003-Some niggas x 4eveabang.mp3",
    "FHF x street -05.mp3",
    "Ima sinner x streets x dboy x unrprophet 16.mp3",
    "Makw it right -09.mp3",
    "Numbers story x streets -14.mp3",
    "Outside x streets -15.mp3",
    "What ya life like x streets x storm -08.mp3",
    "fallen-10.mp3",
    "k wit me x streets x Amg x -05.mp3",
    "loving like this x streets x unr prophet x queen -06.mp3",
    "over the hill x streets x amg -07.mp3",
    "thoughts 2 x streets 17.mp3",
    "top down x streets -02.mp3",
    "you lied x streets x choc mic x xion x unr prophet -12.mp3"
];

async function checkExists(url) {
    try {
        const res = await fetch(`${baseUrl}?url=eq.${encodeURIComponent(url)}&select=id`, { headers });
        const data = await res.json();
        return data.length > 0;
    } catch (e) {
        return false;
    }
}

async function insertSong(filename) {
    const name = filename.replace('.mp3', '');
    const STORAGE_URL = 'https://tlzasuzpxrcphoxojwvk.supabase.co/storage/v1/object/public/uploads';
    // Use encodeURIComponent for the URL part but keep the name readable
    const url = `${STORAGE_URL}/${encodeURIComponent(filename)}`;
    const song = {
        name: name,
        url: url,
        created_at: new Date().toISOString()
    };

    try {
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(song)
        });
        if (res.ok) console.log('Inserted: ' + name);
        else console.log('Failed to insert ' + name + ': ' + await res.text());
    } catch (e) {
        console.log('Error inserting ' + name + ': ' + e.message);
    }
}

async function seedSongs() {
    console.log(`Processing ${songs.length} songs...`);
    const STORAGE_URL = 'https://tlzasuzpxrcphoxojwvk.supabase.co/storage/v1/object/public/uploads';

    for (const filename of songs) {
        // Must match the format used in insertSong
        const url = `${STORAGE_URL}/${encodeURIComponent(filename)}`;
        if (await checkExists(url)) {
            console.log(`Skipped (exists): ${filename}`);
        } else {
            await insertSong(filename);
        }
    }
    console.log('Done.');
}

seedSongs();
