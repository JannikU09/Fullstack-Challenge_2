import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { atom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BooksPagination } from "./BooksPagination";

const replaceMock = vi.fn();

let currentURL = "/books";

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: () => new URLSearchParams(currentURL.split("?")[1] ?? ""),
}));

vi.mock("../../componentes/utils/atoms", () => ({
    pageSizeValueAtom: atom(["", 5, 20, 50, 75, 100]),
}));

beforeEach(() => {
    replaceMock.mockClear();
    vi.mocked(useRouter).mockReturnValue({ replace: replaceMock, push: vi.fn() } as any);
    vi.mocked(usePathname).mockReturnValue("/books");
});

function renderPagination(totalPages: number, page: number) {
    currentURL = `/books?page=${page}`;
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

    it("setzt pageSize auf 20, wenn ein leerer Wert übergeben wird.", async () => {
        const user = userEvent.setup();
        renderPagination(15, 1);

        const combobox = screen.getByRole("combobox", { name: /pageSizeSelect/i });
        await user.click(combobox);
        const option = screen.getByRole("option", { name: "" });
        await user.click(option);

        expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("pageSize=20"));
    });

    it("prüft die aktuelle Page über den className, nachdem die Komponente gererendert wurde.", async () => {
        currentURL = "/books?page=4"
        const { rerender } = render(<BooksPagination totalPages={20} />)

        expect(screen.getByRole("button", { name: "1" })).not.toHaveClass("button paginationCurrent");
        expect(screen.getByRole("button", { name: "4" })).toHaveClass("button paginationCurrent");
        console.log("Page 4", screen.getByRole("button", { name: "4" }));

        currentURL = "/books?page=1";
        rerender(<BooksPagination totalPages={20} />);

        expect(screen.getByRole("button", { name: "1" })).toHaveClass("button paginationCurrent");
        expect(screen.getByRole("button", { name: "4" })).not.toHaveClass("button paginationCurrent");

        console.log("Pages", screen.getByRole("button", { name: "1" }));
    });
});
