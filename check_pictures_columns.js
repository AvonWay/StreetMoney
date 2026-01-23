const baseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1/pictures';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos'
};

async function check(col) {
    try {
        const res = await fetch(baseUrl + '?select=' + col + '&limit=1', { headers });
        if (res.ok) console.log('SUCCESS: ' + col);
        else console.log('FAIL: ' + col);
    } catch (e) { console.log('ERR: ' + e.message); }
}

const cols = ['url', 'file_url', 'image_url', 'src', 'path'];
(async () => {
    for (const c of cols) await check(c);
})();
