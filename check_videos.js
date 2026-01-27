import ftp from 'basic-ftp';

async function checkVideos() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Listing public_html/videos...");
        const list = await client.list("public_html/videos");
        if (list.length === 0) {
            console.log("No videos found in public_html/videos.");
        } else {
            console.log("Found videos:");
            list.forEach(f => console.log(`- ${f.name} (${f.size})`));
        }

    } catch (err) {
        console.error("Listing Failed:", err);
    }
    client.close();
}

checkVideos();
