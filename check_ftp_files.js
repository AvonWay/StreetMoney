import ftp from 'basic-ftp';

async function check() {
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

        console.log("Listing /domains/streetmoneyman.com/public_html...");
        const publicList = await client.list("/domains/streetmoneyman.com/public_html");
        console.log("public_html files:", publicList.map(f => f.name));

        console.log("Listing /domains/streetmoneyman.com/public_html/assets...");
        const assetsList = await client.list("/domains/streetmoneyman.com/public_html/assets");
        console.log("assets files:", assetsList.map(f => f.name));

    } catch (err) {
        console.error("Check Failed:", err);
    }
    client.close();
}

check();
