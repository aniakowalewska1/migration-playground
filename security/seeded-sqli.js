app.get("/user", (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.query.id}`;
  db.query(query, (err, rows) => res.json(rows));
});
