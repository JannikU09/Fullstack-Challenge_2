import type { Author } from "./Author";

export interface BookWithAuthor {
  Books: {
    id?: number;
    title: string;
    authorId: number;
    isbn: string;
    year?: number | null;
  };
  Author: Author;
}
