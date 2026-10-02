"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAtomValue } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pagination } from "../../componentes/ui/Pagination";
import { pageSizeValueAtom } from "../../componentes/utils/atoms";
import "./page.css";

type BooksPaginationProps = {
    totalPages: number;
};

export const BooksPagination = ({ totalPages }: BooksPaginationProps) => {
    const [page, setPage] = useState("1");
    const [pageSize, setPageSize] = useState("20");
    const pageSizeValue = useAtomValue(pageSizeValueAtom);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);

    useEffect(() => {
        setPage(params.get("page") ?? "1");
        setPageSize(params.get("pageSize") ?? "20");
    }, [params.get]);

    let pages = [];
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    function handlePageSize(pageSizeNow: string) {
        if (pageSizeNow) {
            params.set("page", "1");
            params.set("pageSize", pageSizeNow);
            setPageSize(pageSizeNow);
            setPage("1");
        } else {
            params.set("pageSize", "20");
            setPageSize("20");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div>
            <div className="choosePage">
                <Pagination page={Number(page)} totalPages={pages.length} itemsNextTo={1} itemsAtStartEnd={4} />
            </div>
            <div style={{ margin: "15px" }} />
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
            </div>
        </div>
    );
};
