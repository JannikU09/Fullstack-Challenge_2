import { useAtom, useAtomValue } from "jotai";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import type { BookResponse } from "../../app/interfaces/BookRespone";
import type { BookWithAuthor } from "../../app/interfaces/BookWithAuthor";
import { allAuthorsAtom, allBooksAtom, pageAtom, pageSizeAtom, totalPagesAtom } from "./atoms";
import { switchOperations } from "./switchOperations";

export function useBookActions() {
  const [allBooks, setAllBooks] = useAtom(allBooksAtom);
  const allAuthors = useAtomValue(allAuthorsAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);
  const [totalPages, setTotalPages] = useAtom(totalPagesAtom);
  const [optimisticBooks, setOptimisticBooks] = useOptimistic(allBooks, switchOperations);

  async function reload() {
    const res = await fetch(`/api/books?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) return;
    const books: BookResponse = await res.json();
    setAllBooks(books.data);
    setTotalPages(Math.ceil(books.total / Number(pageSize)));
    return books;
  }

  async function createBook(_event: React.MouseEvent<HTMLButtonElement>, data: BookWithAuthor) {
    const author = allAuthors.find((a) => a.id === Number(data.Books.authorId));
    startTransition(async () => {
      setOptimisticBooks({
        type: "ADD",
        book: {
          ...data,
          Author: author ?? data.Author,
        },
      });

      const res = await fetch("/api/books", {
        method: "POST",
        body: JSON.stringify({
          title: data.Books.title,
          authorId: data.Books.authorId,
          isbn: data.Books.isbn,
          year: Number(data.Books.year) > 0 ? Number(data.Books.year) : undefined,
        }),
      });
      if (res.ok) {
        toast.success("Das Buch wurde hinzugefügt", { description: `${data.Books.title}` });
      } else {
        toast.error("Das Buch konnte nicht hinzugefügt werden.");
        return;
      }
      await reload();
    });
  }

  async function updateBook(_event: React.MouseEvent<HTMLButtonElement>, data: BookWithAuthor) {
    startTransition(async () => {
      setOptimisticBooks({ type: "UPDATE", book: data });

      const res = await fetch(`api/books/${data.Books.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: data.Books.title,
          authorId: data.Books.authorId,
          isbn: data.Books.isbn,
          year: Number(data.Books.year) > 0 ? Number(data.Books.year) : undefined,
        }),
      });
      if (res.ok) {
        toast.success(`Das Buch wurde angepasst.`, {
          description: `${data.Books.title}`,
        });
      } else {
        toast.error("Das Buch konnte nicht angepasst werden.", {
          description: `${data.Books.title}`,
        });
        return;
      }
      await reload();
    });
  }

  async function deleteBook(bookId: number) {
    startTransition(async () => {
      setOptimisticBooks({ type: "DELETE", id: bookId });
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Das Buch wurde gelöscht.");
        await reload();
      } else {
        toast.error("Das Löschen ist fehlgeschlagen.");
        return;
      }
    });
  }

  return { optimisticBooks, createBook, updateBook, deleteBook, reload };
}
