"use client";

import { TextField } from "@mui/material";
import { useAtom } from "jotai";
import { queryAtom } from "../utils/atoms";

export const SearchBar = () => {
    const [query, setQuery] = useAtom(queryAtom);

    return (
        <TextField
            style={{
                width: "100%",
            }}
            value={query}
            label={"Search"}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
        />
    );
};
