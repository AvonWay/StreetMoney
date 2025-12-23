import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

import multer from 'multer';

import db from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directories exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const videosDir = path.join(process.cwd(), 'public', 'videos');
[uploadsDir, videosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Simple Migration: Sync existing files into DB if table is empty
const existingSongs = db.prepare('SELECT COUNT(*) as count FROM songs').get();
if (existingSongs.count === 0) {
    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.mp3'));
    const insert = db.prepare('INSERT INTO songs (name, filename, url) VALUES (?, ?, ?)');
    files.forEach(f => {
        const name = f.split('-').slice(2).join('-').replace('.mp3', '');
        insert.run(name, f, `/uploads/${f}`);
    });
    console.log(`Migrated ${files.length} existing songs to database.`);
}

const existingVideos = db.prepare('SELECT COUNT(*) as count FROM videos').get();
if (existingVideos.count === 0) {
    const files = fs.readdirSync(videosDir).filter(f => /\.(mp4|mov|webm)$/i.test(f));
    const insert = db.prepare('INSERT INTO videos (name, filename, url) VALUES (?, ?, ?)');
    files.forEach(f => {
        const name = f.split('-').slice(2).join('-').replace(/\.(mp4|mov|webm)$/i, '');
        insert.run(name, f, `/videos/${f}`);
    });
    console.log(`Migrated ${files.length} existing videos to database.`);
}

// Multer storage configs
const musicStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, videosDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const uploadMusic = multer({
    storage: musicStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) cb(null, true);
        else cb(new Error('Only audio files are allowed!'), false);
    }
});

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) cb(null, true);
        else cb(new Error('Only video files are allowed!'), false);
    }
});

app.use(cors());
app.use(express.json());

// Resolve dist path relative to current working directory (safer)
const distPath = path.join(process.cwd(), 'dist');

console.log('Starting server...');
console.log('Current working directory:', process.cwd());
console.log('Dist path:', distPath);

if (!fs.existsSync(distPath)) {
    console.warn('WARNING: "dist" directory not found. Did you run "npm run build"?');
} else {
    console.log('"dist" directory found.');
}

// Serve static files
app.use(express.static(distPath));
app.use('/uploads', express.static(uploadsDir));
app.use('/videos', express.static(videosDir));

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, type, message } = req.body;
    console.log(`[Contact Form] New submission from ${name} (${email}) - Type: ${type}`);
    res.status(200).json({ success: true, message: 'Message received successfully!' });
});

// Music API (Database Driven)
app.get('/api/music', (req, res) => {
    try {
        const songs = db.prepare('SELECT * FROM songs ORDER BY upload_date DESC').all();
        res.status(200).json(songs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch music from database' });
    }
});

app.post('/api/music/upload', uploadMusic.single('song'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const name = req.file.originalname.replace('.mp3', '');
        const filename = req.file.filename;
        const url = `/uploads/${filename}`;

        const info = db.prepare('INSERT INTO songs (name, filename, url) VALUES (?, ?, ?)').run(name, filename, url);
        res.status(200).json({ success: true, id: info.lastInsertRowid, file: filename });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save song to database' });
    }
});

// Video API
app.get('/api/videos', (req, res) => {
    try {
        const videos = db.prepare('SELECT * FROM videos ORDER BY upload_date DESC').all();
        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch videos from database' });
    }
});

app.post('/api/videos/upload', uploadVideo.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No video uploaded' });

    try {
        const name = req.file.originalname.replace(/\.(mp4|mov|webm)$/i, '');
        const filename = req.file.filename;
        const url = `/videos/${filename}`;

        const info = db.prepare('INSERT INTO videos (name, filename, url) VALUES (?, ?, ?)').run(name, filename, url);
        res.status(200).json({ success: true, id: info.lastInsertRowid, file: filename });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save video to database' });
    }
});


// Catch-all handler
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('Index file NOT found at:', indexPath);
        res.status(404).send('Application not built. Run "npm run build" first.');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Max limit is 100MB for videos and 20MB for music.' });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
