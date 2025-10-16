import express from "express";
import mysql from "mysql2";

const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "testdb",
});

// SQL Injection vulnerability - unsanitized user input
app.get("/user", (req, res) => {
  const id = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${id}`;
  db.query(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Another vulnerable endpoint
app.get("/search", (req, res) => {
  const searchTerm = req.query.term;
  const sql = "SELECT * FROM products WHERE name LIKE '%" + searchTerm + "%'";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Vulnerable POST endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const loginQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.query(loginQuery, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Database error" });
    } else if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

export default app;
