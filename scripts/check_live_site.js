async function checkLiveSite() {
    try {
        console.log('Checking https://streetmoneyman.com...');
        const response = await fetch('https://streetmoneyman.com');
        console.log(`Response Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const text = await response.text();
            console.log(`Page Size: ${text.length} bytes`);
            console.log('Site is accessible.');
        } else {
            console.error('Site returned an error.');
        }
    } catch (e) {
        console.error('Failed to connect:', e.message);
    }
}

checkLiveSite();
