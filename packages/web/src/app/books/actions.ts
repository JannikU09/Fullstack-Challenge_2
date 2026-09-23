"use server";

import { authors, books, db } from "@repo/database";
import { and, count, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import type { Author } from "../interfaces/Author";
import type { BookWithAuthor } from "../interfaces/BookWithAuthor";
import type { BookSearchParams } from "../interfaces/searchParams";

const schema = z.object({
    title: z.string().min(1),
    authorId: z.number().int().positive(),
    isbn: z.string().min(13).max(13),
    year: z.number().int().min(1000).max(9999).optional(),
});

export async function getBooks(params: BookSearchParams) {
    const offset: number = (params.page - 1) * params.pageSize;
    const filters = [];


    if (params.q) {
        filters.push(ilike(books.title, `%${params.q}%`));
    }
    if (params.authorId) {
        filters.push(eq(books.authorId, Number(params.authorId)));
    }

    const isFilter = filters.length ? and(...filters) : undefined;

    const [data, totalBooks] = await Promise.all([
        db
            .select()
            .from(books)
            .innerJoin(authors, eq(books.authorId, authors.id))
            .where(isFilter)
            .orderBy(books.authorId, books.year)
            .limit(Number(params.pageSize))
            .offset(offset),
        db.select({ total: count() }).from(books).where(isFilter),
    ]);

    const total = totalBooks[0].total;
    const totalPages = Math.ceil(total / params.pageSize);

    return {
        data,
        total,
        totalPages,
    };
}

export async function getAuthors() {
    const allAuthors: Author[] = await db.select().from(authors);
    return allAuthors;
}

export async function createBookAction(bookInput: BookWithAuthor) {
    const result = schema.safeParse(bookInput.Books, { reportInput: true });

    if (!result.success) {
        return { success: false, error: "Validation Error" };
    }

    const [newBook] = await db.insert(books).values(result.data).returning();
    const [newBookWithAuthor] = await db
        .select()
        .from(books)
        .innerJoin(authors, eq(books.authorId, authors.id))
        .where(eq(books.id, newBook.id));

    revalidatePath("/books");
    return { success: true, data: newBookWithAuthor };
}

export async function updateBookAction(id: number, bookInput: BookWithAuthor) {
    const result = schema.safeParse(bookInput.Books, { reportInput: true });

    if (!result.success) {
        return { success: false, error: "Validation Error" };
    }

    await db.update(books).set(result.data).where(eq(books.id, id)).returning();
    revalidatePath("/books");
    return { success: true };
}

export async function deleteBookAction(id: number) {
    try {
        await db.delete(books).where(eq(books.id, id)).returning();
        revalidatePath("/books");
        return { success: true, message: "Erfolgreich gelöscht" };
    } catch (error) {
        return { success: false, error: error };
    }
}
