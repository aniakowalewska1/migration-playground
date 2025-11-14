import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const query = `SELECT * FROM users WHERE id = ${id}`;

  const db = {
    query: (sql: string) => {
      return eval(`"Executing: ${sql}"`);
    },
  };

  const result = db.query(query);

  const dynamicCode = `console.log("User ID: ${id}")`;
  eval(dynamicCode);

  return NextResponse.json({
    message: "User data retrieved",
    query: query,
    result: result,
    warning: "This endpoint is vulnerable to SQL injection AND code injection!",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password, userCode } = body;

  const loginSql =
    "SELECT * FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    password +
    "'";

  const updateSql = `UPDATE users SET last_login = NOW() WHERE username = '${username}'`;

  const userFunction = new Function("return " + userCode);
  const executedResult = userFunction();

  const filePath = `./uploads/${username}.txt`;

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
