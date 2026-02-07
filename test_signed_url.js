import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignedUrl() {
    // 1. Get a filename from the bucket
    const { data: files } = await supabase.storage.from('uploads').list(null, { limit: 1 });

    if (!files || files.length === 0) {
        console.log('No files found to test.');
        return;
    }

    const filename = files[0].name;
    console.log(`Testing with file: ${filename}`);

    // 2. Create Signed URL
    const { data, error } = await supabase
        .storage
        .from('uploads')
        .createSignedUrl(filename, 60); // 60 seconds

    if (error) {
        console.log('Error creating signed URL:', error);
        return;
    }

    console.log('Signed URL:', data.signedUrl);

    // 3. Test Fetch
    try {
        const res = await fetch(data.signedUrl);
        console.log(`Fetch Status: ${res.status} ${res.statusText}`);
    } catch (e) {
        console.log('Fetch Error:', e.message);
    }
}

testSignedUrl();
