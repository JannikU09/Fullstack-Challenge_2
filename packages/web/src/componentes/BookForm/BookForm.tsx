"use client";

import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { Button } from "@/componentes/ui/Button";
import type { BookWithAuthor } from "../../app/books/page";

interface BookInitialValues {
  id?: number;
  title?: string;
  authorId?: number;
  isbn?: string;
  year?: number;
}

interface BookFormProps {
  initialValues?: BookInitialValues;
  authors: {
    id: number;
    name: string;
  }[];
  onSubmit?: (event, data: BookWithAuthor) => Promise<void> | void;
  submitLabel?: string;
}

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
        />
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
              setTitle(""),
              setAuthorId(""),
              setIsbn(""),
              setYear(""),
            )
          }
        >
          <strong>{submitLabel}</strong>
        </Button>
      </Box>
    </div>
  );
}
