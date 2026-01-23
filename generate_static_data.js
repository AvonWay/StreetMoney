import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');
const uploadsDir = path.join(publicDir, 'uploads');
const videosDir = path.join(publicDir, 'videos');

// Ensure data dir exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Generate Music JSON
const musicFiles = fs.existsSync(uploadsDir)
    ? fs.readdirSync(uploadsDir).filter(f => f.endsWith('.mp3'))
    : [];

const songs = musicFiles.map((filename, index) => ({
    id: index + 1,
    name: filename.split('-').slice(2).join('-').replace('.mp3', '') || filename,
    url: `/uploads/${filename}`,
    filename: filename,
    upload_date: new Date().toISOString()
}));

fs.writeFileSync(path.join(dataDir, 'music.json'), JSON.stringify(songs, null, 2));
console.log(`Generated music.json with ${songs.length} songs.`);

// 2. Generate Videos JSON
const videoFiles = fs.existsSync(videosDir)
    ? fs.readdirSync(videosDir).filter(f => /\.(mp4|mov|webm)$/i.test(f))
    : [];

const videos = videoFiles.map((filename, index) => ({
    id: index + 1,
    name: filename.split('-').slice(2).join('-').replace(/\.(mp4|mov|webm)$/i, '') || filename,
    url: `/videos/${filename}`,
    filename: filename,
    video_type: 'upload',
    upload_date: new Date().toISOString()
}));

fs.writeFileSync(path.join(dataDir, 'videos.json'), JSON.stringify(videos, null, 2));
console.log(`Generated videos.json with ${videos.length} videos.`);

// 3. Generate Content JSON (Default values)
const content = {
    "hero_subtitle": "Gift From The Streets",
    "contact_email": "bigsteppa333@gmail.com"
};

fs.writeFileSync(path.join(dataDir, 'content.json'), JSON.stringify(content, null, 2));
console.log('Generated content.json.');
