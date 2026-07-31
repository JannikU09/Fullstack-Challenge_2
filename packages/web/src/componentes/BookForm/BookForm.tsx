"use client";

import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
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

  const handleEmptyFields = () => {
    if (!initialValues) {
      setTitle("");
      setAuthorId("");
      setIsbn("");
      setYear("");
    }
  };

  return (
    <div>
      <Box>
        <TextField
          value={title}
          label="Title"
          onChange={(event) => setTitle(event.target.value)}
          autoComplete="off"
          required
        />
        <div style={{ margin: "10px" }} />

        <FormControl fullWidth required>
          <InputLabel>Author</InputLabel>
          <Select
            value={authorId}
            onChange={(event) => setAuthorId(event.target.value)}
            label="Author"
          >
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ margin: "10px" }} />

        <TextField
          value={isbn}
          label="ISBN"
          onChange={(event) => setIsbn(event.target.value)}
          autoComplete="off"
          required
        />
        <p className="isbnHilfstext" hidden={isbn.length >= 13}>Noch {13 - isbn.length} Zeichen</p>
        <p className="isbnHilfstext" hidden={isbn.length <= 13}>{isbn.length - 13} Zeichen zu viel!</p>
        <div style={{ margin: "10px" }} />

        <TextField
          value={year}
          label="Year"
          onChange={(event) => setYear(event.target.value)}
          autoComplete="off"
        />
        <h6 style={{ color: "gray" }}>required *</h6>
        <div style={{ margin: "5px" }} />

        <Button
          variant="primary"
          type="button"
          onClick={(e) =>
            onSubmit(
              e,
              {
                Books: {
                  id: initialValues?.id,
                  title: title,
                  authorId: authorId,
                  isbn: isbn,
                  year: year,
                },
              },
              handleEmptyFields(),
            )
          }
        >
          <strong>{submitLabel}</strong>
        </Button>
      </Box>
    </div>
  );
}
