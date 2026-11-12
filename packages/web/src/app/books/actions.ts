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
    year: z.number().int().min(1000).max(9999).optional().nullish(),
});

export async function getBooks(params: BookSearchParams) {
    const filters = [];

    if (params.q) {
        filters.push(ilike(books.title, `%${params.q}%`));
    }
    if (params.authorId) {
        filters.push(eq(books.authorId, Number(params.authorId)));
    }
    if (!params.page || params.page <= 0) {
        params.page = 1;
    }
    if (!params.pageSize || params.pageSize <= 0) {
        params.pageSize = 20;
    }

    const offset: number = (params.page - 1) * params.pageSize;

    const isFilter = filters.length ? and(...filters) : undefined;

    const [data, totalBooks, totalBooksWithoutFilter] = await Promise.all([
        db
            .select()
            .from(books)
            .innerJoin(authors, eq(books.authorId, authors.id))
            .where(isFilter)
            .orderBy(books.authorId, books.year, books.id)
            .limit(Number(params.pageSize))
            .offset(offset),
        db.select({ total: count() }).from(books).where(isFilter),
        db.select({ total: count() }).from(books),
    ]);

    const total = totalBooks[0].total;
    const totalWithoutFilter = totalBooksWithoutFilter[0].total;
    const totalPages = Math.ceil(total / params.pageSize);

    return {
        data,
        total,
        totalPages,
        totalWithoutFilter,
    };
};

export async function getAuthors() {
    const allAuthors: Author[] = await db.select().from(authors);
    return allAuthors;
};

export async function createBookAction(bookInput: BookWithAuthor) {
    const result = schema.safeParse(bookInput.Books, { reportInput: true });

    if (!result.success) {
        return { success: false, error: "Validation Error" };
    }

    try {
        const [newBook] = await db.insert(books).values(result.data).returning();
        if (!newBook) {
            return { success: false, error: "Buch konnte nicht hinzugefügt werden." };
        };

        const [newBookWithAuthor] = await db
            .select()
            .from(books)
            .innerJoin(authors, eq(books.authorId, authors.id))
            .where(eq(books.id, newBook.id));
        if (!newBookWithAuthor) {
            return { success: false, error: "Buch wurde angelegt, konnte aber nicht geladen werden." };
        };

        revalidatePath("/books");
        return { success: true, data: newBookWithAuthor, message: "Buch wurde hinzugefügt." };

    } catch (error) {
        console.error("createBookAction failed", error);
        return { success: false, error: "Validation Error" };
    }
};

export async function updateBookAction(id: number, bookInput: BookWithAuthor) {
    const result = schema.safeParse(bookInput.Books, { reportInput: true });

    if (!result.success) {
        return { success: false, error: "Validation Error" };
    }

    try {


        const updated = await db.update(books).set(result.data).where(eq(books.id, id)).returning();
        if (updated.length === 0) {
            return { success: false, error: "Buch nicht gefunden." };
        };

        revalidatePath("/books");
        return { success: true, message: "Buch wurde geändert." };
    } catch (error) {
        console.error("updateBookAction failed", error);
        return { success: false, error: "Validation Error" };
    }
};

export async function deleteBookAction(id: number) {
    const deleted = await db.delete(books).where(eq(books.id, id)).returning();
    if (deleted.length === 0) {
        return { success: false, error: "Buch nicht gefunden." };
    }
    revalidatePath("/books");
    return { success: true, message: "Erfolgreich gelöscht." };
};
