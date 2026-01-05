import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_PATH) {
  throw new Error("DB_PATH ontbreekt in .env");
}

const db = new Database(process.env.DB_PATH, {
  readonly: false,
});

export default db;
