import ftp from 'basic-ftp';
import fs from 'fs';

async function verify() {
    const client = new ftp.Client();
    client.ftp.verbose = false; // Reduce noise

    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        // 1. Upload test.txt
        fs.writeFileSync('test.txt', 'Hello Hostinger');
        await client.ensureDir("public_html");
        await client.uploadFrom('test.txt', 'test.txt');
        console.log("Upload test.txt: Success");

        // 2. Download test.txt
        try {
            fs.unlinkSync('test_downloaded.txt');
        } catch (e) { }

        await client.downloadTo('test_downloaded.txt', 'test.txt');
        const content = fs.readFileSync('test_downloaded.txt', 'utf8');

        if (content === 'Hello Hostinger') {
            console.log("Download Verification: PASSED. File content matches.");
        } else {
            console.log("Download Verification: FAILED. Content mismatch.");
        }

    } catch (err) {
        console.error("Verification Failed:", err);
    }
    client.close();
}

verify();
