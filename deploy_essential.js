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

        console.log("Connected! Uploading essential files...");
        const remoteRoot = "public_html";

        // Upload index.html
        console.log("Uploading index.html...");
        await client.uploadFrom(path.join(__dirname, "dist/index.html"), remoteRoot + "/index.html");

        // Upload assets folder (JS and CSS)
        console.log("Uploading assets folder...");
        await client.ensureDir(remoteRoot + "/assets");
        await client.uploadFromDir(path.join(__dirname, "dist/assets"), remoteRoot + "/assets");

        console.log("Essential files deployment complete!");
    } catch (err) {
        console.error("Deployment Failed:", err);
        process.exit(1);
    }
    client.close();
}

deploy();
