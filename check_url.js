// using global fetch


const url = 'https://tlzasuzpxrcphoxojwvk.supabase.co/storage/v1/object/public/media/1737674274284-BlockHouse.mp4';

async function check() {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`Status: ${res.status} ${res.statusText}`);
        console.log(`Type: ${res.headers.get('content-type')}`);
        console.log(`Size: ${res.headers.get('content-length')}`);
    } catch (e) {
        console.error(e);
    }
}
check();
