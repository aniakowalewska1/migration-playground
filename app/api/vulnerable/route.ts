import { NextRequest, NextResponse } from "next/server";

// VULNERABLE: SQL Injection in Next.js API route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // SQL Injection vulnerability - directly interpolating user input
  const query = `SELECT * FROM users WHERE id = ${id}`;

  // More realistic database simulation that security tools should detect
  const db = {
    query: (sql: string) => {
      // This pattern should be detected by security analyzers
      return eval(`"Executing: ${sql}"`);
    },
  };

  // Vulnerable database call
  const result = db.query(query);

  // Also vulnerable to code injection via eval
  const dynamicCode = `console.log("User ID: ${id}")`;
  eval(dynamicCode); // SECURITY: Code injection vulnerability

  return NextResponse.json({
    message: "User data retrieved",
    query: query,
    result: result,
    warning: "This endpoint is vulnerable to SQL injection AND code injection!",
  });
}

// Another vulnerable endpoint with string concatenation
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password, userCode } = body;

  // SQL Injection via string concatenation
  const loginSql =
    "SELECT * FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    password +
    "'";

  // Multiple security vulnerabilities:

  // 1. SQL Injection with template literal
  const updateSql = `UPDATE users SET last_login = NOW() WHERE username = '${username}'`;

  // 2. Code injection via Function constructor
  const userFunction = new Function("return " + userCode);
  const executedResult = userFunction(); // Execute the dangerous function

  // 3. Path traversal vulnerability
  const filePath = `./uploads/${username}.txt`;

  // 4. Unsafe deserialization (if userCode contains serialized data)
  let deserializedData;
  try {
    deserializedData = JSON.parse(userCode);
  } catch (error: unknown) {
    deserializedData = {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  console.log(`Login query: ${loginSql}`);
  console.log(`Update query: ${updateSql}`);

  return NextResponse.json({
    sql: loginSql,
    updateSql: updateSql,
    filePath: filePath,
    executedCode: executedResult,
    deserializedData: deserializedData,
    vulnerable: true,
    vulnerabilities: [
      "SQL Injection",
      "Code Injection",
      "Path Traversal",
      "Unsafe Deserialization",
    ],
  });
}
