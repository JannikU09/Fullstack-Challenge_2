import { authors, books, db } from "@repo/database";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as z from "zod";

// interface RequestBody {
//   title: string;
//   authorId: number;
//   isbn?: string;
//   year?: number;
// }

const schema = z.object({
  title: z.string().min(1),
  authorId: z.number().int().positive(),
  isbn: z.string().optional().nullish(),
  year: z.number().int().optional().nullable(),
});

type Body = z.infer<typeof schema>;

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
      .innerJoin(authors, eq(books.authorId, authorId))
      .where(eq(books.id, newBook.id));

    return NextResponse.json(newBookWithAuthor, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Author oder Title fehlen" }, { status: 400 });
  }
}
