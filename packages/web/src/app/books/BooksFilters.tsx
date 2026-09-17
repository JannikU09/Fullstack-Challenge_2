"use client";

import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAtom } from "jotai";
import { Button } from "../../componentes/ui/Button";
import { authorIdAtom, queryAtom } from "../../componentes/utils/atoms";
import type { Author } from "../interfaces/Author";
import type { BookSearchParams } from "../interfaces/searchParams";
import { getAuthors, getBooks } from "./actions";

type BooksFiltersProps = {
    authors: Author[],
    search: BookSearchParams,
}

export const BooksFilters = ({ authors, search }: BooksFiltersProps) => {
    const [query, setQuery] = useAtom(queryAtom);
    const [authorId, setAuthorId] = useAtom(authorIdAtom);

    return (
        <div className="search">
            <TextField
                style={{
                    width: "100%",
                }}
                value={query}
                label={"Search"}
                onChange={(event) => setQuery(event.target.value)}
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
                <Button variant="primary" type="button" onClick={() => getBooks}>
                    <strong>Search</strong>
                </Button>
                <Button variant="primary" type="button" onClick>
                    <strong>Reset</strong>
                </Button>
            </div>
        </div>
    );
};
