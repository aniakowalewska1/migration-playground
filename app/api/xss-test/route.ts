import { NextRequest, NextResponse } from "next/server";

// Vulnerability: returning unescaped user input

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userInput = searchParams.get("content") || "";

  const htmlResponse = `
    <html>
      <body>
        <h1>User Content</h1>
        <div>${userInput}</div>
      </body>
    </html>
  `;

  return new NextResponse(htmlResponse, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
