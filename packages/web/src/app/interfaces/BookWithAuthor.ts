import type { Author } from "./Author";

export interface BookWithAuthor {
  Books: {
    id: number;
    title: string;
    isbn?: string;
    year?: number;
    authorId: number;
  };
  Author: Author;
}
