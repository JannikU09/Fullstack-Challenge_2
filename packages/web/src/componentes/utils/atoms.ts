import { atom } from "jotai";
import type { Author } from "../../app/interfaces/Author";
import type { BookWithAuthor } from "../../app/interfaces/BookWithAuthor";

export const allBooksAtom = atom<BookWithAuthor[]>([]);
export const allAuthorsAtom = atom<Author[]>([]);
export const pageAtom = atom(1);
export const pageSizeAtom = atom(20);
export const totalPagesAtom = atom(1);
export const queryAtom = atom("");
export const authorIdAtom = atom("");
export const pageSizeValueAtom = atom([5, 20, 50, 75, 100]);