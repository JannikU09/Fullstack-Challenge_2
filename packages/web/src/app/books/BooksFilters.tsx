"use client";

import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../componentes/ui/Button";
import { authorIdAtom, queryAtom } from "../../componentes/utils/atoms";
import { useDebounce } from "../../lib/useDebounce";
import type { Author } from "../interfaces/Author";
import type { BookWithAuthor } from "../interfaces/BookWithAuthor";
import type { BookSearchParams } from "../interfaces/searchParams";
import { getAuthors, getBooks } from "./actions";

type BooksFiltersProps = {
    authors: Author[];
    search: BookSearchParams;
    total: number;
    books: BookWithAuthor[];
};

export const BooksFilters = ({ authors, search, total, books }: BooksFiltersProps) => {
    const [query, setQuery] = useAtom(queryAtom);
    const [authorId, setAuthorId] = useAtom(authorIdAtom);
    const [search2, setSearch2] = useState(search.q);
    const [book, setBook] = useState(books);

    function handleSearch() {
        toast.info(`Anzahl der Bücher: ${total}`);
    }

    return (
        <div className="search">
            <TextField
                style={{
                    width: "100%",
                }}
                value={search2}
                label={"Search"}
                onChange={async (event) => {
                    setSearch2(event.target.value);
                    const books = await getBooks({ ...search, q: event.target.value });
                    setBook(books);
                }}
                autoComplete="off"
            />
            <div style={{ margin: "auto 5px" }} />
            <FormControl fullWidth>
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

            <div className="searchButton">
                <Button variant="primary" type="button" onClick={() => handleSearch()}>
                    <strong>Search</strong>
                </Button>
                <Button variant="primary" type="button">
                    <strong>Reset</strong>
                </Button>
            </div>
        </div>
    );
};
