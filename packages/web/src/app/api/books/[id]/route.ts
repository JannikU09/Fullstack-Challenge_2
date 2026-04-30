import { books, db } from "@repo/database";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  try {
    const { id } = await ctx.params;
    const bookId = Number(id);

    const deletedBook = await db.delete(books).where(eq(books.id, bookId)).returning();

    if (deletedBook.length === 0) {
      return NextResponse.json({ error: "Buch existiert nicht" }, { status: 404 });
    }
    return NextResponse.json({ message: "Erfolgreich gelöscht" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function PUT(_req: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params;
  const bookId = Number(id);

  const body = await _req.json();
  const { title, authorId, isbn, year } = body;
  try {
    const updatedBook = await db
      .update(books)
      .set({
        title: title,
        authorId: authorId === "" ? null : Number(authorId),
        isbn: isbn,
        year: year,
      })
      .where(eq(books.id, bookId))
      .returning();

    // const [updatedBook] = await db.update(books).set(body).where(eq(books.id, bookId)).returning();

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
