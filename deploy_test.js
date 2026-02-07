import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployTest() {
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

        console.log("Connected! Uploading test.html...");

        // Try uploading to public_html/test.html
        await client.uploadFrom(path.join(__dirname, "dist", "index.html"), "public_html/test.html");

        console.log("Test Deployment Complete!");

    } catch (err) {
        console.error("Test Deployment Failed:", err);
        process.exit(1);
    }
    client.close();
}

deployTest();
