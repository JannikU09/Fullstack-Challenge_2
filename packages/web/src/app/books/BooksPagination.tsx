"use client";

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";
import { useAtom } from "jotai";
import { pageAtom, pageSizeAtom, totalPagesAtom } from "../../componentes/utils/atoms";
import "./page.css";

export const BooksPagination = (search, totalPages) => {
    const [page, setPage] = useAtom(pageAtom);
    const [pageSize, setPageSize] = useAtom(pageSizeAtom);
    // const [totalPages, setTotalPages] = useAtom(totalPagesAtom);

    let pages = [];
    const pageSizeValue = [5, 20, 50, 75, 100];

    function handlePageUpdate() {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    function handlePageNumber(event: SelectChangeEvent) {
        setPage(event.target.value as string);
    };

    function handlePageSize(event: SelectChangeEvent) {
        setPageSize(event.target.value as string);
        setPage("1");
    };

    return (
        <div className="pageSizeSelect">
            <FormControl fullWidth disabled={totalPages <= 1}>
                <InputLabel>Page</InputLabel>
                <Select value={page} label="Page" onChange={handlePageNumber}>
                    {pages.map((pageValue) => (
                        <MenuItem key={pageValue} value={pageValue}>
                            {pageValue}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div style={{ margin: "5px" }} />
            <FormControl fullWidth>
                <InputLabel>Page Size</InputLabel>
                <Select value={pageSize} label="Page Size" onChange={handlePageSize}>
                    {pageSizeValue.map((size) => (
                        <MenuItem key={size} value={size}>
                            {size}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};
