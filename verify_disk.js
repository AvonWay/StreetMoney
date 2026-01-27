import ftp from 'basic-ftp';
import fs from 'fs';

async function verifyDiskContent() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Downloading public_html/index.html...");
        await client.downloadTo("downloaded_index_root.html", "public_html/index.html");

        console.log("Downloading public_html/dist/index.html...");
        try {
            await client.downloadTo("downloaded_index_dist.html", "public_html/dist/index.html");
        } catch (e) {
            console.log("Could not download dist/index.html: " + e.message);
        }

        const rootContent = fs.readFileSync("downloaded_index_root.html", "utf8");
        console.log("\n--- Root index.html content ---");
        console.log(rootContent.substring(0, 500));

    } catch (err) {
        console.error("Download Failed:", err);
    }
    client.close();
}

verifyDiskContent();
