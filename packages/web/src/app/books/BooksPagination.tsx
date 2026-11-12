"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAtomValue } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "../../componentes/ui/Pagination";
import { pageSizeValueAtom } from "../../componentes/utils/atoms";
import "./page.css";

type BooksPaginationProps = {
    totalPages: number;
};

export const BooksPagination = ({ totalPages }: BooksPaginationProps) => {
    const pageSizeValue = useAtomValue(pageSizeValueAtom);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);

    const page = params.get("page") ?? "1";
    const pageSize = params.get("pageSize") ?? "20";

    let pages = [];
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    function handlePageSize(pageSizeNow: string) {
        if (pageSizeNow) {
            params.set("page", "1");
            params.set("pageSize", pageSizeNow);
        } else {
            params.set("page", "1");
            params.set("pageSize", "20");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div>
            <div className="choosePage" data-testid="booksPagination">
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
                        aria-label="PageSizeSelect"
                    >
                        {pageSizeValue.map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div >
    );
};
