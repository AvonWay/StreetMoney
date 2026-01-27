const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listSongs() {
    const { data, error } = await supabase
        .from('songs')
        .select('*');

    if (error) {
        console.error('Error fetching songs:', error);
    } else {
        console.log('Songs found:', data.length);
        console.log(data);
    }
}

listSongs();
