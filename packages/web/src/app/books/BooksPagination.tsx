"use client";

import { FormControl, InputLabel, MenuItem, Pagination, Select } from "@mui/material";
import { useAtomValue } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
    const params = new URLSearchParams(searchParams);

    useEffect(() => {
        setPage(Number(params.get("page")));
        setPageSize(Number(params.get("pageSize")))
    }, [params.get]);


    let pages = [];
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);


    function handlePageNumber(pageNumber: number) {
        if (pageNumber) {
            params.set("page", pageNumber);
            setPage(pageNumber);
        } else {
            params.set("page", 1);
            setPage(1);
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function handlePageSize(pageSizeNow: number) {
        if (pageSizeNow) {
            params.set("page", 1);
            params.set("pageSize", pageSizeNow);
            setPageSize(pageSizeNow);
            setPage(1);
        } else {
            params.set("pageSize", 20);
            setPageSize(20);
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div>
            <div className="choosePage">
                <Pagination
                    count={pages.length}
                    page={page}
                    onChange={(_event, page) => handlePageNumber(page)}
                    shape="rounded"
                    sx={{
                        "& .MuiPaginationItem-root": {
                            width: "10px",
                            height: "24px",
                        },
                    }}
                    showFirstButton
                    showLastButton
                />
            </div>
            <div className="pageSizeSelect">
                <FormControl sx={{ width: "100px" }}>
                    <InputLabel>Page Size</InputLabel>
                    <Select
                        value={pageSize}
                        label="Page Size"
                        onChange={(event) => handlePageSize(event.target.value)}
                    >
                        {pageSizeValue.map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div style={{ margin: "5px" }} />
            </div>
        </div>
    );
};
