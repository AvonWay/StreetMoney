import ftp from 'basic-ftp';

async function checkNested() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Listing public_html/public_html...");
        const list = await client.list("public_html/public_html");
        console.log(list.map(f => f.name));

    } catch (err) {
        console.error("Listing Failed:", err);
    }
    client.close();
}

checkNested();
