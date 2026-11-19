import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "../../componentes/ui/sonner";
import { dateAtom, timeAtom } from "../../componentes/utils/atoms";
import { authorTestList, bookTestList } from "../../lib/bookTestList";
import { createBookAction, deleteBookAction, updateBookAction } from "./actions";
import { BookList } from "./BookList";

const authorList = authorTestList;
const bookList = bookTestList;

const store = createStore();
const date = store.get(dateAtom);
const time = store.get(timeAtom);

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
    vi.mocked(createBookAction).mockResolvedValue({
        success: true,
        message: "Buch wurde hinzugefügt.",
        data: {
            Books: { id: 23, title: "Testi", authorId: 1, isbn: "5415631468544", year: 2026 },
            Author: authorList[0],
        },
    });
    vi.mocked(updateBookAction).mockResolvedValue({
        success: true,
        message: "Buch wurde geändert.",
    });
    vi.mocked(deleteBookAction).mockResolvedValue({
        success: true,
        message: "Erfolgreich gelöscht.",
    });
    replaceMock.mockClear();
    vi.mocked(useRouter).mockReturnValue({ replace: replaceMock, push: vi.fn() } as any);
    vi.mocked(usePathname).mockReturnValue("/books");
});

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

afterEach(() => {
    vi.restoreAllMocks();
    toast.dismiss();
});

