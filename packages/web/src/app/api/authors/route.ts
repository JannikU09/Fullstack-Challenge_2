import { authors, db } from "@repo/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allAuthors = await db.select().from(authors);
    return NextResponse.json(allAuthors);
  } catch {
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}
