import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected! Uploading music.json...");
        const remoteRoot = "public_html";
        await client.ensureDir(remoteRoot + "/public/data");
        await client.uploadFrom(path.join(__dirname, "public/data/music.json"), remoteRoot + "/public/data/music.json");
        console.log("music.json uploaded successfully!");

    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deploy();
