import { NextRequest, NextResponse } from "next/server";

// VULNERABLE: SQL Injection in Next.js API route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // SQL Injection vulnerability - directly interpolating user input
  const query = `SELECT * FROM users WHERE id = ${id}`;

  // Simulate database query (this would be flagged by CodeQL)
  console.log(`Executing query: ${query}`);

  return NextResponse.json({
    message: "User data retrieved",
    query: query,
    warning: "This endpoint is vulnerable to SQL injection!",
  });
}

// Another vulnerable endpoint with string concatenation
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  // SQL Injection via string concatenation
  const loginSql =
    "SELECT * FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    password +
    "'";

  console.log(`Login query: ${loginSql}`);

  return NextResponse.json({
    sql: loginSql,
    vulnerable: true,
  });
}
