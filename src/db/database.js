import Database from "better-sqlite3";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Use a dedicated DB for the Node API. Default: ./database/node.sqlite
const DEFAULT_DB_PATH = path.resolve("database", "node.sqlite");
const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : DEFAULT_DB_PATH;

// Ensure the folder exists so SQLite can create the file
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath, {
  readonly: false,
});

export default db;
