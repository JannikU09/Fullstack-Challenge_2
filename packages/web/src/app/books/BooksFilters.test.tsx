// import { authors, books, db } from "@repo/database";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Author } from "../interfaces/Author";
import { BooksFilters } from "./BooksFilters";

// vi.mock("@repo/database", () => ({
//     authors: {
//         id: "authors.id",
//         name: "authors.name",
//     },
// }));

const authors: Author[] = [
    { id: 1, name: "Autor A" },
    { id: 2, name: "Autor B" },
];

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

function renderFilter(initialParams: string = "") {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(initialParams) as any);
    return render(
        <BooksFilters authors={authors} total={7} totalWithoutFilter={30} />
    );
};

describe("BooksFilters", () => {
    it("Suche mit initiallem Autor und Textsuche", async () => {
        renderFilter("q=harry&authorId=2");

        const textbox = screen.getByRole("textbox", { name: /Search/i });
        const combobox = screen.getByRole("combobox", { name: /author/i });

        expect(textbox).toHaveValue("harry");
        expect(combobox).toHaveTextContent("Autor B");
    });

    it("Suche mit Text q.", async () => {
        const user = userEvent.setup();
        renderFilter();

        const textbox = screen.getByRole("textbox", { name: /search/i });
        await user.type(textbox, "harry");

        expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("q=harry"));
    });

    it("Suche mit Autor authorId.", async () => {
        const user = userEvent.setup();
        renderFilter();

        const combobox = screen.getByRole("combobox", { name: /author/i });
        await user.click(combobox);
        const option = screen.getByRole("option", { name: "Autor B" });
        await user.click(option);

        expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("authorId=2"));
    });

    it("Reset der Suche.", async () => {
        const user = userEvent.setup();
        renderFilter("q=harry&authorId=1");

        await user.click(screen.getByRole("button", { name: /reset/i }));

        expect(replaceMock).toHaveBeenCalledWith("/books?page=1");
    });

    it("entfernt q aus der URL und der Textbox.", async () => {
        const user = userEvent.setup();
        renderFilter("q=harry");

        const textbox = screen.getByRole("textbox", { name: /search/i });
        expect(textbox).toHaveValue("harry");

        await user.clear(textbox);

        expect(textbox).toHaveValue("");
        expect(replaceMock).toHaveBeenCalledWith("/books?");
    });
});
