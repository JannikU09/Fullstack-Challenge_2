import { authors, books, db } from "@repo/database";
import { count, eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as z from "zod";

export const schema = z.object({
  title: z.string().min(1),
  authorId: z.number().int().positive(),
  isbn: z.string().max(13).optional(),
  year: z.number().int().min(1000).max(9999).optional(),
});

type Body = z.infer<typeof schema>;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const authorId = searchParams.get("authorId");
  const page = Number(searchParams.get("page"));
  const pageSize =
    Number(searchParams.get("pageSize")) <= 100 === true
      ? Number(searchParams.get("pageSize"))
      : 100;
  const offset = (page - 1) * pageSize;
  console.log("page:", page, "pageSize:", pageSize, "offset:", offset);
  console.log(query, authorId);
  const parsedAuthorId = authorId ? Number(authorId) : null;
  try {
    if ((query && query?.length > 0) || (parsedAuthorId && parsedAuthorId > 0)) {
      const allBooks = await db
        .select()
        .from(books)
        .where(or(ilike(books.title, `%${query}%`), eq(books.authorId, parsedAuthorId)))
        .innerJoin(authors, eq(books.authorId, authors.id))
        .orderBy(books.authorId, books.year)
        .limit(pageSize)
        .offset(offset);

      const totalBooks = await db
        .select({ count: count() })
        .from(books)
        .where(or(ilike(books.title, `%${query}%`), eq(books.authorId, parsedAuthorId)));
      console.log(totalBooks);
      return NextResponse.json(
        { data: allBooks, total: totalBooks[0].count ?? 0 },
        { statusText: "Liste der gesuchten Bücher" },
      );
    } else {
      const allBooks = await db
        .select()
        .from(books)
        .innerJoin(authors, eq(books.authorId, authors.id))
        .orderBy(books.authorId, books.year)
        .limit(pageSize)
        .offset(offset);

      const totalBooks = await db.select({ count: count() }).from(books);
      console.log(totalBooks);

      return NextResponse.json(
        { data: allBooks, total: totalBooks[0].count ?? 0 },
        { statusText: "Liste aller Bücher" },
      );
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const { title, authorId, isbn, year } = body;

    const data: Body = {
      title,
      authorId,
      isbn,
      year,
    };

    const result = schema.safeParse(data, { reportInput: true });
    console.log(schema.safeParse(data));

    if (!result.success) {
      return NextResponse.json({ error: "Validation Error" }, { status: 400 });
    }

    const [newBook] = await db.insert(books).values(result.data).returning();

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
