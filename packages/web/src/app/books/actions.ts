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

    console.log(params.page, params.pageSize);

    if (params.q) {
        filters.push(ilike(books.title, `%${params.q}%`));
        console.log(params.q);
    }
    if (params.authorId) {
        filters.push(eq(books.authorId, Number(params.authorId)));
        console.log(params.authorId);
    }
    if (params.page) {
        console.log(params.page);
    }
    if (params.pageSize) {
        console.log(params.pageSize);
    }

    console.log("filters", filters);

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
        search: params.q ?? "",
    };
}

export async function getAuthors() {
    const allAuthors: Author[] = await db.select().from(authors);
    return allAuthors;
}

export async function createBookAction(bookInput: BookWithAuthor) {
    const result = schema.safeParse(bookInput, { reportInput: true });
    console.log(result);

    if (!result.success) {
        return { success: false, error: "Validation Error" };
    }

    await db.insert(books).values(result.data).returning();
    revalidatePath("/books");
    return { success: true };
}

export async function updateBookAction(id: number, bookInput: BookWithAuthor) {
    const result = schema.safeParse(bookInput, { reportInput: true });
    console.log(result);

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
