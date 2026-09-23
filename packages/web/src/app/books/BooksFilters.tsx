"use client";

import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../../componentes/ui/Button";
import type { Author } from "../interfaces/Author";

type BooksFiltersProps = {
    authors: Author[];
};

export const BooksFilters = ({ authors }: BooksFiltersProps) => {
    const [q, setQ] = useState("");
    const [authorId, setAuthorId] = useState("");

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
            setQ(term)
        } else {
            params.delete("q");
            setQ("");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function handleAuhorIdChange(id: number) {
        const params = new URLSearchParams(searchParams);
        if (id) {
            params.set("authorId", id);
            setAuthorId(id);
        } else {
            params.delete("authorId");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function reset() {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        params.delete("authorId");
        setAuthorId("");
        setQ("")
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="search">
            <TextField
                style={{
                    width: "100%",
                }}
                label={"Search"}
                onChange={(event) => {
                    handleSearch(event.target.value);
                }}
                autoComplete="off"
                value={q}
            />
            <div style={{ margin: "auto 5px" }} />
            <FormControl fullWidth>
                <InputLabel>Author</InputLabel>
                <Select
                    onChange={(event) => handleAuhorIdChange(event.target.value)}
                    label="Author"
                    value={authorId}
                >
                    {authors.map((author) => (
                        <MenuItem key={author.id} value={author.id}>
                            {author.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className="searchButton">
                <Button variant="primary" type="button" onClick={() => reset()}>
                    <strong>Reset</strong>
                </Button>
            </div>
        </div>
    );
};
