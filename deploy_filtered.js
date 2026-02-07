import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

        console.log("Connected! Starting filtered deployment...");
        // Use absolute path for remote root to avoid CWD issues
        const remoteRoot = "/domains/streetmoneyman.com/public_html";
        const localDist = path.join(__dirname, "dist");
        const localAssets = path.join(localDist, "assets");

        // RESET CWD to root first
        await client.cd("/");

        // 1. Upload index.html
        console.log("Uploading index.html...");
        await client.uploadFrom(path.join(localDist, "index.html"), remoteRoot + "/index.html");

        // 2. Upload Admin files if they exist in dist or root (admin is usually static in public)
        // Check if admin.html is in dist
        if (fs.existsSync(path.join(localDist, "admin.html"))) {
            console.log("Uploading admin.html...");
            await client.uploadFrom(path.join(localDist, "admin.html"), remoteRoot + "/admin.html");
        } else if (fs.existsSync(path.join(__dirname, "public/admin.html"))) {
            // It might be in public source if not processed by vite into dist root (vite copies public to dist)
            console.log("Uploading admin.html from public...");
            await client.uploadFrom(path.join(__dirname, "public/admin.html"), remoteRoot + "/admin.html");
        }

        // 3. Upload Assets (excluding hero.mp4)
        console.log("Uploading assets (skipping .mp4 files)...");
        await client.ensureDir(remoteRoot + "/assets");

        // Read assets directory
        const files = fs.readdirSync(localAssets);

        for (const file of files) {
            if (file.endsWith('.mp4')) {
                console.log(`Skipping video file: ${file}`);
                continue;
            }

            const localFile = path.join(localAssets, file);
            // Check if it's a directory (like gugd subfolder)
            if (fs.statSync(localFile).isDirectory()) {
                console.log(`Processing subfolder: ${file}`);
                await client.ensureDir(remoteRoot + `/assets/${file}`);
                const subFiles = fs.readdirSync(localFile);
                for (const subFile of subFiles) {
                    if (subFile.endsWith('.mp4')) {
                        console.log(`Skipping video file in subfolder: ${subFile}`);
                        continue;
                    }
                    console.log(`Uploading ${file}/${subFile}...`);
                    await client.uploadFrom(path.join(localFile, subFile), remoteRoot + `/assets/${file}/${subFile}`);
                }
            } else {
                console.log(`Uploading ${file}...`);
                await client.uploadFrom(localFile, remoteRoot + `/assets/${file}`);
            }
        }

        console.log("Filtered deployment complete!");
    } catch (err) {
        console.error("Deployment Failed:", err);
        process.exit(1);
    }
    client.close();
}

deploy();
