const baseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos'
};

async function checkTable(table) {
    try {
        const res = await fetch(`${baseUrl}/${table}?select=*&limit=1`, { headers });
        if (res.ok) console.log(`[SUCCESS] Table '${table}' exists.`);
        else {
            // 404 means table usually doesn't exist in PostgREST (or strict permissions)
            console.log(`[FAIL] Table '${table}' status: ${res.status}`);
        }
    } catch (e) { console.log(e); }
}

const tables = ['songs', 'videos', 'media', 'music', 'content'];

(async () => {
    for (const t of tables) await checkTable(t);
})();
