import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployDebug() {
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

        // Check PWD
        console.log("Current Dir:", await client.pwd());

        // Enter public_html
        await client.ensureDir("public_html");
        console.log("Entered public_html. PWD:", await client.pwd());

        // Upload ONE file explicitly
        const localFile = path.join(__dirname, "static_version", "index.html");
        console.log("Uploading index.html from:", localFile);

        await client.uploadFrom(localFile, "index.html");
        console.log("Upload finished.");

        // List files
        const list = await client.list();
        console.log("--- Directory Listing ---");
        if (list.length === 0) console.log("(Empty)");
        list.forEach(f => console.log(`[${f.type === 1 ? 'D' : 'F'}] ${f.name} - ${f.size}`));
        console.log("-------------------------");

    } catch (err) {
        console.error("Debug Error:", err);
    }
    client.close();
}

deployDebug();
