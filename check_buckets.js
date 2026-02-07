import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
    const bucketName = 'uploads';
    console.log(`Checking bucket: ${bucketName}`);

    let allFiles = [];
    let offset = 0;
    let batchSize = 100;
    let loop = true;

    while (loop) {
        const { data: files, error: listError } = await supabase.storage.from(bucketName).list(null, { limit: batchSize, offset: offset });
        if (listError) {
            console.log(`Error listing ${bucketName}:`, listError);
            loop = false;
        } else {
            if (files && files.length > 0) {
                allFiles = allFiles.concat(files);
                offset += files.length;
                if (files.length < batchSize) loop = false;
            } else {
                loop = false;
            }
        }
    }

    console.log(`--- Files in ${bucketName} (${allFiles.length}) ---`);
    allFiles.forEach(f => console.log(f.name));
}

checkBuckets();
