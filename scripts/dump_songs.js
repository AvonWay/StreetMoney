import { supabase } from '../src/supabase.js';
import fs from 'fs';

async function dumpSongs() {
    try {
        console.log('Fetching songs from Supabase...');
        const { data: songs, error } = await supabase
            .from('songs')
            .select('*');

        if (error) {
            console.error('Supabase Error:', error);
            process.exit(1);
        }

        console.log(`Fetched ${songs.length} songs.`);
        fs.writeFileSync('scripts/songs_dump.json', JSON.stringify(songs, null, 2));
        console.log('Dumped to scripts/songs_dump.json');
    } catch (e) {
        console.error('Crash:', e);
        process.exit(1);
    }
}

dumpSongs();
