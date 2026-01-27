import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployHtaccess() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("Connecting...");
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected.");
        await client.cd("public_html");

        console.log("Uploading .htaccess...");
        // Upload from public/.htaccess directly
        await client.uploadFrom(path.join(__dirname, "public", ".htaccess"), ".htaccess");

        console.log("Done.");
    } catch (err) {
        console.error(err);
    }
    client.close();
}

deployHtaccess();
