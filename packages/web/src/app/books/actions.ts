"use server";

import { books, db } from "@repo/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const schema = z.object({
    title: z.string().min(1),
    authorId: z.number().int().positive(),
    isbn: z.string().min(13).max(13),
    year: z.number().int().min(1000).max(9999).optional(),
});

type BookInput = z.infer<typeof schema>;

export async function createBookAction(bookInput: BookInput) {
    const result = schema.safeParse(bookInput, { reportInput: true });
    console.log(result);

    if (!result.success) {
        return { success: false, error: "Validation Error" };
    }

    await db.insert(books).values(result.data).returning();
    revalidatePath("/books");
    return { success: true };
}

export async function updateBookAction(id: number, bookInput: BookInput) {
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
