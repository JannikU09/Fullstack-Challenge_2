import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { usePathname, useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authorTestList, bookTestList } from "../../lib/bookTestList";
import { BookList } from "./BookList";

const authorList = authorTestList;
const bookList = bookTestList;

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

beforeEach(() => {
    replaceMock.mockClear();
    vi.mocked(useRouter).mockReturnValue({ replace: replaceMock, push: vi.fn() } as any);
    vi.mocked(usePathname).mockReturnValue("/books");
});

function renderBookList(totalBooks?: number, books = bookList) {
    return render(<BookList authors={authorList} books={books} total={totalBooks ?? 4} />);
}

describe("BookList", () => {
    it("zeigt keine Bücher an, wenn books.lenght === 0", async () => {
        renderBookList(0, []);

        expect(screen.getByText("Keine Bücher gefunden.")).toBeInTheDocument();
    });

    it("öffnet den Editor", async () => {
        const user = userEvent.setup();
        renderBookList();

        const accordion = screen.getByRole("button", { name: /accordion_2/i });
        await user.click(accordion);
        expect(accordion).toHaveAttribute("aria-expanded", "true");

        const editButton = screen.getByRole("button", { name: /edit/i });
        await user.click(editButton);
        expect(editButton).toBeInTheDocument();
    });

    it("drückt den Delete-Button", async () => {
        const user = userEvent.setup();
        renderBookList();

        const accordion = screen.getByRole("button", { name: /accordion_2/i });
        await user.click(accordion);

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        expect(deleteButton).toBeInTheDocument();
        await user.click(deleteButton);
    });

    it("drückt den Update-Button", async () => {
        const user = userEvent.setup();
        renderBookList();

        const accordion = screen.getByRole("button", { name: /accordion_2/i });
        await user.click(accordion);

        const editButton = screen.getByRole("button", { name: /edit/i });
        await user.click(editButton);

        const updateButton = screen.getByRole("button", { name: /update/i });
        await user.click(updateButton);
        expect(updateButton).toBeInTheDocument();
    });

    it("drückt den Add-Button", async () => {
        const user = userEvent.setup();
        renderBookList();

        const addButton = screen.getByRole("button", { name: /add/i });
        await user.click(addButton);
        expect(addButton).toBeInTheDocument();
    });
});
