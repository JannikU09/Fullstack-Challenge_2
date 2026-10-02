import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import "../../app/books/page.css";

type PaginationProps = {
    totalPages?: number | undefined;
    page?: number | undefined;
    itemsNextTo: number;
    itemsAtStartEnd: number;
};

export const Pagination = ({ totalPages, page, itemsNextTo, itemsAtStartEnd }: PaginationProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);

    const [currentPage, setCurrentPage] = useState<number>(page ?? 1);

    useEffect(() => {
        setCurrentPage(Number(params.get("page")) ?? 1);
    }, [params.get]);

    const pageNumbers: number[] = [];
    if (totalPages !== undefined) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        };
    };

    const paginationPages: (number | "dots-left" | "dots-right")[] = [];
    if (totalPages !== undefined) {
        const isNearStart = currentPage <= itemsAtStartEnd;
        const isNearEnd = currentPage >= totalPages - itemsAtStartEnd + 1;

        const showLeftDots = !isNearStart && currentPage - 1 > itemsNextTo;
        const showRightDots = !isNearEnd && totalPages - currentPage > itemsNextTo;

        paginationPages.push(1);

        if (showLeftDots) {
            paginationPages.push("dots-left");
        };

        let start: number;
        let end: number;

        if (isNearStart) {
            start = 2;
            end = Math.min(totalPages - 1, itemsAtStartEnd + 1);
        } else if (isNearEnd) {
            start = Math.max(2, totalPages - itemsAtStartEnd);
            end = totalPages - 1;
        } else {
            start = showLeftDots ? Math.max(2, currentPage - itemsNextTo) : 2
            end = showRightDots ? Math.min(totalPages - 1, currentPage + itemsNextTo) : totalPages - 1;
        };

        for (let i = start; i <= end; i++) {
            paginationPages.push(i);
        };

        if (showRightDots) {
            paginationPages.push("dots-right");
        };

        if (totalPages > 1) {
            paginationPages.push(totalPages);
        };
    };

    function goToPage(newPage: number) {
        if (totalPages === undefined) return;
        const num = newPage;
        params.set("page", num.toString());
        replace(`${pathname}?${params.toString()}`);
        setCurrentPage(num);
    };

    function increasePage() {
        goToPage(currentPage + 1);
    };
    function decreasePage() {
        goToPage(currentPage - 1);
    };
    function goToFirstPage() {
        goToPage(1);
    };
    function goToLastPage() {
        if (totalPages === undefined) return;
        goToPage(totalPages);
    };

    return (
        <div>
            <div className="paginationPage">
                <Button
                    type="button"
                    variant={currentPage <= 1 ? "paginationDisabled" : "pagination"}
                    onClick={() => goToFirstPage()}
                    disabled={currentPage <= 1}
                >
                    <FirstPage />
                </Button>
                <Button
                    type="button"
                    variant={currentPage <= 1 ? "paginationDisabled" : "pagination"}
                    onClick={() => decreasePage()}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft />
                </Button>

                {paginationPages.map((pageNumber) => {
                    const isDot = typeof pageNumber !== "number";
                    const label = isDot ? "..." : pageNumber;
                    const key = isDot ? pageNumber : `page-${pageNumber}`;


                    if (currentPage === pageNumber) {
                        return (
                            <Button
                                key={key}
                                type="button"
                                variant="paginationCurrent"
                            >
                                {label}
                            </Button>
                        )
                    }
                    return (
                        <Button
                            key={key}
                            type="button"
                            variant="pagination"
                            onClick={() => {
                                if (pageNumber === "dots-left") {
                                    goToPage(currentPage - itemsAtStartEnd);
                                } else if (pageNumber === "dots-right") {
                                    goToPage(currentPage + itemsAtStartEnd);
                                } else {
                                    goToPage(Number(pageNumber));
                                }
                            }}
                        >
                            {label}
                        </Button>
                    )
                })}

                <Button
                    type="button"
                    variant={totalPages === undefined || currentPage >= totalPages ? "paginationDisabled" : "pagination"}
                    onClick={() => increasePage()}
                    disabled={totalPages === undefined || currentPage >= totalPages}
                >
                    <ChevronRight />
                </Button>
                <Button
                    type="button"
                    variant={totalPages === undefined || currentPage >= totalPages ? "paginationDisabled" : "pagination"}
                    onClick={() => goToLastPage()}
                    disabled={totalPages === undefined || currentPage >= totalPages}
                >
                    <LastPage />
                </Button>
            </div>
        </div>
    );
};
