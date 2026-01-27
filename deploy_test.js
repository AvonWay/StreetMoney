import ftp from 'basic-ftp';
import fs from 'fs';

async function deployTest() {
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

        // create a dummy file
        fs.writeFileSync("test_verify.html", "<h1>VERIFIED PATH OK</h1>");

        await client.cd("public_html");
        console.log("Uploading test_verify.html to public_html...");
        await client.uploadFrom("test_verify.html", "test_verify.html");

        console.log("Done. Check https://streetmoneyman.com/test_verify.html");
    } catch (err) {
        console.error(err);
    }
    client.close();
}

deployTest();
