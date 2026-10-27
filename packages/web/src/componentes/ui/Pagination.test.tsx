import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
}));

beforeEach(() => {
    replaceMock.mockClear();
    vi.mocked(useRouter).mockReturnValue({ replace: replaceMock, push: vi.fn() } as any);
    vi.mocked(usePathname).mockReturnValue("/books");
});

function renderPagination(page: number, totalPages: number | undefined) {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(`page=${page}`) as any);
    return render(
        <Pagination totalPages={totalPages} page={page} itemsAtStartEnd={4} itemsNextTo={1} />
    )
};

describe("Pagination", () => {
    it("zeigt keine Seitenzahl an, wenn totalPages undefined ist.", async () => {
        renderPagination(1, undefined)
        expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("Deaktiviert FirstPage- bzw. ChevronLeft-Button, wenn die aktuelle Page <= 1 ist.", async () => {
        renderPagination(1, 20);
        expect(screen.getByRole("button", { name: /FirstPage/i })).toBeDisabled();
        expect(screen.getByRole("button", { name: /ChevronLeft/i })).toBeDisabled();
    });

    it("increasePage()", async () => {
        const user = userEvent.setup();
        renderPagination(1, 20)

        const chevronRight = screen.getByRole("button", { name: /ChevronRight/i });
        await user.click(chevronRight);

        expect(replaceMock).toHaveBeenCalledWith("/books?page=2");
    });

    it("decreasePage()", async () => {
        const user = userEvent.setup();
        renderPagination(3, 20);

        const chevronLeft = screen.getByRole("button", { name: /ChevronLeft/i });
        await user.click(chevronLeft);

        expect(replaceMock).toHaveBeenCalledWith("/books?page=2");
    });

    it("goToFirstPage", async () => {
        const user = userEvent.setup();
        renderPagination(10, 20);

        const firstPage = screen.getByRole("button", { name: /FirstPage/i });
        await user.click(firstPage);

        expect(replaceMock).toHaveBeenCalledWith("/books?page=1");
    });

    it("goToLastPage", async () => {
        const user = userEvent.setup();
        renderPagination(5, 20);

        const lastPage = screen.getByRole("button", { name: /LastPage/i });
        await user.click(lastPage);

        expect(replaceMock).toHaveBeenCalledWith("/books?page=20");
    });
});
