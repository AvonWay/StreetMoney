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
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const videosDir = path.join(__dirname, 'public', 'videos');
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

const pictureStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const uploadMusic = multer({
    storage: musicStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) cb(null, true);
        else cb(new Error('Only audio files are allowed!'), false);
    }
});

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) cb(null, true);
        else cb(new Error('Only video files are allowed!'), false);
    }
});

const uploadPicture = multer({
    storage: pictureStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed!'), false);
    }
});

// Minimal Analytics Middleware
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/assets') && !req.path.startsWith('/videos')) {
        try {
            // Simple hash of IP for privacy
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'] || '';
            const isMobile = /mobile/i.test(userAgent);

            db.prepare('INSERT INTO visits (page, ip_hash, device_type) VALUES (?, ?, ?)').run(
                req.path,
                ip, // In prod, hash this
                isMobile ? 'mobile' : 'desktop'
            );
        } catch (err) {
            console.error('Analytics log error:', err);
        }
    }
    next();
});

app.use(cors());
app.use(express.json());

// Resolve dist path relative to current working directory (safer)
const distPath = path.join(__dirname, 'dist');

console.log('Starting server...');
console.log('Current directory:', __dirname);
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

app.post('/api/music/upload', (req, res) => {
    uploadMusic.single('song')(req, res, (err) => {
        if (err) {
            console.error('Multer Music Upload Error:', err);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            console.error('No music file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            console.log('Processing music upload:', req.file.originalname);
            const name = req.file.originalname.replace(/\.(mp3|wav|m4a)$/i, '');
            const filename = req.file.filename;
            const url = `/uploads/${filename}`;

            const info = db.prepare('INSERT INTO songs (name, filename, url) VALUES (?, ?, ?)').run(name, filename, url);
            console.log('Song saved to DB:', info.lastInsertRowid);
            res.status(200).json({ success: true, id: info.lastInsertRowid, file: filename });
        } catch (dbErr) {
            console.error('Database Error during music upload:', dbErr);
            res.status(500).json({ error: 'Failed to save song to database' });
        }
    });
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

app.post('/api/videos/upload', (req, res) => {
    uploadVideo.single('video')(req, res, (err) => {
        if (err) {
            console.error('Multer Video Upload Error:', err);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            console.error('No video file in request');
            return res.status(400).json({ error: 'No video uploaded' });
        }

        try {
            console.log('Processing video upload:', req.file.originalname);
            const name = req.file.originalname.replace(/\.(mp4|mov|webm)$/i, '');
            const filename = req.file.filename;
            const url = `/videos/${filename}`;

            const info = db.prepare('INSERT INTO videos (name, filename, url, video_type) VALUES (?, ?, ?, ?)').run(name, filename, url, 'upload');
            console.log('Video saved to DB:', info.lastInsertRowid);
            res.status(200).json({ success: true, id: info.lastInsertRowid, file: filename });
        } catch (dbErr) {
            console.error('Database Error during video upload:', dbErr);
            res.status(500).json({ error: 'Failed to save video to database' });
        }
    });
});

// Add video via URL (YouTube, etc.)
app.post('/api/videos/add-url', (req, res) => {
    console.log('Received video URL request:', req.body);

    const { name, url } = req.body;

    if (!name || !url) {
        console.error('Missing required fields:', { name: !!name, url: !!url });
        return res.status(400).json({ error: 'Name and URL are required' });
    }

    try {
        // Convert YouTube URL to embed format
        let embedUrl = url;
        let videoType = 'url';

        // Check if it's a YouTube URL
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);

        if (match && match[1]) {
            embedUrl = `https://www.youtube.com/embed/${match[1]}`;
            videoType = 'youtube';
            console.log('YouTube video detected, embed URL:', embedUrl);
        } else {
            console.log('Non-YouTube URL, using as-is:', url);
        }

        const info = db.prepare('INSERT INTO videos (name, url, video_type, embed_url) VALUES (?, ?, ?, ?)').run(name, url, videoType, embedUrl);
        console.log('Video URL added successfully:', { id: info.lastInsertRowid, videoType });
        res.status(200).json({ success: true, id: info.lastInsertRowid, videoType });
    } catch (err) {
        console.error('Error adding video URL:', err);
        res.status(500).json({ error: 'Failed to save video URL to database', details: err.message });
    }
});

// Picture API
app.get('/api/pictures', (req, res) => {
    try {
        const pictures = db.prepare('SELECT * FROM pictures ORDER BY upload_date DESC').all();
        res.status(200).json(pictures);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pictures from database' });
    }
});

app.post('/api/pictures/upload', uploadPicture.single('picture'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No picture uploaded' });

    try {
        const name = req.file.originalname;
        const filename = req.file.filename;
        const url = `/uploads/${filename}`;

        const info = db.prepare('INSERT INTO pictures (name, filename, url) VALUES (?, ?, ?)').run(name, filename, url);
        res.status(200).json({ success: true, id: info.lastInsertRowid, file: filename, url: url });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save picture to database' });
    }
});

app.delete('/api/pictures/:id', (req, res) => {
    try {
        const { id } = req.params;
        // Verify picture exists first
        const picture = db.prepare('SELECT * FROM pictures WHERE id = ?').get(id);
        if (!picture) return res.status(404).json({ error: 'Picture not found' });

        // Delete from DB
        db.prepare('DELETE FROM pictures WHERE id = ?').run(id);

        // Optionally delete file from filesystem
        const filePath = path.join(uploadsDir, picture.filename);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (fsErr) {
                console.warn('Failed to delete file from disk:', fsErr);
            }
        }

        res.status(200).json({ success: true, message: 'Picture deleted' });
    } catch (err) {
        console.error("Error deleting picture:", err);
        res.status(500).json({ error: 'Failed to delete picture' });
    }
});

// Video Delete API
app.delete('/api/videos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(id);
        if (!video) return res.status(404).json({ error: 'Video not found' });

        db.prepare('DELETE FROM videos WHERE id = ?').run(id);

        if (video.video_type === 'upload') {
            const filePath = path.join(videosDir, video.filename);
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { console.warn('Failed to delete file:', e); }
            }
        }
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete video' });
    }
});

