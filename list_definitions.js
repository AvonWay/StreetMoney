const baseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co/rest/v1/';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos'
};

fetch(baseUrl, { headers })
    .then(res => res.json())
    .then(data => {
        // PostgREST returns OpenAPI format.
        // properties keys are tables.
        if (data.definitions) {
            console.log("Tables found:", Object.keys(data.definitions));
            // Log Video Columns specifically
            if (data.definitions.videos) {
                console.log("Videos columns:", Object.keys(data.definitions.videos.properties));
            }
            if (data.definitions.songs) console.log("Songs columns:", Object.keys(data.definitions.songs.properties));
            if (data.definitions.content) console.log("Content columns:", Object.keys(data.definitions.content.properties));
        } else {
            console.log("Root content keys:", Object.keys(data));
        }
    })
    .catch(e => console.log(e));
