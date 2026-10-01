import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import "../../app/books/page.css";

type PaginationProps = {
    count?: number | undefined;
    page?: number | undefined;
};

export const Pagination = ({ count, page }: PaginationProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);

    const [page1, setPage1] = useState<number>(page ?? 1);

    useEffect(() => {
        setPage1(Number(params.get("page")) ?? 1);
    }, [params.get]);

    const pageNumbers: number[] = [];
    if (count !== undefined) {
        for (let i = 1; i <= count; i++) {
            pageNumbers.push(i);
        };
    };

    const pagesTest: (number | "...")[] = [];
    if (count !== undefined) {
        for (let i = 1; i <= count; i++) {
            if (
                i === 1
                || i === count
                || i === page1
                || i === page1 + 1
                || i === page1 - 1
                || (page1 <= 4 && i <= 5)
                || (page1 >= count - 3 && i >= count - 4)
            ) {
                pagesTest.push(i);
            } else if (pagesTest[pagesTest.length - 1] !== "...") {
                pagesTest.push("...");
            };
        };
    };

    function goToPage(newPage: number) {
        if (count === undefined) return;
        const num = newPage;
        params.set("page", num.toString());
        replace(`${pathname}?${params.toString()}`);
        setPage1(num);
    };

    function increasePage() {
        goToPage(page1 + 1);
    };
    function decreasePage() {
        goToPage(page1 - 1);
    };
    function goToFirstPage() {
        goToPage(1);
    };
    function goToLastPage() {
        if (count === undefined) return;
        goToPage(count);
    };

    return (
        <div>
            <div className="paginationPage">
                <Button
                    type="button"
                    variant="pagination"
                    onClick={() => goToFirstPage()}
                    disabled={page1 <= 1}
                >
                    <FirstPage />
                </Button>
                <Button
                    type="button"
                    variant="pagination"
                    onClick={() => decreasePage()}
                    disabled={page1 <= 1}
                >
                    <ChevronLeft />
                </Button>

                {pagesTest.map((pageNumber, idx) => {
                    if (page1 === pageNumber) {
                        return (
                            <Button
                                key={idx}
                                type="button"
                                variant="paginationCurrent"
                            >
                                {pageNumber}
                            </Button>
                        )
                    }
                    return (
                        <Button
                            disabled={pageNumber === "..."}
                            key={idx}
                            type="button"
                            variant="pagination"
                            onClick={() => goToPage(Number(pageNumber))}
                        >
                            {pageNumber}
                        </Button>
                    )
                })}

                <Button
                    type="button"
                    variant="pagination"
                    onClick={() => increasePage()}
                    disabled={count === undefined || page1 >= count}
                >
                    <ChevronRight />
                </Button>
                <Button
                    type="button"
                    variant="pagination"
                    onClick={() => goToLastPage()}
                    disabled={count === undefined || page1 >= count}
                >
                    <LastPage />
                </Button>
            </div>
        </div>
    );
};
