// src/app.js
const express = require("express");
const db = require("./db/database"); // must be ./db/database.js

const app = express();
app.use(express.json());

// PROVE which file is running (you will see this printed in terminal)
console.log("RUNNING FILE:", __filename);

// ---------- Helpers (Promisified sqlite3) ----------
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// ---------- Basic routes ----------
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

app.get("/", (req, res) => {
  res.send("Cloud Event RSVP System is running");
});

app.get("/debug", (req, res) => {
  res.send("DEBUG ROUTE WORKS");
});

// ---------- Events ----------
app.post("/events", async (req, res) => {
  try {
    const { title, event_date, location, description, capacity } = req.body;

    if (!title || !event_date || !location || capacity === undefined) {
      return res.status(400).json({
        error: "title, event_date, location, and capacity are required",
      });
    }

    const capNum = Number(capacity);
    if (!Number.isInteger(capNum) || capNum < 1) {
      return res.status(400).json({ error: "capacity must be an integer >= 1" });
    }

    const result = await dbRun(
      `INSERT INTO events (title, event_date, location, description, capacity)
       VALUES (?, ?, ?, ?, ?)`,
      [title, event_date, location, description ?? null, capNum]
    );

    const created = await dbGet(`SELECT * FROM events WHERE id = ?`, [result.lastID]);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/events", async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM events ORDER BY id DESC`);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------- RSVPs ----------
app.post("/rsvps", async (req, res) => {
  try {
    const { event_id, name, email, status } = req.body;

    if (event_id === undefined || !name || !email) {
      return res.status(400).json({ error: "event_id, name, and email are required" });
    }

    const allowed = new Set(["going", "interested"]);
    const rsvpStatus = (status ?? "going").toLowerCase();
    if (!allowed.has(rsvpStatus)) {
      return res.status(400).json({ error: 'status must be "going" or "interested"' });
    }

    const eventIdNum = Number(event_id);
    if (!Number.isInteger(eventIdNum) || eventIdNum < 1) {
      return res.status(400).json({ error: "event_id must be a positive integer" });
    }

    // Ensure event exists
    const eventRow = await dbGet(`SELECT * FROM events WHERE id = ?`, [eventIdNum]);
    if (!eventRow) return res.status(404).json({ error: "event not found" });

    // Capacity check only for "going"
    if (rsvpStatus === "going") {
      const countRow = await dbGet(
        `SELECT COUNT(*) as cnt FROM rsvps WHERE event_id = ? AND status = 'going'`,
        [eventIdNum]
      );

      if ((countRow?.cnt ?? 0) >= eventRow.capacity) {
        return res.status(409).json({ error: "capacity reached" });
      }
    }

    const result = await dbRun(
      `INSERT INTO rsvps (event_id, name, email, status)
       VALUES (?, ?, ?, ?)`,
      [eventIdNum, name, email, rsvpStatus]
    );

    const created = await dbGet(`SELECT * FROM rsvps WHERE id = ?`, [result.lastID]);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/rsvps", async (req, res) => {
  try {
    const eventId = req.query.event_id ? Number(req.query.event_id) : null;

    const rows = eventId
      ? await dbAll(`SELECT * FROM rsvps WHERE event_id = ? ORDER BY id DESC`, [eventId])
      : await dbAll(`SELECT * FROM rsvps ORDER BY id DESC`);

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------- Catch-all (so you never see plain "Cannot POST" again) ----------
app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.path,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
