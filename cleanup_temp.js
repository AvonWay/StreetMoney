import { Client } from "basic-ftp";

async function cleanup() {
    const client = new Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "46.202.197.87",
            user: "u234209809",
            password: "StreetMoney$60",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected! removing temp file...");
        const tempFile = "/domains/streetmoneyman.com/public_html/assets/.in.gugd-event-vendor.jpg.";
        try {
            await client.remove(tempFile);
            console.log("Removed:", tempFile);
        } catch (e) {
            console.log("Error removing file (might not exist):", e.message);
        }

    } catch (err) {
        console.error("Cleanup Failed:", err);
    }
    client.close();
}

cleanup();
