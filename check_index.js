import ftp from 'basic-ftp';

async function checkIndex() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; 

    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Listing public_html/index.html...");
        const list = await client.list("public_html");
        const indexFile = list.find(f => f.name === 'index.html');

        if (indexFile) {
            console.log(`Found index.html: Size=${indexFile.size}, Date=${indexFile.modifiedAt}`);
        } else {
            console.log("index.html NOT found in public_html");
        }

        // Also check if 'dist' folder still exists (legacy)
        const distFolder = list.find(f => f.name === 'dist' && f.isDirectory);
        console.log(`Legacy 'dist' folder exists: ${!!distFolder}`);

    } catch (err) {
        console.error("Check Failed:", err);
    }
    client.close();
}

checkIndex();
