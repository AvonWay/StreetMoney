import ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployCodeOnly() {
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

        console.log("Connected. Deploying INDEX and JS/CSS to BOTH Root and Dist...");

        // 1. Upload index.html (Root & Dist)
        console.log("Uploading index.html...");
        await client.uploadFrom(path.join(__dirname, "dist/index.html"), "public_html/index.html");
        await client.ensureDir("public_html/dist");
        await client.uploadFrom(path.join(__dirname, "dist/index.html"), "public_html/dist/index.html");

        // 2. Upload .htaccess (Root & Dist)
        if (fs.existsSync(path.join(__dirname, "dist/.htaccess"))) {
            console.log("Uploading .htaccess...");
            await client.uploadFrom(path.join(__dirname, "dist/.htaccess"), "public_html/.htaccess");
            await client.uploadFrom(path.join(__dirname, "dist/.htaccess"), "public_html/dist/.htaccess");
        }

        // 3. Upload assets folder (Root & Dist)
        console.log("Uploading assets...");
        await client.ensureDir("public_html/assets");
        await client.uploadFromDir(path.join(__dirname, "dist/assets"), "public_html/assets");

        await client.ensureDir("public_html/dist/assets");
        await client.uploadFromDir(path.join(__dirname, "dist/assets"), "public_html/dist/assets");

        console.log("Double Deployment Complete!");

    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deployCodeOnly();
