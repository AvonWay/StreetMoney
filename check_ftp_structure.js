import ftp from 'basic-ftp';

async function listRoot() {
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
        await client.cd("/");
        console.log("Root files:");
        let list = await client.list();
        console.log(list.map(f => f.name));

        await client.cd("public_html");
        console.log("public_html files:");
        list = await client.list();
        console.log(list.map(f => f.name));

    } catch (e) { console.error(e); }
    client.close();
}
listRoot();
