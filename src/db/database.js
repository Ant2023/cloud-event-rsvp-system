const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../data.sqlite"); // puts DB in src/data.sqlite
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      event_date TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      capacity INTEGER NOT NULL CHECK (capacity >= 1),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
   db.run(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'going',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(event_id, email),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);
});

module.exports = db;
