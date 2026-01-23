import ftp from 'basic-ftp';

async function check() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected! Listing /public_html...");
        const list = await client.list("public_html");

        console.log("--- Remote Files ---");
        list.forEach(f => console.log(`- ${f.name} (${f.size} bytes)`));
        console.log("--------------------");

    } catch (err) {
        console.error("Check Failed:", err);
    }
    client.close();
}

check();
