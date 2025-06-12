const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;
const SECRET = "supersecretkey";

app.use(cors());
app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err);
  else console.log("Connected to SQLite DB");
});

// Create tables
const initDB = () => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT,
    date TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
};
initDB();

// Auth middleware
function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

// Register route
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashed], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "2h" });
    res.json({ token });
  });
});

// Get tasks
app.get("/api/tasks", authenticate, (req, res) => {
  db.all(`SELECT * FROM tasks WHERE userId = ?`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add task
app.post("/api/tasks", authenticate, (req, res) => {
  const { title, date } = req.body;
  db.run(
    `INSERT INTO tasks (userId, title, date) VALUES (?, ?, ?)`,
    [req.user.id, title, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Update task completion
app.put("/api/tasks/:id", authenticate, (req, res) => {
  const { completed } = req.body;
  db.run(
    `UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?`,
    [completed, req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
