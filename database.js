import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'music.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    filename TEXT,
    url TEXT NOT NULL,
    video_type TEXT DEFAULT 'upload',
    embed_url TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS pictures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add new columns if they don't exist
try {
  db.exec(`ALTER TABLE videos ADD COLUMN video_type TEXT DEFAULT 'upload'`);
  console.log('Added video_type column to videos table');
} catch (e) {
  // Column already exists
}

try {
  db.exec(`ALTER TABLE videos ADD COLUMN embed_url TEXT`);
  console.log('Added embed_url column to videos table');
} catch (e) {
  // Column already exists
}

console.log('Database initialized at:', dbPath);

// Analytics table
db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    ip_hash TEXT,
    device_type TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
