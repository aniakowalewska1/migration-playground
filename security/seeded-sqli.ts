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
interface User {
  id: number;
  username: string;
  password: string;
}

interface UserQueryParams {
  id: string;
}

app.get(
  "/user",
  (
    req: express.Request<unknown, User[], unknown, UserQueryParams>,
    res: express.Response<User[] | { error: string }>
  ) => {
    const id: string = req.query.id;
    const query: string = `SELECT * FROM users WHERE id = ${id}`;
    db.query(query, (err: mysql.QueryError | null, rows: User[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
  }
);

// Another vulnerable endpoint
interface Product {
  id: number;
  name: string;
  price: number;
}

interface SearchQueryParams {
  term: string;
}

app.get(
  "/search",
  (
    req: express.Request<unknown, Product[], unknown, SearchQueryParams>,
    res: express.Response<Product[] | { error: string }>
  ) => {
    const searchTerm: string = req.query.term;
    const sql: string =
      "SELECT * FROM products WHERE name LIKE '%" + searchTerm + "%'";
    db.query(sql, (err: mysql.QueryError | null, results: Product[]) => {
      if (err) throw err;
      res.json(results);
    });
  }
);

// Vulnerable POST endpoint
interface LoginRequestBody {
  username: string;
  password: string;
}

interface LoginSuccessResponse {
  success: true;
  user: User;
}

interface LoginErrorResponse {
  success: false;
  message: string;
}

interface DatabaseErrorResponse {
  error: string;
}

app.post(
  "/login",
  (
    req: express.Request<
      unknown,
      LoginSuccessResponse | LoginErrorResponse | DatabaseErrorResponse,
      LoginRequestBody
    >,
    res: express.Response<
      LoginSuccessResponse | LoginErrorResponse | DatabaseErrorResponse
    >
  ) => {
    const { username, password }: LoginRequestBody = req.body;
    const loginQuery: string = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.query(loginQuery, (error: mysql.QueryError | null, results: User[]) => {
      if (error) {
        res.status(500).json({ error: "Database error" });
      } else if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    });
  }
);

export default app;
