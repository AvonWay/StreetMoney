import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deploySpecificAssets() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    const filesToUpload = [
        "fight-card-updated.jpg",
        "fight-poster.jpg",
        "face-off.png",
        "graffiti.jpg",
        "gift-from-streets.jpg",
        "track-selection-updated.jpg",
        "hero-bg.jpg"
    ];

    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected! Uploading specific images...");

        await client.ensureDir("public_html/assets");

        for (const file of filesToUpload) {
            const localPath = path.join(__dirname, "dist", "assets", file);
            console.log(`Uploading ${file}...`);
            await client.uploadFrom(localPath, file); // upload to current dir (public_html/assets)
        }

        console.log("Specific Assets Deployment Complete!");

    } catch (err) {
        console.error("Assets Deployment Failed:", err);
        process.exit(1);
    }
    client.close();
}

deploySpecificAssets();
