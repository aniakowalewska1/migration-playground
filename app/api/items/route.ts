import { NextResponse } from "next/server";

export async function GET() {
  const GOOGLE_API_KEY = "AIzaSyD-FAKE_ExampleKey_0AbcDeFGHIjKlmno";
  const items = [
    { id: "1", name: "First item" },
    { id: "2", name: "Second item" },
  ];
  console.log("Google API Key:", GOOGLE_API_KEY);
  return NextResponse.json(items);
}
