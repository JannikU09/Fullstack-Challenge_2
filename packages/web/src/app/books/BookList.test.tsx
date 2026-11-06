import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { usePathname, useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authorTestList, bookTestList } from "../../lib/bookTestList";
import { createBookAction, deleteBookAction, updateBookAction } from "./actions";
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

vi.mock("./actions", () => ({
    deleteBookAction: vi.fn(),
    createBookAction: vi.fn(),
    updateBookAction: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
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

    it("schließt das Formular wieder, wenn Edit zweimal geklickt wird", async () => {
        const user = userEvent.setup();
        renderBookList();
        await user.click(screen.getByRole("button", { name: /accordion_2/i }));
        const editButton = screen.getByRole("button", { name: /edit/i });
        await user.click(editButton);
        const updateButton = screen.getByRole("button", { name: /update/i });
        expect(updateButton).toBeVisible();

        await user.click(editButton);
        expect(updateButton).not.toBeVisible();
    });

    it("drückt den Delete-Button", async () => {
        const user = userEvent.setup();
        renderBookList();

        const accordion = screen.getByRole("button", { name: /accordion_2/i });
        await user.click(accordion);

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        expect(deleteButton).toBeInTheDocument();
        await user.click(deleteButton);
        expect(deleteBookAction).toHaveBeenCalledOnce();
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
        expect(updateBookAction).toHaveBeenCalledOnce();
    });

    it("drückt den Add-Button", async () => {
        const user = userEvent.setup();
        renderBookList();

        const addButton = screen.getByRole("button", { name: /add/i });
        await user.click(addButton);
        expect(addButton).toBeInTheDocument();
        expect(createBookAction).toHaveBeenCalledOnce();
    });

    it("ruft deleteBookAction nicht auf, falls die Book.id undefined ist.", async () => {
        const user = userEvent.setup();
        const bookWithoutId = {
            Books: { id: undefined, title: "Test", authorId: 1, isbn: "1234567890123", year: 2026 },
            Author: { id: 1, name: "Autor A" },
        };
        renderBookList(1, [bookWithoutId]);

        const accordion = screen.getByRole("button", { name: /accordion_undefined/i });
        await user.click(accordion);
        const deleteButton = screen.getByRole("button", { name: /delete/i });
        await user.click(deleteButton);

        expect(deleteBookAction).not.toHaveBeenCalled();
    });

    it("ruft updateBookAction nicht auf, falls die Book.id undefined ist.", async () => {
        const user = userEvent.setup();
        const bookWithoutId = {
            Books: { id: undefined, title: "Test", authorId: 1, isbn: "1234567890123", year: 2026 },
            Author: { id: 1, name: "Autor A" },
        };
        renderBookList(1, [bookWithoutId]);

        const accordion = screen.getByRole("button", { name: /accordion_undefined/i });
        await user.click(accordion);
        const editButton = screen.getByRole("button", { name: /edit/i });
        await user.click(editButton);
        const updateButton = screen.getByRole("button", { name: /update/i });
        await user.click(updateButton);

        expect(updateBookAction).not.toHaveBeenCalled();
    });

    it("öffnet den Editor für ein Buch ohne year", async () => {
        const user = userEvent.setup();
        const bookWithoutYear = {
            Books: { id: 5, title: "Ohne Jahr", authorId: 1, isbn: "5135614352614", year: undefined },
            Author: { id: 1, name: "Autor A" },
        };
        renderBookList(1, [bookWithoutYear]);

        const accordionButton = screen.getByRole("button", { name: /accordion_5/i });
        await user.click(accordionButton);

        const bookContainer = accordionButton.closest(".book") as HTMLElement;
        const editButton = within(bookContainer).getByRole("button", { name: /edit/i });
        await user.click(editButton);

        const yearTextbox = within(bookContainer).getByRole("textbox", { name: /year/i });
        expect(yearTextbox).toHaveValue("");
    });
});
