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
        // Check current directory
        console.log("Current remote directory: " + await client.pwd());

        // Ensure we are in public_html
        await client.cd("/");
        await client.cd("public_html");
        console.log("Changed to public_html. Current directory: " + await client.pwd());

        // console.log("Clearing remote directory...");
        // await client.clearWorkingDir();


        await client.uploadFromDir(path.join(__dirname, "dist"), ".");

        console.log("Deployment complete!");
    } catch (err) {
        console.error("Deployment Failed:", err);
        process.exit(1);
    }
    client.close();
}

deploy();
