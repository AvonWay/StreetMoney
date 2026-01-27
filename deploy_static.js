import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployStatic() {
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

        console.log("Connected. Deploying STATIC SITE to public_html...");

        // Strategy: Upload dist contents directly to public_html
        // We use ensureDir to make sure we are at root if needed, but we target public_html

        await client.ensureDir("public_html");
        await client.uploadFromDir(path.join(__dirname, "dist"), "public_html");

        console.log("Static Site Deployment Complete!");

    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deployStatic();
