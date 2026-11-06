import { db } from "@repo/database";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authorTestList, bookTestList } from "../../lib/bookTestList";
import type { BookWithAuthor } from "../interfaces/BookWithAuthor";
import type { BookSearchParams } from "../interfaces/searchParams";
import {
    createBookAction,
    deleteBookAction,
    getAuthors,
    getBooks,
    updateBookAction,
} from "./actions";

function createChain(resolvedValue: unknown) {
    const methods = [
        "select",
        "from",
        "innerJoin",
        "where",
        "orderBy",
        "limit",
        "offset",
        "insert",
        "values",
        "returning",
        "update",
        "set",
        "delete",
    ];

    const chain: Record<string, any> = {};
    const promise = Object.assign(Promise.resolve(resolvedValue), chain);

    methods.forEach((method) => {
        promise[method] = vi.fn(() => promise);
    });

    return promise;
}

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
}));

vi.mock("@repo/database", () => ({
    db: {
        insert: vi.fn(),
        select: vi.fn().mockResolvedValue({ from: vi.fn() }),
        update: vi.fn(),
        delete: vi.fn(),
    },
    books: {},
    authors: {},
}));

describe("actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getBooks, gibt alle Bücher zurück.", async () => {
        const total = bookTestList.length;

        (db.select as any)
            .mockReturnValueOnce(createChain(bookTestList))
            .mockReturnValueOnce(createChain([{ total }]))
            .mockReturnValueOnce(createChain([{ total }]));

        const searchParams: BookSearchParams = { q: "Harry", authorId: 1, page: 1, pageSize: 20 };

        const result = await getBooks(searchParams);

        expect(result.data).toEqual(bookTestList);
        expect(result.total).toEqual(total);
        expect(result.totalWithoutFilter).toEqual(total);
        expect(result.totalPages).toEqual(Math.ceil(total / searchParams.pageSize));
    });

    it("getBooks, gibt alle Bücher zurück und setzt page auf 1.", async () => {
        const total = bookTestList.length;

        (db.select as any)
            .mockReturnValueOnce(createChain(bookTestList))
            .mockReturnValueOnce(createChain([{ total }]))
            .mockReturnValueOnce(createChain([{ total }]));

        const searchParams: BookSearchParams = { q: "", authorId: undefined } as unknown as BookSearchParams;

        await getBooks(searchParams);

        expect(searchParams.page).toBe(1);
        expect(searchParams.pageSize).toBe(20);
    });

    it("getBooks, gibt alle Bücher zurück und setzt page auf 1 und pageSize auf 20, da beide 0 sind.", async () => {
        const total = bookTestList.length;

        (db.select as any)
            .mockReturnValueOnce(createChain(bookTestList))
            .mockReturnValueOnce(createChain([{ total }]))
            .mockReturnValueOnce(createChain([{ total }]));

        const searchParams: BookSearchParams = { q: "", authorId: 1, page: -5, pageSize: 0 };

        await getBooks(searchParams);

        expect(searchParams.page).toBe(1);
        expect(searchParams.pageSize).toBe(20);
    });

    it("getAuthor, gibt alle Autoren zurück", async () => {
        (db.select as any).mockReturnValue(createChain(authorTestList));

        const result = await getAuthors();

        expect(result).toEqual(authorTestList);
    });

    it("createBookAction, legt ein Buch an und ruft es ab.", async () => {
        (db.insert as any).mockReturnValue(createChain([bookTestList[0].Books]));
        (db.select as any).mockReturnValue(createChain([bookTestList[0]]));

        const result = await createBookAction(bookTestList[0]);

        expect(result.success).toBe(true);
        expect(result.message).toEqual("Buch wurde hinzugefügt.");
    });

    it("createBookAction, wenn der Input invalid ist.", async () => {
        const invalidInput: BookWithAuthor = {
            Books: {
                title: "",
                authorId: -1,
                isbn: "123456789",
                year: 17,
            },
            Author: { id: 1, name: "Jannik" },
        };

        const result = await createBookAction(invalidInput);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Validation Error");
    });

    it("falls createBookAction fehlschlägt.", async () => {
        (db.insert as any).mockReturnValue(createChain([]));

        const result = await createBookAction(bookTestList[0]);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Buch konnte nicht hinzugefügt werden.");
    });

    it("createBookAction, Buch wird angelegt, kann aber nicht abgerufen werden.", async () => {
        (db.insert as any).mockReturnValue(createChain([bookTestList[0].Books]));
        (db.select as any).mockReturnValueOnce(createChain([]))

        const result = await createBookAction(bookTestList[0]);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Buch wurde angelegt, konnte aber nicht geladen werden.");
    });

    it("updateBookAction, wenn alles passt", async () => {
        (db.update as any).mockReturnValue(createChain([bookTestList[1].Books]));
        (db.select as any).mockReturnValue(createChain([bookTestList[1]]));

        const result = await updateBookAction(2, bookTestList[1]);

        expect(result.success).toBe(true);
        expect(result.message).toEqual("Buch wurde geändert.")
    });

    it("updateBookAction, wenn der Input invalid ist.", async () => {
        const invalidInput: BookWithAuthor = {
            Books: {
                title: "",
                authorId: -1,
                isbn: "123456789",
                year: 17,
            },
            Author: { id: 1, name: "Jannik" },
        };

        const result = await updateBookAction(1, invalidInput);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Validation Error");
    });

    it("falls updateBookAction fehlschlägt.", async () => {
        (db.update as any).mockReturnValue(createChain([]));

        const result = await updateBookAction(99999, bookTestList[1]);

        expect(result.success).not.toBe(true);
        expect(result.error).toEqual("Buch nicht gefunden.")
    });

    it("deleteBookAction, löscht erfolgreich ein Buch", async () => {
        (db.delete as any).mockReturnValue(createChain([bookTestList[0].Books]));

        const result = await deleteBookAction(1);
        expect(db.delete).toHaveBeenCalledOnce();
        expect(result.message).toBe("Erfolgreich gelöscht.");
    });

    it("deleteBookAction, wenn die id falsch ist", async () => {
        (db.delete as any).mockReturnValue(createChain([]));

        const result = await deleteBookAction(-2);

        expect(result.success).not.toBe(true);
        expect(result.error).toEqual("Buch nicht gefunden.")
    });
});
