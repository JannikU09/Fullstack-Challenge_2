import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BooksPagination } from "./BooksPagination";

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

function renderPagination(totalPages: number, page: number) {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(`page=${page}}`) as any);
    return render(<BooksPagination totalPages={totalPages} />);
}

describe("BooksPagination", () => {
    it("prüft ob die BooksPaginaion rendert.", async () => {
        renderPagination(15, 1);
        const paginationTest = screen.getByTestId("booksPagination");
        expect(paginationTest).toBeInTheDocument();
    });

    it("prüft handlePageSize()", async () => {
        const user = userEvent.setup();
        renderPagination(15, 1);

        const combobox = screen.getByRole("combobox", { name: /pageSizeSelect/i });
        await user.click(combobox);
        const option = screen.getByRole("option", { name: "5" });
        await user.click(option);

        expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("pageSize=5"));
    });
});
