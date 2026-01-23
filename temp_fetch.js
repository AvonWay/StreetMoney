const https = require('https');

const url = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1/videos?select=*&limit=1';
const options = {
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data);
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
