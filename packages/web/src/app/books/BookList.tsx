"use client";

import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookForm } from "../../componentes/BookForm/BookForm";
import { Button } from "../../componentes/ui/Button";
import { dateAtom, timeAtom } from "../../componentes/utils/atoms";
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
   const [openBookId, setOpenBookId] = useState<number | undefined>(undefined);
   const date = useAtomValue(dateAtom);
   const time = useAtomValue(timeAtom);

   useEffect(() => {
      if (total <= 0) {
         toast.warning(`${total} Bücher geladen.`);
      } else if (total === 1) {
         toast.success("1 Buch geladen.");
      } else {
         toast.success(`${total} Bücher geladen.`);
      };
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
                        <AccordionSummary
                           aria-controls="panel1-content"
                           aria-label={`Accordion_${book.Books.id}`}
                        >
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
                           <Button
                              variant="primary"
                              type="button"
                              onClick={() =>
                                 setOpenBookId(openBookId === book.Books.id ? undefined : book.Books.id)
                              }
                              ariaLabel="Edit"
                           >
                              <strong>Edit</strong>
                           </Button>
                           <Button
                              variant="danger"
                              type="button"
                              onClick={async () => {
                                 const id = book.Books.id;
                                 if (id === undefined) return;
                                 const result = await deleteBookAction(id);
                                 if (result.success === true) {
                                    toast.success(result.message, { description: `${date}, ${time} Uhr` });
                                 } else {
                                    toast.error(result.error, { description: `${date}, ${time} Uhr` });
                                 }
                              }}
                              ariaLabel="Delete"
                           >
                              <strong>Delete</strong>
                           </Button>

                           {/* Update FormFields */}
                           <div className="updateForm" hidden={openBookId !== book.Books.id}>
                              <div className="updateFormField">
                                 <BookForm
                                    initialValues={{
                                       id: book.Books.id,
                                       title: book.Books.title,
                                       authorId: book.Books.authorId,
                                       isbn: book.Books.isbn,
                                       year: book.Books.year ?? undefined,
                                    }}
                                    authors={authors}
                                    onSubmit={async (_e, data) => {
                                       const id = book.Books.id;
                                       if (id === undefined) return;
                                       const result = await updateBookAction(id, data);
                                       setOpenBookId(undefined);
                                       if (result.success === true) {
                                          toast.success(result.message, { description: `${date}, ${time} Uhr` });
                                       } else {
                                          toast.error(result.error, { description: `${date}, ${time} Uhr` });
                                       }
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
               onSubmit={async (_e, data) => {
                  const result = await createBookAction(data);
                  if (result.success === true) {
                     toast.success(result.message, { description: `${date}, ${time} Uhr` });
                  } else {
                     toast.error(result.error, { description: `${date}, ${time} Uhr` });
                  }
               }}
               submitLabel="Add"
            />
         </div>
      </div>
   );
};
