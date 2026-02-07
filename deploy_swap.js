import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deploySwap() {
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

        console.log("Connected! Starting Swap Deployment...");

        await client.cd("/");
        await client.cd("public_html");

        // 1. Upload new index as index_new.html
        console.log("Uploading index_new.html...");
        await client.uploadFrom(path.join(__dirname, "dist", "index.html"), "index_new.html");

        // 2. Rename current index.html to index_backup.html (if it exists)
        console.log("Backing up current index.html...");
        try {
            await client.rename("index.html", "index_backup_" + Date.now() + ".html");
        } catch (e) {
            console.log("Could not rename index.html (maybe it doesn't exist?): " + e.message);
        }

        // 3. Rename index_new.html to index.html
        console.log("Activating new index.html...");
        await client.rename("index_new.html", "index.html");

        console.log("Swap Deployment Complete!");

    } catch (err) {
        console.error("Swap Deployment Failed:", err);
        process.exit(1);
    }
    client.close();
}

deploySwap();
