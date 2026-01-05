import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./src/db/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Debug: toon welke DB path gebruikt wordt
console.log("DB_PATH =", process.env.DB_PATH);

// Health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Categories
app.get("/api/categories", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM faq_categories").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root = API docs (1x!)
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`
    <h1>Node API Documentation</h1>
    <p>Base URL: http://localhost:${PORT}</p>
    <ul>
      <li><a href="/health">GET /health</a></li>
      <li><a href="/api/categories">GET /api/categories</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
