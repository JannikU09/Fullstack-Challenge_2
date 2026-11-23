"use client";

import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { type ChangeEvent, useState } from "react";
import type { BookFormProps } from "../../app/interfaces/BookFormProps";
import { Button } from "../ui/Button";
import "./bookForm.css";

export function BookForm({
  initialValues,
  authors,
  onSubmit,
  submitLabel = "Speichern",
}: BookFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [authorId, setAuthorId] = useState(initialValues?.authorId ?? "");
  const [isbn, setIsbn] = useState(initialValues?.isbn ?? "");
  const [year, setYear] = useState(initialValues?.year ?? "");
  const [isValidTitle, setIsValidTitle] = useState(false);
  const [isValidAuthor, setIsValidAuthor] = useState(false);
  const [isValidIsbn, setIsValidIsbn] = useState(false);
  const [isValidYear, setIsValidYear] = useState(false);

  const handleEmptyFields = () => {
    if (!initialValues) {
      setTitle("");
      setAuthorId("");
      setIsbn("");
      setYear("");
    }
  };

  const handleValidationTitle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    const reg = /^[a-zA-zäöüÄÖÜ]+$/g;
    const title = e.target.value;

    setIsValidTitle(reg.test(title));
    setTitle(title);
  };

  const handleValidationAuthor = (e: string | number) => {
    const reg = /\w/g;
    const authorId = String(e);

    setIsValidAuthor(reg.test(authorId));
    setAuthorId(authorId);
  };

  const handleValidationIsbn = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    const reg = /^\d{13}$/g;
    const isbn = e.target.value;

    setIsValidIsbn(reg.test(isbn));
    setIsbn(isbn);
  };

  const handleValidationYear = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    const reg = /^\d{4}/;
    const year = e.target.value;

    setIsValidYear(reg.test(year));
    setYear(year);
  };

  return (
    <div>
      <Box>
        <TextField
          value={title}
          label="Title"
          onChange={(event) => handleValidationTitle(event)}
          autoComplete="off"
          required
          error={!isValidTitle}
        />
        <p className="errorText" hidden={isValidTitle}>
          Bitte einen Title eingeben.
        </p>
        <div style={{ margin: "10px" }} />

        <FormControl
          fullWidth
          required
          error={!isValidAuthor}
        >
          <InputLabel>Author</InputLabel>
          <Select
            value={authorId}
            onChange={(event) => handleValidationAuthor(event.target.value)}
            label="Author"
            aria-label="Author"
          >
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <p className="errorText" hidden={isValidAuthor}>
          Bitte einen Author auswählen.
        </p>
        <div style={{ margin: "10px" }} />

        <TextField
          value={isbn}
          label="ISBN"
          onChange={(event) => handleValidationIsbn(event)}
          autoComplete="off"
          required
          error={!isValidIsbn}
        />
        <p className="errorText" hidden={isValidIsbn}>
          Nur Ziffern eingeben.
        </p>
        <p className="errorText" hidden={isbn.length >= 13}>
          Noch {13 - isbn.length} Zeichen
        </p>
        <p className="errorText" hidden={isbn.length <= 13}>
          {isbn.length - 13} Zeichen zu viel!
        </p>
        <div style={{ margin: "10px" }} />

        <TextField
          value={year}
          label="Year"
          onChange={(event) => handleValidationYear(event)}
          error={!isValidYear}
        />
        <h6 style={{ color: "gray" }}>required *</h6>
        <div style={{ margin: "2.5px" }} />

        <Button
          variant="primary"
          type="button"
          onClick={async (e) => {
            await onSubmit?.(e, {
              Books: {
                id: initialValues?.id,
                title: title,
                authorId: Number(authorId),
                isbn: isbn,
                year: year === "" ? undefined : Number(year),
              },
              Author: {
                id: Number(authorId),
                name: "",
              },
            });
            handleEmptyFields();
          }}
        >
          <strong>{submitLabel}</strong>
        </Button>
      </Box>
    </div>
  );
}
