"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "@/componentes/ui/Button";
import { BookForm } from "../../componentes/BookForm/BookForm";
import "./page.css";

export interface BookWithAuthor {
  Books: {
    id: number;
    title: string;
    isbn?: string;
    year?: number;
    authorId: number;
  };
  Author: {
    id: number;
    name: string;
  };
}

interface Author {
  id: number;
  name: string;
}

export default function BooksPage() {
  const [allBooks, setAllBooks] = useState<BookWithAuthor[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [authorIdSearch, setAuthorIdSearch] = useState<Author>("");

  // Bücher laden
  useEffect(() => {
    async function bookFetch() {
      const res = await fetch(`/api/books`);
      const data: BookWithAuthor[] = await res.json();
      setAllBooks(data);
    }
    bookFetch();
  }, []);

  // Bücher nach Suche laden
  async function handleSearch() {
    console.log(authorIdSearch);
    const res = await fetch(
      `/api/books?q=${encodeURIComponent(query)}&authorId=${encodeURIComponent(authorIdSearch)}`,
    );
    console.log(res);
    const data: BookWithAuthor = await res.json();
    console.log(data);
    if (Array.isArray(data) !== true) return;
    setAllBooks(data);
  }

  // Büchersuche zurücksetzen
  async function resetSearch() {
    const res = await fetch(`/api/books`);
    const data: BookWithAuthor[] = await res.json();
    setAllBooks(data);
  }

  // Autoren laden
  useEffect(() => {
    async function authorFetch() {
      const res = await fetch("/api/authors");
      const data: Author[] = await res.json();
      setAllAuthors(data);
    }
    authorFetch();
  }, []);

  // Neues Buch hinzufügen
  async function createBook(event, data: BookWithAuthor) {
    console.log("createBook", event, data);
    const _res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        title: data.Books.title,
        authorId: data.Books.authorId,
        isbn: data.Books.isbn,
        year: Number(data.Books.year),
      }),
    });

    const res = await fetch("api/books");
    const newBook: BookWithAuthor[] = await res.json();
    setAllBooks(newBook);
  }

  // Bestehendes Buch bearbeiten
  async function updateBook(event, data: BookWithAuthor) {
    console.log(event, data);
    const _res = await fetch(`api/books/${data.Books.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: data.Books.title,
        authorId: data.Books.authorId,
        isbn: data.Books.isbn,
        year: Number(data.Books.year),
      }),
    });

    const res = await fetch("api/books");
    const updatedBook: BookWithAuthor[] = await res.json();
    setAllBooks(updatedBook);
    setIsOpen(false);
  }

  function handleOnSubmit(event, data) {
    updateBook(event, data);
    console.log(data);
  }

  // Einzelne Bücher löschen
  async function deleteBook(bookId: number) {
    await fetch(`api/books/${bookId}`, {
      method: "DELETE",
    });
    const res = await fetch("api/books");
    const data: BookWithAuthor[] = await res.json();
    setAllBooks(data);
  }

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
          {allBooks.length === 0 ? (
            <p>Keine Bücher gefunden</p>
          ) : (
            allBooks.map((book) => (
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
                    <p>
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
                    <div className="updateForm" hidden={isOpen !== true}>
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

        {/* Formular */}
        <div className="formField">
          <BookForm authors={allAuthors} onSubmit={createBook} submitLabel="Add" />
        </div>
      </div>
    </div>
  );
}
