const express = require("express");
const db = require("./db/database");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.send("Cloud Event RSVP System is running");
});

app.get("/debug", (req, res) => {
  res.send("DEBUG ROUTE WORKS");
});

app.post("/events", (req, res) => {
  const { title, event_date, location, description, capacity } = req.body;

  if (!title || !event_date || !location || capacity === undefined) {
    return res.status(400).json({
      error: "title, event_date, location, and capacity are required",
    });
  }

  const capNum = Number(capacity);
  if (!Number.isInteger(capNum) || capNum < 1) {
    return res.status(400).json({
      error: "capacity must be an integer >= 1",
    });
  }

  db.run(
    `INSERT INTO events (title, event_date, location, description, capacity)
     VALUES (?, ?, ?, ?, ?)`,
    [title, event_date, location, description || "", capNum],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        event_date,
        location,
        description: description || "",
        capacity: capNum,
      });
    }
  );
});

app.get("/events", (req, res) => {
  db.all(
    `SELECT * FROM events ORDER BY datetime(created_at) DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
