"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { BookForm } from "../../componentes/BookForm/BookForm";
import { Button } from "../../componentes/ui/Button";
import { useDebounce } from "../../lib/useDebounce";
import type { Author } from "../interfaces/Author";
import type { BookResponse } from "../interfaces/BookRespone";
import type { BookWithAuthor } from "../interfaces/BookWithAuthor";
import "./page.css";

export default function BooksPage() {
  const [allBooks, setAllBooks] = useState<BookWithAuthor[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 750);
  const [authorIdSearch, setAuthorIdSearch] = useState("");
  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("20");
  const [totalPages, setTotalPages] = useState(1);
  const [optimisticBooks, setOptimisticBooks] = useOptimistic(allBooks, switchOperations);

  function switchOperations(currentBooks: BookWithAuthor[], action) {
    switch (action.type) {

      case "ADD": {
        const author2 = allAuthors.find((a) => a.id === Number(action.book.Books.authorId));
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
            Author: author2,
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

  let pages = [];
  const pageSizeValue = [5, 20, 50, 75, 100];

  // Autoren laden
  useEffect(() => {
    async function authorFetch() {
      const res = await fetch("/api/authors");
      const data: Author[] = await res.json();
      setAllAuthors(data);
      console.log("Autoren", data);
    }
    authorFetch();
  }, []);

  const params = useSearchParams();
  const q = params?.get("q") || "";
  const authorId = params?.get("authorId") || "";
  const pageUrl = params?.get("page") || "1";
  const pageSizeUrl = params?.get("pageSize") || "20";

  useEffect(() => {
    if (q || authorId || pageUrl || pageSizeUrl) {
      setQuery(q);
      setAuthorIdSearch(authorId);
      setPage(pageUrl);
      setPageSize(pageSizeUrl);
    }
  }, [q, authorId, pageUrl, pageSizeUrl]);

  const searchValue = debouncedQuery || q || "";
  const searchAuthorId = authorIdSearch || authorId || "";
  const searchPage = page || pageUrl || 1;
  const searchPageSize = pageSize || pageSizeUrl || 20;

  const handlePageUpdate = () => {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  // Bücher laden
  useEffect(() => {
    async function bookFetch() {
      const res = await fetch(
        `/api/books?q=${searchValue}&authorId=${searchAuthorId}&page=${searchPage}&pageSize=${searchPageSize}`,
      );
      const data: BookResponse = await res.json();
      setAllBooks(data.data);
      console.log("data", data);
      console.log(res);
      setTotalPages(Math.ceil(data.total / Number(pageSize)));
      toast.info(`Anzahl der Bücher: ${data.total}`, { id: "anzahlBücher_id", duration: 2650 });
    }
    bookFetch();
    toast.promise(bookFetch(), {
      loading: "Bücher werden geladen...",
      success: "Bücher geladen.",
      error: (err) => `${err.message}`,
    });
  }, [searchValue, searchAuthorId, searchPage, searchPageSize, pageSize]);

  pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Bücher nach Suche laden
  async function handleSearch() {
    const res = await fetch(
      `/api/books?q=${searchValue}&authorId=${searchAuthorId}&page=${searchPage}&pageSize=${searchPageSize}`,
    );
    console.log(res);
    const data: BookResponse = await res.json();
    console.log("data: ", data);
    if (Array.isArray(data.data) !== true) return;
    setAllBooks(data.data);
    setTotalPages(Math.ceil(data.total / Number(pageSize)));
    handlePageUpdate();
    toast.info(`Anzahl der Bücher: ${data.total}`);
  }

  // Büchersuche zurücksetzen
  async function resetSearch() {
    const res = await fetch(`/api/books?page=${page}&pageSize=${pageSize}`);
    const data: BookResponse = await res.json();
    setAllBooks(data.data);
    setQuery("");
    setAuthorIdSearch("");
    setPageSize("20");
    setPage("1");
    setTotalPages(Math.ceil(data.total / Number(pageSize)));
    handlePageUpdate();
    toast.info(`Es werden wieder alle ${data.total} Bücher angezeigt.`);
  }

  // Neues Buch hinzufügen
  async function createBook(_event: React.MouseEvent<HTMLButtonElement>, data: BookWithAuthor) {
    startTransition(async () => {
      setOptimisticBooks({ type: "ADD", book: data });

      console.log("createBook", data);
      const _res = await fetch("/api/books", {
        method: "POST",
        body: JSON.stringify({
          title: data.Books.title,
          authorId: data.Books.authorId,
          isbn: data.Books.isbn,
          year: Number(data.Books.year) > 0 ? Number(data.Books.year) : undefined,
        }),
      });
      if (_res.ok) {
        toast.success("Das Buch wurde hinzugefügt", { description: `${data.Books.title}` });
      } else {
        toast.error("Das Buch konnte nicht hinzugefügt werden.");
      }

      const res = await fetch(`/api/books?page=${page}&pageSize=${pageSize}`);
      console.log(res);
      const newBook: BookResponse = await res.json();
      setAllBooks(newBook.data);
      if (res.ok) {
        toast.info(`Anzahl der Bücher: ${newBook.total}`);
      }
      console.log(allBooks);
      setTotalPages(Math.ceil(newBook.total / Number(pageSize)));
      handlePageUpdate();
    });
  }

  // Bestehendes Buch bearbeiten
  async function updateBook(_event: React.MouseEvent<HTMLButtonElement>, data: BookWithAuthor) {
    startTransition(async () => {
      setOptimisticBooks({ type: "UPDATE", book: data });
      setIsOpen(false);
      console.log(data);
      const _res = await fetch(`api/books/${data.Books.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: data.Books.title,
          authorId: data.Books.authorId,
          isbn: data.Books.isbn,
          year: Number(data.Books.year) > 0 ? Number(data.Books.year) : undefined,
        }),
      });
      if (_res.ok) {
        toast.success(`Das Buch wurde angepasst.`, {
          description: `${data.Books.title}`
        });
      } else {
        toast.error("Das Buch konnte nicht angepasst werden.", {
          description: `${data.Books.title}`,
        });
      }

      const res = await fetch(`/api/books?page=${page}&pageSize=${pageSize}`);
      console.log(res);
      const updatedBook: BookResponse = await res.json();
      setAllBooks(updatedBook.data);
      setTotalPages(Math.ceil(updatedBook.total / Number(pageSize)));
      handlePageUpdate();
    });
  }

  function handleOnSubmit(event: React.MouseEvent<HTMLButtonElement>, data: BookWithAuthor) {
    updateBook(event, data);
    console.log("updateBookData", data);
  }

  // Einzelne Bücher löschen
  async function deleteBook(bookId: number) {
    startTransition(async () => {
      setOptimisticBooks({ type: "DELETE", id: bookId });
      const _res = await fetch(`api/books/${bookId}`, {
        method: "DELETE",
      });
      if (_res.ok) {
        const res = await fetch(`/api/books?page=${page}&pageSize=${pageSize}`);
        const data: BookResponse = await res.json();
        setAllBooks(data.data);
        setTotalPages(Math.ceil(data.total / Number(pageSize)));
        handlePageUpdate();
        toast.success("Das Buch wurde gelöscht.");
      } else {
        toast.error(`Das Löschen ist fehlgeschlagen.`);
      }
    });
  }

  const handlePageSize = (event: SelectChangeEvent) => {
    setPageSize(event.target.value as string);
    setPage("1");
  };

  const handlePageNumber = (event: SelectChangeEvent) => {
    setPage(event.target.value as string);
  };

  return (
    <div>
      <div className="search">
        <TextField
          style={{
            width: "100%",
          }}
          value={query}
          label="Search"
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
        <div style={{ margin: "auto 5px" }} />
        <FormControl fullWidth>
          <InputLabel>Author</InputLabel>
          <Select
            value={authorIdSearch}
            onChange={(event) => setAuthorIdSearch(event.target.value)}
            label="Author"
          >
            {allAuthors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="searchButton">
          <Button variant="primary" type="button" onClick={handleSearch}>
            <strong>Search</strong>
          </Button>
          <Button variant="primary" type="button" onClick={resetSearch}>
            <strong>Reset</strong>
          </Button>
        </div>
      </div>

      <div className="pageSizeSelect">
        <FormControl fullWidth disabled={totalPages <= 1}>
          <InputLabel>Page</InputLabel>
          <Select value={page} label="Page" onChange={handlePageNumber}>
            {pages.map((pageValue) => (
              <MenuItem key={pageValue} value={pageValue}>
                {pageValue}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ margin: "5px" }} />
        <FormControl fullWidth>
          <InputLabel>Page Size</InputLabel>
          <Select value={pageSize} label="Page Size" onChange={handlePageSize}>
            {pageSizeValue.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Bücher</h1>
        <h1>Neues Buch</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {/* Liste der Bücher */}
        <div className="books">
          {optimisticBooks?.length === 0 ? (
            <p>Keine Bücher gefunden</p>
          ) : (
            optimisticBooks?.map((book) => (
              <div key={book.Books.id} className="book">
                <Accordion>
                  <AccordionSummary aria-controls="panel1-content">
                    <Typography component={"span"}>
                      <h4>{book.Books.title}</h4>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p>
                      <strong>ID: </strong> {book.Books.id}
                    </p>
                    <p>
                      <strong>Author: </strong> {book.Author.name}
                    </p>
                    <p>
                      <strong>ISBN: </strong> {book.Books.isbn}
                    </p>
                    <p hidden={!book.Books.year}>
                      <strong>Year: </strong> {book.Books.year}
                    </p>
                    <Button variant="primary" type="button" onClick={() => setIsOpen(!isOpen)}>
                      <strong>Edit</strong>
                    </Button>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => deleteBook(book.Books.id)}
                    >
                      <strong>Delete</strong>
                    </Button>

                    {/* Update FormFields */}
                    <div className="updateForm" hidden={!isOpen}>
                      <div className="updateFormField">
                        <BookForm
                          initialValues={{
                            id: book.Books.id,
                            title: book.Books.title,
                            authorId: book.Books.authorId,
                            isbn: book.Books.isbn,
                            year: book.Books.year,
                          }}
                          authors={allAuthors}
                          onSubmit={handleOnSubmit}
                          submitLabel="Update"
                        />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))
          )}
        </div>

        {/* Formular zum Hinzufügen von Büchern */}
        <div className="formField">
          <BookForm authors={allAuthors} onSubmit={createBook} submitLabel="Add" />
        </div>
      </div>
    </div>
  );
}
