import fetch from 'node-fetch';

const baseUrl = 'https://streetmoneyman.com';
const assets = [
    '/assets/fight-card-updated.jpg',
    '/assets/fight-poster.jpg',
    '/assets/face-off.png',
    '/assets/graffiti.jpg',
    '/assets/gift-from-streets.jpg'
];

async function checkAssets() {
    console.log(`Checking assets on ${baseUrl}...`);

    for (const path of assets) {
        try {
            const url = baseUrl + path;
            const res = await fetch(url, { method: 'HEAD' });
            console.log(`${path}: ${res.status} ${res.statusText}`);
        } catch (e) {
            console.log(`${path}: Error - ${e.message}`);
        }
    }
}

checkAssets();
