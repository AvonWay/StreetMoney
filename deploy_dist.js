import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployDist() {
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

        console.log("Connected. Deploying updated DIST only...");
        const remoteRoot = "public_html";

        await client.ensureDir(remoteRoot + "/dist");
        // We really want to replace the assets.
        // Vite generates new hashes, so accumulating files is okay-ish, but overwriting index.html is key.

        await client.uploadFromDir(path.join(__dirname, "dist"), remoteRoot + "/dist");
        console.log("Dist deployment complete!");

    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deployDist();
