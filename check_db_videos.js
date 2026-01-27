import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) console.log("Error:", error);
    else {
        console.log("Videos found:", data.length);
        data.forEach(v => {
            console.log(`- ID: ${v.id}, Name: ${v.name}, Type: ${v.video_type}`);
            console.log(`  URL: ${v.video_url || v.url}`);
        });
    }
}

check();
