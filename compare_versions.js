import ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function compareVersions() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected to FTP.");
        await client.cd("/");
        await client.cd("public_html");

        console.log("Downloading remote index.html...");
        await client.downloadTo("remote_index.html", "index.html");

        // Read files
        const localIndex = fs.readFileSync(path.join(__dirname, "dist", "index.html"), 'utf8');
        const remoteIndex = fs.readFileSync("remote_index.html", 'utf8');

        // Extract hashes
        const localHash = localIndex.match(/src="\/assets\/index-([a-zA-Z0-9_]+)\.js"/)?.[1];
        const remoteHash = remoteIndex.match(/src="\/assets\/index-([a-zA-Z0-9_]+)\.js"/)?.[1];

        console.log("---------------------------------------------------");
        console.log(`LOCAL BUILD HASH:  ${localHash}`);
        console.log(`REMOTE FILE HASH:  ${remoteHash}`);
        console.log("---------------------------------------------------");

        if (localHash === remoteHash) {
            console.log("MATCH: The file on the FTP server IS the new version.");
            console.log("Conclusion: The web server (Apache/Nginx) is caching old content.");
        } else {
            console.log("MISMATCH: The file on the FTP server is STILL the old version.");
            console.log("Conclusion: The upload is failing to overwrite the file.");
        }

    } catch (err) {
        console.error("Comparison Failed:", err);
    }
    client.close();
}

compareVersions();
