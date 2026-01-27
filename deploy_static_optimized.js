import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployDistRoot() {
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

        console.log("Connected. Deploying DIST contents to public_html (surgical)...");

        // Target is public_html directly
        await client.ensureDir("public_html");

        // Upload dist contents
        await client.uploadFromDir(path.join(__dirname, "dist"), "public_html");

        console.log("Clean App Deployment Complete!");

    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deployDistRoot();
