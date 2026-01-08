// filepath: src/controllers/users.controller.js
import db from "../db/database.js";
import { validateUserPayload } from "../validators/users.validator.js";

function parseIntParam(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function nowSqlite() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export function listUsers(req, res) {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const limitRaw = parseIntParam(req.query.limit, 10);
  const limit = Math.min(Math.max(limitRaw, 1), 50);

  const offsetRaw = parseIntParam(req.query.offset, 0);
  const offset = Math.max(offsetRaw, 0);

  const allowedSort = new Set(["id", "firstName", "lastName", "email"]);
  const sort = allowedSort.has(String(req.query.sort)) ? String(req.query.sort) : "id";

  const order = String(req.query.order).toLowerCase() === "asc" ? "ASC" : "DESC";

  try {
    const where = search ? "WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ?" : "";
    const params = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];

    const totalRow = db
      .prepare(`SELECT COUNT(*) as total FROM users ${where}`)
      .get(...params);

    const rows = db
      .prepare(
        `SELECT id, firstName, lastName, email, created_at, updated_at
         FROM users
         ${where}
         ORDER BY ${sort} ${order}
         LIMIT ? OFFSET ?`,
      )
      .all(...params, limit, offset);

    return res.json({
      data: rows,
      meta: {
        limit,
        offset,
        total: totalRow?.total ?? 0,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: "DatabaseError",
      details: err?.message ?? String(err),
    });
  }
}

export function getUserById(req, res) {
  const id = parseIntParam(req.params.id, NaN);
  if (!Number.isFinite(id)) {
    return res.status(400).json({
      error: "ValidationError",
      details: { id: "ID must be an integer." },
    });
  }

  try {
    const row = db
      .prepare("SELECT id, firstName, lastName, email, created_at, updated_at FROM users WHERE id = ?")
      .get(id);

    if (!row) {
      return res.status(404).json({ error: "NotFound", details: "User not found." });
    }

    return res.json({ data: row });
  } catch (err) {
    return res.status(500).json({
      error: "DatabaseError",
      details: err?.message ?? String(err),
    });
  }
}

export function createUser(req, res) {
  const validation = validateUserPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error, details: validation.details });
  }

  try {
    const createdAt = nowSqlite();
    const result = db
      .prepare(
        "INSERT INTO users (firstName, lastName, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      )
      .run(validation.value.firstName, validation.value.lastName, validation.value.email, createdAt, createdAt);

    const created = db
      .prepare("SELECT id, firstName, lastName, email, created_at, updated_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid);

    return res.status(201).json({ data: created });
  } catch (err) {
    return res.status(500).json({
      error: "DatabaseError",
      details: err?.message ?? String(err),
    });
  }
}

export function updateUser(req, res) {
  const id = parseIntParam(req.params.id, NaN);
  if (!Number.isFinite(id)) {
    return res.status(400).json({
      error: "ValidationError",
      details: { id: "ID must be an integer." },
    });
  }

  const validation = validateUserPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error, details: validation.details });
  }

  try {
    const updatedAt = nowSqlite();

    const result = db
      .prepare("UPDATE users SET firstName = ?, lastName = ?, email = ?, updated_at = ? WHERE id = ?")
      .run(validation.value.firstName, validation.value.lastName, validation.value.email, updatedAt, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "NotFound", details: "User not found." });
    }

    const updated = db
      .prepare("SELECT id, firstName, lastName, email, created_at, updated_at FROM users WHERE id = ?")
      .get(id);

    return res.json({ data: updated });
  } catch (err) {
    return res.status(500).json({
      error: "DatabaseError",
      details: err?.message ?? String(err),
    });
  }
}

export function deleteUser(req, res) {
  const id = parseIntParam(req.params.id, NaN);
  if (!Number.isFinite(id)) {
    return res.status(400).json({
      error: "ValidationError",
      details: { id: "ID must be an integer." },
    });
  }

  try {
    const result = db.prepare("DELETE FROM users WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "NotFound", details: "User not found." });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({
      error: "DatabaseError",
      details: err?.message ?? String(err),
    });
  }
}
