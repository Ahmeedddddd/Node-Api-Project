import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRouter from "./src/routes/categories.routes.js";
import usersRouter from "./src/routes/users.routes.js";

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

// Routes
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);

// Root = API docs (1x!)
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`
    <h1>Node API Documentation</h1>
    <p>Base URL: http://localhost:${PORT}</p>

    <h2>Health</h2>
    <ul>
      <li><a href="/health">GET /health</a> – status check</li>
    </ul>

    <h2>Categories</h2>
    <p>Resource: <code>/api/categories</code> (table: <code>faq_categories</code>)</p>

    <h3>List</h3>
    <ul>
      <li>
        <a href="/api/categories">GET /api/categories</a>
        <br />Query params:
        <ul>
          <li><code>search</code> (string, optional): filters on <code>name</code> using LIKE</li>
          <li><code>limit</code> (int, default 10, max 50)</li>
          <li><code>offset</code> (int, default 0)</li>
          <li><code>sort</code> (optional): <code>id</code> or <code>name</code> (default: id)</li>
          <li><code>order</code> (optional): <code>asc</code> or <code>desc</code> (default: desc)</li>
        </ul>
        Example: <a href="/api/categories?search=loc&limit=5&offset=0">/api/categories?search=loc&amp;limit=5&amp;offset=0</a>
        <br />Response shape: <code>{ data: [...], meta: { limit, offset, total } }</code>
      </li>
    </ul>

    <h3>Get by id</h3>
    <ul>
      <li><code>GET /api/categories/:id</code> – response: <code>{ data: category }</code> (404 if not found)</li>
    </ul>

    <h3>Create</h3>
    <ul>
      <li>
        <code>POST /api/categories</code>
        <br />Body JSON: <code>{ "name": "FAQ" }</code>
        <br />Rules: name is required, trimmed, no digits, max 100 chars
        <br />Response: 201 <code>{ data: createdCategory }</code>
      </li>
    </ul>

    <h3>Update</h3>
    <ul>
      <li>
        <code>PUT /api/categories/:id</code>
        <br />Body JSON: <code>{ "name": "Updated" }</code>
        <br />Response: <code>{ data: updatedCategory }</code> (404 if not found)
      </li>
    </ul>

    <h3>Delete</h3>
    <ul>
      <li><code>DELETE /api/categories/:id</code> – response: 204 No Content (404 if not found)</li>
    </ul>

    <h2>Users</h2>
    <p>Resource: <code>/api/users</code> (table: <code>users</code>)</p>

    <h3>List</h3>
    <ul>
      <li>
        <a href="/api/users">GET /api/users</a>
        <br />Query params:
        <ul>
          <li><code>search</code> (string, optional): filters on <code>firstName</code>, <code>lastName</code>, and <code>email</code> using LIKE</li>
          <li><code>limit</code> (int, default 10, max 50)</li>
          <li><code>offset</code> (int, default 0)</li>
          <li><code>sort</code> (optional): <code>id</code>, <code>firstName</code>, <code>lastName</code>, or <code>email</code> (default: id)</li>
          <li><code>order</code> (optional): <code>asc</code> or <code>desc</code> (default: desc)</li>
        </ul>
        Example: <a href="/api/users?search=john&limit=5&offset=0">/api/users?search=john&amp;limit=5&amp;offset=0</a>
        <br />Response shape: <code>{ data: [...], meta: { limit, offset, total } }</code>
      </li>
    </ul>

    <h3>Get by id</h3>
    <ul>
      <li><code>GET /api/users/:id</code> – response: <code>{ data: user }</code> (404 if not found)</li>
    </ul>

    <h3>Create</h3>
    <ul>
      <li>
        <code>POST /api/users</code>
        <br />Body JSON: <code>{ "firstName": "John", "lastName": "Doe", "email": "john@example.com" }</code>
        <br />Rules:
        <ul>
          <li>firstName: required, trimmed, no digits, max 100 chars</li>
          <li>lastName: required, trimmed, no digits, max 100 chars</li>
          <li>email: required, valid email format</li>
        </ul>
        <br />Response: 201 <code>{ data: createdUser }</code>
      </li>
    </ul>

    <h3>Update</h3>
    <ul>
      <li>
        <code>PUT /api/users/:id</code>
        <br />Body JSON: <code>{ "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com" }</code>
        <br />Response: <code>{ data: updatedUser }</code> (404 if not found)
      </li>
    </ul>

    <h3>Delete</h3>
    <ul>
      <li><code>DELETE /api/users/:id</code> – response: 204 No Content (404 if not found)</li>
    </ul>

    <h2>Error format</h2>
    <ul>
      <li>400: <code>{ error: "ValidationError", details: { ... } }</code></li>
      <li>404: <code>{ error: "NotFound", details: "..." }</code></li>
      <li>500: <code>{ error: "DatabaseError", details: "..." }</code></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
