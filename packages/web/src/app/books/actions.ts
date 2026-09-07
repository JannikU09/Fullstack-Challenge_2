"use server";

import { authors, books, db } from "@repo/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import * as z from "zod";

export const schema = z.object({
    title: z.string().min(1),
    authorId: z.number().int().positive(),
    isbn: z.string().min(13).max(13),
    year: z.number().int().min(1000).max(9999).optional(),
});

type BookInput = {
    title: string;
    authorId: number;
    isbn: string;
    year?: number;
};

export async function createBookAction(data: BookInput) {
    const result = schema.safeParse(data, { reportInput: true });
    console.log(result);

    if (!result.success) {
        return NextResponse.json({ error: "Validation Error" }, { status: 400 });
    }

    await db.insert(books).values(result.data).returning();
    revalidatePath("/books");
};

export async function updateBookAction(id: number, data: BookInput) {
    const result = schema.safeParse(data, { reportInput: true });
    console.log(result);

    if (!result.success) {
        return NextResponse.json({ error: "Validation Error" }, { status: 400 });
    };

    await db.update(books).set(result.data).where(eq(books.id, id)).returning();
    revalidatePath("/books");
};

export async function deleteBookAction(id: number) {
    try {
        await db.delete(books).where(eq(books.id, id)).returning();
        revalidatePath("/books");
        return NextResponse.json({ message: "Erfolgreich gelöscht" }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
    }
};
