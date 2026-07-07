import type { BookWithAuthor } from "../app/interfaces/BookWithAuthor";

export const bookTestList: BookWithAuthor = [
    {
        Books: {
            id: 1,
            title: "Test-Buch",
            authorId: 1,
            isbn: "1353246437563",
            year: 2026,
        },
        Author: { id: 1, name: "Autor" }
    }
]