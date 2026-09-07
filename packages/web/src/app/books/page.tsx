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
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookForm } from "../../componentes/BookForm/BookForm";
import { Button } from "../../componentes/ui/Button";
import {
  allAuthorsAtom,
  allBooksAtom,
  pageAtom,
  pageSizeAtom,
  totalPagesAtom,
} from "../../componentes/utils/atoms";
import { useBookActions } from "../../componentes/utils/bookOperations";
import { useDebounce } from "../../lib/useDebounce";
import type { Author } from "../interfaces/Author";
import type { BookResponse } from "../interfaces/BookRespone";
import type { BookWithAuthor } from "../interfaces/BookWithAuthor";
import { createBookAction, deleteBookAction, updateBookAction } from "./actions";
import "./page.css";

export default function BooksPage() {
  const [allBooks, setAllBooks] = useAtom(allBooksAtom);
  const [allAuthors, setAllAuthors] = useAtom(allAuthorsAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 750);
  const [authorIdSearch, setAuthorIdSearch] = useState("");
  const [page, setPage] = useAtom(pageAtom);
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);
  const [totalPages, setTotalPages] = useAtom(totalPagesAtom);

  const { optimisticBooks, createBook, updateBook, deleteBook } = useBookActions();

  let pages = [];
  const pageSizeValue = [5, 20, 50, 75, 100];

  // Autoren laden
  useEffect(() => {
    async function authorFetch() {
      const res = await fetch("/api/authors");
      if (!res.ok) return;
      const data: Author[] = await res.json();
      setAllAuthors(data);
    }
    authorFetch();
  }, [setAllAuthors]);

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
  }, [q, authorId, pageUrl, pageSizeUrl, setPage, setPageSize]);

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
      if (!res.ok) return;
      const data: BookResponse = await res.json();
      setAllBooks(data.data);
      setTotalPages(Math.ceil(data.total / Number(pageSize)));
      toast.info(`Anzahl der Bücher: ${data.total}`, { id: "anzahlBücher_id", duration: 2650 });
    }
    bookFetch();
    toast.promise(bookFetch(), {
      loading: "Bücher werden geladen...",
      success: "Bücher geladen.",
      error: (err) => `${err.message}`,
    });
  }, [
    searchValue,
    searchAuthorId,
    searchPage,
    searchPageSize,
    pageSize,
    setAllBooks,
    setTotalPages,
  ]);

  pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Bücher nach Suche laden
  async function handleSearch() {
    const res = await fetch(
      `/api/books?q=${searchValue}&authorId=${searchAuthorId}&page=${searchPage}&pageSize=${searchPageSize}`,
    );
    if (!res.ok) return;
    const data: BookResponse = await res.json();
    if (Array.isArray(data.data) !== true) return;
    setAllBooks(data.data);
    setTotalPages(Math.ceil(data.total / Number(pageSize)));
    handlePageUpdate();
    toast.info(`Anzahl der Bücher: ${data.total}`);
  }

  // Büchersuche zurücksetzen
  async function resetSearch() {
    const res = await fetch(`/api/books?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) return;
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

  function handleOnSubmit(event: React.MouseEvent<HTMLButtonElement>, data: BookWithAuthor) {
    updateBook(event, data);
    setIsOpen(false);
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
