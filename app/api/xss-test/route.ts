import { NextRequest, NextResponse } from "next/server";

// VULNERABLE CODE - for testing CodeQL detection
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userInput = searchParams.get("content") || "";

  // This creates an XSS vulnerability by returning unescaped user input
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
