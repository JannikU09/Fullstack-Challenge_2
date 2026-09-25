"use client";

import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookForm } from "../../componentes/BookForm/BookForm";
import { Button } from "../../componentes/ui/Button";
import type { Author } from "../interfaces/Author";
import type { BookWithAuthor } from "../interfaces/BookWithAuthor";
import { createBookAction, deleteBookAction, updateBookAction } from "./actions";
import "./page.css";

type BookListProps = {
   books: BookWithAuthor[];
   authors: Author[];
   total: number;
};

export const BookList = ({ books, authors, total }: BookListProps) => {
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
      total === 1 ?
         toast.success(`${total} Buch geladen.`) :
         toast.success(`${total} Bücher geladen.`);
   }, [total]);

   return (
      <div
         style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
         }}
      >
         <div className="books">
            {books.length === 0 ? (
               <p>Keine Bücher gefunden.</p>
            ) : (
               books.map((book) => (
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
                              onClick={() => deleteBookAction(book.Books.id)}
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
                                    authors={authors}
                                    onSubmit={(_e, data) => {
                                       updateBookAction(book.Books.id, data);
                                       setIsOpen(false);
                                    }}
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

         {/* Formular um Bücher hinzuzufügen */}
         <div className="formField">
            <BookForm
               authors={authors}
               onSubmit={(_e, data) => createBookAction(data)}
               submitLabel="Add"
            />
         </div>
      </div>
   );
};