// Music Delete API
app.delete('/api/music/:id', (req, res) => {
    try {
        const { id } = req.params;
        const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(id);
        if (!song) return res.status(404).json({ error: 'Song not found' });

        db.prepare('DELETE FROM songs WHERE id = ?').run(id);

        const filePath = path.join(uploadsDir, song.filename);
        if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) { console.warn('Failed to delete file:', e); }
        }
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete song' });
    }
});

// Content API
app.get('/api/content', (req, res) => {
    try {
        const content = db.prepare('SELECT * FROM content').all();
        // Return as object { key: value } for easier frontend consumption
        const contentMap = content.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.status(200).json(contentMap);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

app.post('/api/content', (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ error: 'Key is required' });

        const stmt = db.prepare(`
            INSERT INTO content (key, value, last_updated) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
            value = excluded.value,
            last_updated = CURRENT_TIMESTAMP
        `);

        stmt.run(key, value);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error saving content:', err);
        res.status(500).json({ error: 'Failed to save content' });
    }
});
// Analytics API
app.get('/api/analytics', (req, res) => {
    try {
        // Total views
        const totalViews = db.prepare('SELECT COUNT(*) as count FROM visits').get().count;

        // Unique visitors (approx based on IP)
        const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT ip_hash) as count FROM visits').get().count;

        // Last 7 days traffic
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const dateStr = sevenDaysAgo.toISOString().split('T')[0];

        const trafficData = db.prepare(`
            SELECT strftime('%Y-%m-%d', timestamp) as date, COUNT(*) as count 
            FROM visits 
            WHERE timestamp >= ? 
            GROUP BY date 
            ORDER BY date ASC
        `).all(dateStr);

        // Fill in missing days
        const chartData = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dayStr = d.toISOString().split('T')[0];
            const found = trafficData.find(r => r.date === dayStr);
            chartData.push({
                date: dayStr,
                visits: found ? found.count : 0
            });
        }

        // Top Pages
        const topPages = db.prepare(`
            SELECT page, COUNT(*) as count 
            FROM visits 
            GROUP BY page 
            ORDER BY count DESC 
            LIMIT 5
        `).all();

        res.status(200).json({
            overview: { totalViews, uniqueVisitors },
            traffic: chartData,
            pages: topPages
        });

    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
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
            return res.status(400).json({ error: 'File too large. Max limit is 500MB for videos and 100MB for music.' });
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
