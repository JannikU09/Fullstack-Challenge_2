import { authors, books, db } from "@repo/database";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

interface RequestBody {
  title: string;
  authorId: string;
  isbn?: string;
  year?: number;
}

export async function GET() {
  try {
    const allBooks = await db
      .select()
      .from(books)
      .innerJoin(authors, eq(books.authorId, authors.id))
      .orderBy(books.authorId, books.year);
    return NextResponse.json(allBooks, { statusText: "Liste der Bücher" });
  } catch {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { title, authorId, isbn, year } = body;

    const [newBook] = await db
      .insert(books)
      .values({
        title,
        authorId,
        isbn,
        year,
      })
      .returning();

    const [newBookWithAuthor] = await db
      .select()
      .from(books)
      .innerJoin(authors, eq(books.authorId, authors.id))
      .where(eq(books.id, newBook.id));

    return NextResponse.json(newBookWithAuthor, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Author oder Title fehlen" }, { status: 400 });
  }
}
