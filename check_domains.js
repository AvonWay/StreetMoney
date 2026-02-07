import ftp from 'basic-ftp';

async function checkDomains() {
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

        console.log("Listing /domains...");
        const domainsList = await client.list("/domains");
        console.log("Domains files:", domainsList.map(f => f.name));

        if (domainsList.length > 0) {
            for (const domain of domainsList) {
                console.log(`Listing /domains/${domain.name}...`);
                const subList = await client.list(`/domains/${domain.name}`);
                console.log(`Contents of ${domain.name}:`, subList.map(f => f.name));
            }
        }

    } catch (err) {
        console.error("Check Failed:", err);
    }
    client.close();
}

checkDomains();
