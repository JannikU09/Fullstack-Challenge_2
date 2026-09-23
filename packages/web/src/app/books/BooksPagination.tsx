"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAtomValue } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { pageSizeValueAtom } from "../../componentes/utils/atoms";
import "./page.css";

type BooksPaginationProps = {
    totalPages: number;
};

export const BooksPagination = ({ totalPages }: BooksPaginationProps) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const pageSizeValue = useAtomValue(pageSizeValueAtom);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    let pages = [];
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    function handlePageNumber(pageNumber: number) {
        const params = new URLSearchParams(searchParams);
        if (pageNumber) {
            params.set("page", pageNumber)
            setPage(pageNumber);
        } else {
            params.set("page", 1);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    function handlePageSize(pageSizeNow: number) {
        const params = new URLSearchParams(searchParams);
        if (pageSizeNow) {
            params.set("pageSize", pageSizeNow);
            params.set("page", 1)
            setPageSize(pageSizeNow);
            setPage(1);
        } else {
            params.set("pageSize", 20);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="pageSizeSelect">
            <FormControl fullWidth disabled={totalPages <= 1}>
                <InputLabel>Page</InputLabel>
                <Select value={page} label="Page" onChange={(event) => handlePageNumber(event.target.value)}>
                    {pages.map((currentPage) => (
                        <MenuItem key={currentPage} value={currentPage}>
                            {currentPage}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div style={{ margin: "5px" }} />
            <FormControl fullWidth>
                <InputLabel>Page Size</InputLabel>
                <Select value={pageSize} label="Page Size" onChange={(event) => handlePageSize(event.target.value)}>
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
