const fetch = require('node-fetch'); // Wait, use native fetch if node 18, else require. 
// Assuming node 18+ based on successful previous run of temp_fetch_v2 but logic was tricky.
// I'll use the same syntax as temp_fetch_v2.js which worked (fetch global).

const baseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1/videos';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos'
};

async function checkColumn(col) {
    try {
        const res = await fetch(`${baseUrl}?select=${col}&limit=1`, { headers });
        if (res.ok) {
            console.log(`[SUCCESS] Column '${col}' exists.`);
        } else {
            const text = await res.text();
            console.log(`[FAIL] Column '${col}' error: ${text}`);
        }
    } catch (e) { console.log(e); }
}

const cols = ['url', 'file_url', 'video_url', 'link', 'embed_url', 'content_url', 'path'];

(async () => {
    for (const c of cols) {
        await checkColumn(c);
    }
})();