function renderBookList(totalBooks?: number, books = bookList) {
    return render(
        <div>
            <Toaster />
            <BookList authors={authorList} books={books} total={totalBooks ?? 4} />
        </div>,
    );
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

    it("zeigt den Warning-Toast, wenn 0 Bücher geladen werden konnten.", async () => {
        const spy_loading0Books = vi.spyOn(toast, "warning");
        renderBookList(0, []);

        expect(spy_loading0Books).toHaveBeenCalledWith("0 Bücher geladen.");
    });

    it("zeigt den Erfolgs-Toast mit der richtigen Formatierung, wenn nur ein Buch geladen wird", async () => {
        const spy_loading1Book = vi.spyOn(toast, "success");
        renderBookList(1, [bookList[0]]);

        expect(spy_loading1Book).toHaveBeenCalledOnce();
        expect(spy_loading1Book).toHaveBeenCalledWith("1 Buch geladen.");
    });

    it("zeigt den Erfolgs-Toast mit der richtigen Formatierung, wenn mehrere Bücher geladen werden.", async () => {
        const spy_loading4Books = vi.spyOn(toast, "success");
        renderBookList();

        expect(spy_loading4Books).toHaveBeenCalledWith(`${bookList.length} Bücher geladen.`);
    });

    it("zeigt den Erfolgs-Toast, wenn ein Buch erfolgreich hinzugefügt wurde.", async () => {
        const user = userEvent.setup();
        const spy_create = vi.spyOn(toast, "success");
        renderBookList();

        const titleTextbox = screen.getByRole("textbox", { name: /title/i });
        await user.clear(titleTextbox);
        await user.type(titleTextbox, "Harry");

        const authorSelect = screen.getByRole("combobox", { name: /author/i });
        await user.click(authorSelect);
        await user.click(screen.getByRole("option", { name: "Autor A" }));

        const isbnTextbox = screen.getByRole("textbox", { name: /isbn/i });
        await user.clear(isbnTextbox);
        await user.type(isbnTextbox, "1234567890123");

        const yearTextbox = screen.getByRole("textbox", { name: /year/i });
        await user.clear(yearTextbox);
        await user.type(yearTextbox, "2025");

        await user.click(screen.getByRole("button", { name: /add/i }));

        console.log("spy_create", spy_create.mock.lastCall);

        // expect(spy_create).toHaveBeenCalledTimes(1);
        expect(await screen.findByText("Buch wurde hinzugefügt.")).toBeInTheDocument();
        expect(createBookAction).toHaveBeenCalledOnce();
        expect(spy_create).toHaveBeenLastCalledWith("Buch wurde hinzugefügt.", {
            description: `${date}, ${time} Uhr`,
        });
    });

    it("zeigt den Error-Toast, wenn createBookAction fehlschlägt.", async () => {
        const user = userEvent.setup();
        vi.mocked(createBookAction).mockResolvedValueOnce({
            success: false,
            error: "Validation Error",
        });
        const spy_createError = vi.spyOn(toast, "error");
        renderBookList();

        const titleTextbox = screen.getByRole("textbox", { name: /title/i });
        await user.clear(titleTextbox);
        await user.type(titleTextbox, "Harry");

        const authorSelect = screen.getByRole("combobox", { name: /author/i });
        await user.click(authorSelect);
        await user.click(screen.getByRole("option", { name: "Autor A" }));

        const isbnTextbox = screen.getByRole("textbox", { name: /isbn/i });
        await user.clear(isbnTextbox);
        await user.type(isbnTextbox, "1290123");

        const yearTextbox = screen.getByRole("textbox", { name: /year/i });
        await user.clear(yearTextbox);
        await user.type(yearTextbox, "2025");

        await user.click(screen.getByRole("button", { name: /add/i }));

        console.log("spy_createError", spy_createError.mock.calls);

        expect(await screen.findByText("Validation Error")).toBeInTheDocument();
        expect(spy_createError).toHaveBeenLastCalledWith("Validation Error", {
            description: `${date}, ${time} Uhr`,
        });
    });

    it("zeigt den Erfolgs-Toast, wenn ein Buch erfolgreich geändert wurde.", async () => {
        const user = userEvent.setup();
        const spy_update = vi.spyOn(toast, "success");
        renderBookList();

        const accordion_1 = screen.getByRole("button", { name: /accordion_1/i });
        await user.click(accordion_1);

        await user.click(screen.getByRole("button", { name: /edit/i }));

        const titleTextbox = screen.getAllByRole("textbox", { name: /title/i });
        await user.clear(titleTextbox[0]);
        await user.type(titleTextbox[0], "Harry");

        const authorSelect = screen.getAllByRole("combobox", { name: /author/i });
        await user.click(authorSelect[0]);
        await user.click(screen.getByRole("option", { name: "Autor A" }));

        const isbnTextbox = screen.getAllByRole("textbox", { name: /isbn/i });
        await user.clear(isbnTextbox[0]);
        await user.type(isbnTextbox[0], "1234567890123");

        const yearTextbox = screen.getAllByRole("textbox", { name: /year/i });
        await user.clear(yearTextbox[0]);
        await user.type(yearTextbox[0], "2025");

        expect(titleTextbox[0]).toHaveValue("Harry");
        expect(authorSelect[0]).toHaveTextContent("Autor A");
        expect(isbnTextbox[0]).toHaveValue("1234567890123");
        expect(yearTextbox[0]).toHaveValue("2025");

        await user.click(screen.getByRole("button", { name: /update/i }));

        console.log("spy_update", spy_update.mock.calls);

        expect(updateBookAction).toHaveBeenCalled();
        expect(await screen.findByText("Buch wurde geändert.")).toBeInTheDocument();
        expect(spy_update).toHaveBeenLastCalledWith("Buch wurde geändert.", {
            description: `${date}, ${time} Uhr`,
        });
    });

    it("zeigt den Error-Toast, wenn updateBookAction fehlschlägt.", async () => {
        const user = userEvent.setup();
        vi.mocked(updateBookAction).mockResolvedValueOnce({
            success: false,
            error: "Validation Error",
        });
        const spy_updateError = vi.spyOn(toast, "error");
        renderBookList();

        const accordion_1 = screen.getByRole("button", { name: /accordion_1/i });
        await user.click(accordion_1);

        await user.click(screen.getByRole("button", { name: /edit/i }));

        const titleTextbox = screen.getAllByRole("textbox", { name: /title/i });
        await user.clear(titleTextbox[0]);
        await user.type(titleTextbox[0], "Harry");

        const authorSelect = screen.getAllByRole("combobox", { name: /author/i });
        await user.click(authorSelect[0]);
        await user.click(screen.getByRole("option", { name: "Autor A" }));

        const isbnTextbox = screen.getAllByRole("textbox", { name: /isbn/i });
        await user.clear(isbnTextbox[0]);
        await user.type(isbnTextbox[0], "1234890123");

        const yearTextbox = screen.getAllByRole("textbox", { name: /year/i });
        await user.clear(yearTextbox[0]);
        await user.type(yearTextbox[0], "2025");

        await user.click(screen.getByRole("button", { name: /update/i }));

        console.log("spy_updateError", spy_updateError.mock.calls);

        expect(await screen.findByText("Validation Error")).toBeInTheDocument();
        expect(spy_updateError).toHaveBeenLastCalledWith("Validation Error", {
            description: `${date}, ${time} Uhr`,
        });
    });

    it("zeigt den Erfolgs-Toast, wenn ein Buch erfolgreich gelöscht wurde.", async () => {
        const user = userEvent.setup();
        const spy_delete = vi.spyOn(toast, "success");
        renderBookList();

        const accordion_1 = screen.getByRole("button", { name: /accordion_1/i });
        await user.click(accordion_1);

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        await user.click(deleteButton);

        console.log("spy_delete", spy_delete.mock.calls);

        expect(await screen.findByText("Erfolgreich gelöscht.")).toBeInTheDocument();
        expect(spy_delete).toHaveBeenLastCalledWith("Erfolgreich gelöscht.", {
            description: `${date}, ${time} Uhr`,
        });
    });

    it("zeigt den Error-Toast, wenn deleteBookAction fehlschlägt.", async () => {
        const user = userEvent.setup();
        vi.mocked(deleteBookAction).mockResolvedValueOnce({
            success: false,
            error: "Validation Error",
        });
        const spy_deleteError = vi.spyOn(toast, "error");
        renderBookList();

        const accordion_1 = screen.getByRole("button", { name: /accordion_1/i });
        await user.click(accordion_1);

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        await user.click(deleteButton);

        console.log("spy_deleteError", spy_deleteError.mock.calls);

        expect(await screen.findByText("Validation Error")).toBeInTheDocument();
        expect(spy_deleteError).toHaveBeenLastCalledWith("Validation Error", {
            description: `${date}, ${time} Uhr`,
        });
    });
});
