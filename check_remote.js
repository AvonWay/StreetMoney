import ftp from 'basic-ftp';
import fs from 'fs';

async function checkRemote() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; // Turn off verbose to keep log clean

    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        let log = "--- public_html ---\n";
        const list1 = await client.list("public_html");
        log += JSON.stringify(list1, null, 2) + "\n\n";

        log += "--- public_html/public ---\n";
        try {
            const list2 = await client.list("public_html/public");
            log += JSON.stringify(list2, null, 2) + "\n\n";
        } catch (e) { log += "Error listing public_html/public: " + e.message + "\n"; }

        log += "--- public_html/public/data ---\n";
        try {
            const list3 = await client.list("public_html/public/data");
            log += JSON.stringify(list3, null, 2) + "\n\n";
        } catch (e) { log += "Error listing public_html/public/data: " + e.message + "\n"; }

        fs.writeFileSync('remote_listing.log', log);
        console.log("Listing saved to remote_listing.log");

    } catch (err) {
        console.error("Listing Failed:", err);
    }
    client.close();
}

checkRemote();
