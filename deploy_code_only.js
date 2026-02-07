import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployCodeOnly() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected!");

        // Force navigation to public_html
        await client.cd("/");
        await client.cd("public_html");
        console.log("Current Directory: " + await client.pwd());

        // 1. Upload index.html
        // console.log("Deleting old index.html...");
        // try { await client.remove("index.html"); } catch (e) { console.log("No index.html to delete."); }

        console.log("Uploading index.html...");
        await client.uploadFrom(path.join(__dirname, "dist", "index.html"), "index.html");

        // 2. Upload JS/CSS from assets
        await client.ensureDir("assets"); // ensures public_html/assets exists

        const assetsDir = path.join(__dirname, "dist", "assets");
        const files = fs.readdirSync(assetsDir);

        for (const file of files) {
            if (file.endsWith('.js') || file.endsWith('.css')) {
                console.log(`Uploading ${file}...`);
                // Upload to assets/filename inside public_html
                await client.uploadFrom(path.join(assetsDir, file), `assets/${file}`);
            }
        }

        console.log("Corrected Code Deployment Complete!");

    } catch (err) {
        console.error("Code Deployment Failed:", err);
        process.exit(1);
    }
    client.close();
}

deployCodeOnly();
