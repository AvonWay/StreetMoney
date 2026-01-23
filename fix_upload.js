import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fixUpload() {
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

        console.log("Connected. Starting Fix Upload...");

        await client.cd("/");

        console.log("Uploading music.json to public/data...");
        await client.ensureDir("public_html/public/data");
        await client.cd("/");
        await client.uploadFrom(
            path.join(__dirname, "public/data/music.json"),
            "public_html/public/data/music.json"
        );

        console.log("Uploading music.json to dist/data (LIVE SITE)...");
        await client.ensureDir("public_html/dist/data");
        await client.cd("/");
        await client.uploadFrom(
            path.join(__dirname, "public/data/music.json"),
            "public_html/dist/data/music.json"
        );

        console.log("Uploading fallen-10.mp3...");
        await client.ensureDir("public_html/public/uploads");
        await client.cd("/");
        await client.uploadFrom(
            path.join(__dirname, "public/uploads/fallen-10.mp3"),
            "public_html/public/uploads/fallen-10.mp3"
        );

        console.log("Verifying upload...");
        const dataList = await client.list("public_html/dist/data");
        console.log("Files in dist/data:", dataList.map(f => `${f.name} (${f.size})`));

    } catch (err) {
        console.error("Fix Upload Failed:", err);
    }
    client.close();
}

fixUpload();
