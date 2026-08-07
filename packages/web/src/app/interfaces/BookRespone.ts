import type { BookWithAuthor } from "./BookWithAuthor";

export interface BookResponse {
  data: BookWithAuthor[];
  total: number;
}
