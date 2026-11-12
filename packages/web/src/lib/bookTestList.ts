import type { Author } from "@/app/interfaces/Author";
import type { BookWithAuthor } from "../app/interfaces/BookWithAuthor";

export const authorTestList: Author[] = [
    { id: 1, name: "Autor A" },
    { id: 2, name: "Autor B" },
];

export const bookTestList: BookWithAuthor[] = [
    {
        Author: authorTestList[0],
        Books: {
            id: 1,
            title: "Harry Potter und der Stein der Weisen",
            isbn: "9783161484120",
            year: 1997,
            authorId: 1
        },
    },
    {
        Author: authorTestList[0],
        Books: {
            id: 2,
            title: "Harry Potter und die Kammer des Schreckens",
            isbn: "9783161484090",
            year: 1998,
            authorId: 1
        },
    },
    {
        Author: authorTestList[0],
        Books: {
            id: 3,
            title: "Harry Potter",
            authorId: 1,
            isbn: "1234567891011",
            year: 2026,
        },
    },
    {
        Author: authorTestList[1],
        Books: {
            id: 4,
            title: "Guten Morgen",
            authorId: 2,
            isbn: "7864521596483",
            year: 2025,
        },
    },
];
