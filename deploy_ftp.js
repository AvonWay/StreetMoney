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
            secure: true, // Hostinger requires FTPS
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected! Uploading dist to public_html...");

        // Upload everything from static_version to public_html
        await client.ensureDir("public_html");
        await client.clearWorkingDir(); // Careful: This deletes everything in public_html first!

        await client.uploadFromDir(path.join(__dirname, "dist"), "public_html");

        console.log("Deployment complete!");
    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deploy();
