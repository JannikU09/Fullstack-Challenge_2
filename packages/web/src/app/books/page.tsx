"use client";

import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
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
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [year, setYear] = useState<number | string>("");
  const [openEditor, setOpenEditor] = useState(false);

  // Bücher laden
  useEffect(() => {
    async function bookFetch() {
      const res = await fetch("/api/books");
      const data: BookWithAuthor[] = await res.json();
      setAllBooks(data);
    }
    bookFetch();
  }, []);

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
    const res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        title: data.Books.title,
        authorId: data.Books.authorId,
        isbn: data.Books.isbn,
        year: Number(data.Books.year),
      }),
    });
    console.log(event, data);
    // const res = await fetch('api/books');
    // const data: BookWithAuthor[] = await res.json();
    const newBook: BookWithAuthor = await res.json();
    console.log("newBook", newBook);
    setAllBooks([newBook, ...allBooks].sort((a, b) => a.Author.id - b.Author.id));
  }

  async function updateBook(bookId: number) {
    const _res = await fetch(`api/books/${bookId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        authorId: authorId,
        isbn: isbn || null,
        year: year || null,
      }),
    });
    // console.log(res);
    const res2 = await fetch("api/books");
    const data: BookWithAuthor[] = await res2.json();
    // console.log("updateBook ", data);
    setAllBooks(data);

    setTitle("");
    setAuthorId("");
    setIsbn("");
    setYear("");
    setOpenEditor(false);
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
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
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => setOpenEditor(!openEditor)}
                    >
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
                    <div className="updateForm" hidden={openEditor !== true}>
                      <div className="updateFormField">
                        <BookForm
                          initialValues={{
                            title: book.Books.title,
                            authorId: book.Books.authorId,
                            isbn: book.Books.isbn || "",
                            year: book.Books.year || "",
                          }}
                          authors={allAuthors}
                          onSubmit={() => updateBook(book.Books.id)}
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
