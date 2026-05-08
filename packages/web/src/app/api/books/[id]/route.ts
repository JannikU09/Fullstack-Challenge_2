import { books, db } from "@repo/database";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const schema = z.object({
  title: z.string().optional(),
  authorId: z.number().int().positive().optional(),
  isbn: z.string().optional(),
  year: z.number().optional(),
});

type Body = z.infer<typeof schema>;

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  try {
    const { id } = await ctx.params;
    const bookId = Number(id);

    const getBook = await db.select().from(books).where(eq(books.id, bookId));
    return NextResponse.json(getBook, { statusText: "Gesuchtes Buch" });
  } catch {
    return NextResponse.json({ error: "Buch nicht gefunden" }, { status: 404 });
  }
}

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

  const body: Body = await _req.json();
  const { title, authorId, isbn, year } = body;
  try {
    const data: Body = {
      title,
      authorId,
      isbn,
      year,
    };

    const result = schema.safeParse(data, { reportInput: true });
    console.log(result);

    if (!result.success) {
      return NextResponse.json({ error: "Validation Error" }, { status: 400 });
    }

    const updatedBook = await db
      .update(books)
      .set(result.data)
      .where(eq(books.id, bookId))
      .returning();

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Buch nicht gefunden" }, { status: 404 });
  }
}
