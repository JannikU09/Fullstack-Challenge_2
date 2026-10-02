import type { BookWithAuthor } from "./BookWithAuthor";

export type BookAction =
    | { type: "ADD"; book: BookWithAuthor }
    | { type: "UPDATE"; book: BookWithAuthor }
    | { type: "DELETE"; id: number };
