import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConfig() {
    // 1. Check bucket details
    const { data: bucket, error } = await supabase
        .storage
        .getBucket('uploads');

    if (error) {
        console.log('Error getting bucket:', error);
    } else {
        console.log('Bucket Config:', bucket);
    }

    // 2. Generate Public URL via SDK
    const { data: publicUrlData } = supabase
        .storage
        .from('uploads')
        .getPublicUrl('test_file.mp3');

    console.log('SDK Generated Public URL:', publicUrlData.publicUrl);
}

checkConfig();
