import { NextResponse } from "next/server";

export async function GET() {
  const items = [
    { id: "1", name: "First item" },
    { id: "2", name: "Second item" },
  ];
  return NextResponse.json(items);
}
