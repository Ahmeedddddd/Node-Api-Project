import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_PATH) {
  throw new Error("DB_PATH ontbreekt in .env");
}

const db = new Database(process.env.DB_PATH, { readonly: false });

// Env flag pour forcer le reseed (purge puis insert)
const FORCE_SEED = process.env.FORCE_SEED === "1";

// Zorg dat de tabel bestaat
// SQLite datetime in format YYYY-MM-DD HH:mm:ss zodat het matcht met de API outputs
function nowSqlite() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS faq_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

// Drop and recreate users table to ensure fresh schema
db.exec("DROP TABLE IF EXISTS users;");

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const categoriesSeedRows = [
  { name: "Location" },
  { name: "Delivery" },
  { name: "Returns" },
  { name: "Payments" },
  { name: "Support" },
  { name: "Billing" },
  { name: "Warranty" },
  { name: "Installation" },
  { name: "Security" },
  { name: "Mobile" },
  { name: "Desktop" },
  { name: "API" },
];

const usersSeedRows = [
  { firstName: "John", lastName: "Doe", email: "john@example.com" },
  { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
  { firstName: "Ahmed", lastName: "Hassan", email: "ahmed@example.com" },
  { firstName: "Maria", lastName: "Garcia", email: "maria@example.com" },
  { firstName: "Pierre", lastName: "Dupont", email: "pierre@example.com" },
  { firstName: "Sophie", lastName: "Martin", email: "sophie@example.com" },
  { firstName: "Luc", lastName: "Bernard", email: "luc@example.com" },
  { firstName: "Anna", lastName: "Rossi", email: "anna@example.com" },
  { firstName: "Marco", lastName: "Bianchi", email: "marco@example.com" },
  { firstName: "Lisa", lastName: "Mueller", email: "lisa@example.com" },
];

// Seed categories
let catExisting = db.prepare("SELECT COUNT(*) as total FROM faq_categories").get().total;

if (FORCE_SEED) {
  db.exec("DELETE FROM faq_categories; DELETE FROM users;");
  catExisting = 0;
  console.log("FORCE_SEED=1 -> cleared all tables before seeding.");
}

if (catExisting === 0) {
  const insertCat = db.prepare(
    "INSERT INTO faq_categories (name, created_at, updated_at) VALUES (?, ?, ?)",
  );
  const ts = nowSqlite();
  db.transaction(() => {
    for (const row of categoriesSeedRows) {
      insertCat.run(row.name.trim(), ts, ts);
    }
  })();
  console.log(`Seeded ${categoriesSeedRows.length} categories into faq_categories.`);
} else {
  console.log(`Skipped seeding categories. faq_categories already has ${catExisting} rows.`);
}

// Seed users
let userExisting = db.prepare("SELECT COUNT(*) as total FROM users").get().total;

if (FORCE_SEED) {
  userExisting = 0; // Already cleared above
}

if (userExisting === 0) {
  const insertUser = db.prepare(
    "INSERT INTO users (firstName, lastName, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
  );
  const ts = nowSqlite();
  db.transaction(() => {
    for (const row of usersSeedRows) {
      insertUser.run(row.firstName, row.lastName, row.email, ts, ts);
    }
  })();
  console.log(`Seeded ${usersSeedRows.length} users into users table.`);
} else {
  console.log(`Skipped seeding users. users table already has ${userExisting} rows.`);
}

db.close();
