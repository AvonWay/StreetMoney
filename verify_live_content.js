import fetch from 'node-fetch';

const url = 'https://streetmoneyman.com/index.html';

async function checkContent() {
    try {
        console.log(`Fetching ${url}...`);
        const res = await fetch(url);
        const text = await res.text();

        console.log("Status:", res.status);

        // Check for specific markers of new code
        const hasDownloadButton = text.includes('Download Album') || text.includes('Download Discog');
        const hasGallery = text.includes('Latest <span className="text-gold-600">Events</span>') || text.includes('Latest Events');

        console.log("Has 'Download Album' text (in HTML?):", hasDownloadButton);
        // Note: React apps often render empty root divs, so text might be in JS files, not HTML.
        // We probably need to check the JS files if the HTML is just a shell.

        // Let's find the main JS file
        const jsMatch = text.match(/src="\/assets\/index-([a-zA-Z0-9_]+)\.js"/);
        if (jsMatch) {
            const jsUrl = url + `assets/index-${jsMatch[1]}.js`;
            const foundHash = jsMatch[1];
            const expectedHash = "itNWg_2p";
            console.log("FOUND_HASH: " + foundHash);
            console.log("EXPECTED_HASH: " + expectedHash);
            console.log("HASH_MATCH: " + (foundHash === expectedHash));

            const jsRes = await fetch(jsUrl);
            const jsText = await jsRes.text();

            const jsHasDownload = jsText.includes('Download Album');
            const jsHasGallery = jsText.includes('/assets/fight-card-updated.jpg');

            console.log("CHECK_RESULTS:");
            console.log("JS_HAS_DOWNLOAD_BUTTON: " + jsHasDownload);
            console.log("JS_HAS_GALLERY: " + jsHasGallery);
        } else {
            console.log("Could not find index.js script tag in HTML.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkContent();
