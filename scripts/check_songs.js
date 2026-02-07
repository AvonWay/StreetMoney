import { supabase } from '../src/supabase.js';

async function checkSongs() {
    console.log('Fetching songs...');
    const { data: songs, error } = await supabase
        .from('songs')
        .select('*');

    if (error) {
        console.error('Error fetching songs:', error);
        return;
    }

    const results = {
        total: songs.length,
        validParams: 0,
        invalidParams: 0,
        brokenUrls: [],
        validUrls: []
    };

    const invalidParamSongs = songs.filter(song => !song.url || song.url.trim() === '');
    const potentialValidSongs = songs.filter(song => song.url && song.url.trim() !== '');

    results.invalidParams = invalidParamSongs.length;
    results.validParams = potentialValidSongs.length;

    // Add invalid param songs to report
    invalidParamSongs.forEach(s => results.brokenUrls.push({ name: s.name, id: s.id, reason: 'Empty URL field' }));

    console.log(`Checking reachability of ${potentialValidSongs.length} songs...`);

    for (const song of potentialValidSongs) {
        try {
            const response = await fetch(song.url, { method: 'HEAD' });

            if (response.status === 200) {
                const contentLength = response.headers.get('content-length');
                const contentType = response.headers.get('content-type');
                const size = contentLength ? parseInt(contentLength) : 0;

                if (size > 1000) {
                    results.validUrls.push({
                        name: song.name,
                        id: song.id,
                        url: song.url,
                        size: size,
                        type: contentType
                    });
                } else {
                    results.brokenUrls.push({
                        name: song.name,
                        id: song.id,
                        url: song.url,
                        reason: `File too small (${size} bytes)`,
                        status: response.status
                    });
                }
            } else {
                results.brokenUrls.push({
                    name: song.name,
                    id: song.id,
                    url: song.url,
                    reason: `HTTP Status ${response.status}`,
                    status: response.status
                });
            }
        } catch (e) {
            results.brokenUrls.push({
                name: song.name,
                id: song.id,
                url: song.url,
                reason: `Fetch Error: ${e.message}`
            });
        }
    }

    fs.writeFileSync('scripts/song_audit_results.json', JSON.stringify(results, null, 2));
    console.log('Audit complete. Results written to scripts/song_audit_results.json');
}

checkSongs().catch(err => {
    console.error('Fatal Error:', err);
    fs.writeFileSync('scripts/crash_log.txt', err.stack || err.message);
});
