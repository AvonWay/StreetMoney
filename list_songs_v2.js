const baseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1/songs';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos'
};

async function listSongs() {
    try {
        const res = await fetch(baseUrl + '?select=*', { headers });
        if (res.ok) {
            const data = await res.json();
            console.log('Songs found:', data.length);
            console.log(data);
        } else {
            console.log('FAIL: ' + res.status + ' ' + res.statusText);
        }
    } catch (e) { console.log('ERR: ' + e.message); }
}

listSongs();
