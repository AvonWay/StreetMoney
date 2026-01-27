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
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected!");
        await client.cd("public_html");

        console.log("Deleting remote index.html...");
        try {
            await client.remove("index.html");
            console.log("Deleted index.html successfully.");
        } catch (e) {
            console.log("Could not delete index.html (might not exist): " + e.message);
        }

        console.log("Uploading new index.html...");
        await client.uploadFrom(path.join(__dirname, "dist", "index.html"), "index.html");

        console.log("Deployment of index.html complete!");
    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deploy();
