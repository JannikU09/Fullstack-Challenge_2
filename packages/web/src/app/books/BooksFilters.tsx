"use client";

import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../componentes/ui/Button";
import type { Author } from "../interfaces/Author";
import "./page.css";

type BooksFiltersProps = {
    authors: Author[];
    total: number;
    totalWithoutFilter: number;
};

export const BooksFilters = ({ authors, total, totalWithoutFilter }: BooksFiltersProps) => {
    const [q, setQ] = useState("");
    const [authorId, setAuthorId] = useState("");

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);

    useEffect(() => {
        setQ(params.get("q") ?? "");
        setAuthorId(params.get("authorId") ?? "");
    }, [params.get]);

    function handleSearch(term: string) {
        if (term) {
            params.set("q", term);
            params.set("page", 1);
            setQ(term);
        } else {
            params.delete("q");
            setQ("");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function handleAuhorIdChange(id: number) {
        if (id) {
            params.set("authorId", id);
            params.set("page", 1);
            setAuthorId(id);
        } else {
            params.delete("authorId");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function resetSearch() {
        params.delete("q");
        params.delete("authorId");
        params.set("page", 1);
        setAuthorId("");
        setQ("");
        replace(`${pathname}?${params.toString()}`);
        console.log(total);
        toast.info(`Es werden wieder alle ${totalWithoutFilter} Bücher angezeigt.`);
    }

    return (
        <div className="search">
            <TextField
                style={{
                    width: "100%",
                }}
                label={"Search"}
                onChange={(event) => handleSearch(event.target.value)}
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
                <Button variant="primary" type="button" onClick={() => resetSearch()}>
                    <strong>Reset</strong>
                </Button>
            </div>
        </div>
    );
};
