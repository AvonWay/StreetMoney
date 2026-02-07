import { supabase } from '../src/supabase.js';
import fs from 'fs';

async function fixSongs() {
    console.log('Fetching songs to audit...');
    const { data: songs, error } = await supabase
        .from('songs')
        .select('*');

    if (error) {
        console.error('Error fetching songs:', error);
        return;
    }

    const songsToDelete = songs.filter(song =>
        !song.url ||
        song.url.trim() === '' ||
        song.url.startsWith('/uploads/')
    );

    if (songsToDelete.length === 0) {
        console.log('No invalid songs found.');
        return;
    }

    console.log(`Found ${songsToDelete.length} invalid songs.`);
    console.log('Deleting...');

    const idsToDelete = songsToDelete.map(s => s.id);
    const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .in('id', idsToDelete);

    if (deleteError) {
        console.error('Error deleting songs:', deleteError);
    } else {
        console.log('Successfully deleted invalid songs.');
        console.log('Deleted Songs Report:');
        songsToDelete.forEach(s => console.log(`- ${s.name} (${s.url})`));

        // Save report to file
        fs.writeFileSync('scripts/deleted_songs_report.txt',
            songsToDelete.map(s => `${s.name} | ${s.url}`).join('\n')
        );
    }
}

fixSongs();
