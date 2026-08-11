import type { BookAction } from "../../app/interfaces/BookAction";
import type { BookWithAuthor } from "../../app/interfaces/BookWithAuthor";

export function switchOperations(
    currentBooks: BookWithAuthor[],
    action: BookAction,
): BookWithAuthor[] {
    switch (action.type) {
        case "ADD": {
            return [
                ...currentBooks,
                {
                    Books: {
                        id: Date.now(),
                        title: action.book.Books.title,
                        authorId: action.book.Books.authorId,
                        isbn: action.book.Books.isbn,
                        year: action.book.Books.year,
                    },
                    Author: action.author ?? { id: 0, name: "" },
                },
            ];
        }

        case "UPDATE":
            return currentBooks.map((book) => {
                if (book.Books.id === action.book.Books.id) {
                    return { ...book, Books: { ...book.Books, ...action.book.Books } };
                } else {
                    return book;
                }
            });

        case "DELETE":
            return currentBooks.filter((book) => book.Books.id !== action.id);

        default:
            return currentBooks;
    }
}
