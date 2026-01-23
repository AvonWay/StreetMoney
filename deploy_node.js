import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deploy() {
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

        console.log("Connected! Starting Node App Deployment...");

        const remoteRoot = "public_html";
        await client.ensureDir(remoteRoot);

        // 1. Upload 'dist' folder content to 'public_html/dist'
        // We clean remote dist first to ensure no stale files
        // But basic-ftp doesn't have easy recursive delete for non-empty folders without track
        // We will just overwrite.
        console.log("Uploading 'dist' folder...");
        await client.ensureDir(remoteRoot + "/dist");
        await client.uploadFromDir(path.join(__dirname, "dist"), remoteRoot + "/dist");

        // 2. Upload 'public' folder (for uploads/videos persistence structure)
        // Since 'public' -> 'dist' copy happens in build, 'dist' has them too at root?
        // Vite copies public/* to dist/*.
        // So dist/uploads and dist/videos exist.
        // server.js serves app.use(express.static(distPath)) -> matches /uploads/file
        // AND app.use('/uploads', express.static(uploadsDir)) -> matches /uploads/file from root public
        // So we should verify where we want them.
        // Let's upload 'public' to 'public_html/public' to support server.js logic
        console.log("Uploading 'public' folder (uploads/videos)...");
        await client.ensureDir(remoteRoot + "/public");
        await client.uploadFromDir(path.join(__dirname, "public"), remoteRoot + "/public");

        // 3. Upload Server Files
        console.log("Uploading server files...");
        await client.uploadFrom(path.join(__dirname, "server.js"), remoteRoot + "/server.js");
        await client.uploadFrom(path.join(__dirname, "package.json"), remoteRoot + "/package.json");
        await client.uploadFrom(path.join(__dirname, "database.js"), remoteRoot + "/database.js");

        console.log("Deployment complete! Please check the site.");
        console.log("Note: If dependencies changed, you might need to click 'NPM Install' in Hostinger panel.");

    } catch (err) {
        console.error("Deployment Failed:", err);
    }
    client.close();
}

deploy();
