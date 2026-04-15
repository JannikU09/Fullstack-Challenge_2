import { db, books } from "@repo/database";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/books/[id]'>) {
    try {
        const { id } = await ctx.params;
        const bookId = Number(id);

        const deletedBook = await db.delete(books).where(eq(books.id, bookId)).returning();

        if (deletedBook.length === 0) {
            return NextResponse.json({ error: "Buch existiert nicht" }, { status: 404 })
        };
        return NextResponse.json({ message: "Erfolgreich gelöscht" }, { status: 200 });

    } catch {
        return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
    }
}
