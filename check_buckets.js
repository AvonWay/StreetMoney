import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) console.log("List Buckets Error:", error);
    else {
        console.log("Buckets:", data);
        for (const bucket of data) {
            const { data: files, error: listError } = await supabase.storage.from(bucket.name).list();
            if (listError) console.log(`Error listing ${bucket.name}:`, listError);
            else {
                console.log(`--- Files in ${bucket.name} (${files.length}) ---`);
                files.slice(0, 5).forEach(f => console.log(f.name));
            }
        }
    }
}

checkBuckets();
