import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://tlzasuzpxrcphoxojwvk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemFzdXpweHJjcGhveG9qd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTg5MDUsImV4cCI6MjA4MzYzNDkwNX0.-GVcPXaaFiecgZCee_HfXlNlvWIvH5YF825bChXoQos';
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function uploadAll() {
    if (!fs.existsSync(uploadsDir)) {
        console.log('Uploads directory not found!');
        return;
    }

    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.mp3'));
    console.log(`Found ${files.length} MP3 files to upload.`);

    for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const fileBuffer = fs.readFileSync(filePath);

        console.log(`Uploading ${file}...`);

        const { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(file, fileBuffer, {
                contentType: 'audio/mpeg',
                upsert: true
            });

        if (error) {
            console.log(`Failed to upload ${file}:`, error.message);
        } else {
            console.log(`Success: ${file}`);
        }
    }
    console.log('All uploads finished.');
}

uploadAll();
