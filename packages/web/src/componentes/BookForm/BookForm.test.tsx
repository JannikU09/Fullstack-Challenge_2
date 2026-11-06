import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BookInitialValues } from "../../app/interfaces/BookInitialValues";
import { authorTestList } from "../../lib/bookTestList";
import { BookForm } from "./BookForm";

const initialValuess: BookInitialValues = {
    title: "Guten Morgen",
    authorId: 2,
    isbn: "7864521596483",
    year: 2025,
};

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
    replaceMock.mockClear();
});

function renderBookForm(initialValues_1?: BookInitialValues) {
    return render(<BookForm authors={authorTestList} initialValues={initialValues_1} />);
}

describe("BookForm", () => {
    it("prüft die Texteingabe für den Title", async () => {
        const user = userEvent.setup();
        renderBookForm();

        const titleTextbox = screen.getByRole("textbox", { name: /title/i });
        await user.type(titleTextbox, "Harry");

        expect(titleTextbox).toHaveValue("Harry");
    });

    it("prüft die Combobox für die Authoreingabe", async () => {
        const user = userEvent.setup();
        renderBookForm();

        const authorCombobox = screen.getByRole("combobox", { name: /author/i });
        await user.click(authorCombobox);
        const option = screen.getByRole("option", { name: "Autor A" });
        await user.click(option);

        expect(authorCombobox).toHaveTextContent("Autor A");
    });

    it("prüft die Texteingabe für die ISBN", async () => {
        const user = userEvent.setup();
        renderBookForm();

        const isbnTextbox = screen.getByRole("textbox", { name: /isbn/i });
        await user.type(isbnTextbox, "1234658748741");

        expect(isbnTextbox).toHaveValue("1234658748741");
    });

    it("prüft die Texteingabe für das Jahr", async () => {
        const user = userEvent.setup();
        renderBookForm();

        const yearTextbox = screen.getByRole("textbox", { name: /year/i });
        await user.type(yearTextbox, "2026");

        expect(yearTextbox).toHaveValue("2026");
    });

    it("ruft onSubmit ohne initialValues auf.", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<BookForm authors={authorTestList} onSubmit={onSubmit} submitLabel="Add" />);

        await user.type(screen.getByRole("textbox", { name: /title/i }), "Harry");
        await user.click(screen.getByRole("combobox", { name: /author/i }));
        await user.click(screen.getByRole("option", { name: "Autor A" }));
        await user.type(screen.getByRole("textbox", { name: /isbn/i }), "1234567890123");
        await user.type(screen.getByRole("textbox", { name: /year/i }), "2025");

        await user.click(screen.getByRole("button", { name: /add/i }));

        expect(onSubmit).toHaveBeenCalledWith(expect.anything(), {
            Books: { id: undefined, title: "Harry", authorId: 1, isbn: "1234567890123", year: 2025 },
            Author: { id: 1, name: "" },
        });

        expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue("");
    });

    it("ruft onSubmit mit initialValues auf.", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<BookForm authors={authorTestList} onSubmit={onSubmit} submitLabel="Update" initialValues={initialValuess} />);


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

        await user.click(screen.getByRole("button", { name: /update/i }));

        expect(onSubmit).toHaveBeenCalledWith(expect.anything(), {
            Books: { id: undefined, title: "Harry", authorId: 1, isbn: "1234567890123", year: 2025 },
            Author: { id: 1, name: "" },
        });

        expect(titleTextbox).toHaveValue("Harry");
        expect(isbnTextbox).toHaveValue("1234567890123");
        expect(yearTextbox).toHaveValue("2025");
    })

    it("ISBN-Hilfstexte, 12 Zeichen eingetippt", async () => {
        const user = userEvent.setup();
        renderBookForm();

        const isbnTextbox = screen.getByRole("textbox", { name: /isbn/i });
        await user.type(isbnTextbox, "123456789012");

        expect(screen.getByText("Noch 1 Zeichen")).toBeVisible();
        expect(screen.getByText(/zu viel/i)).not.toBeVisible();
    });

    it("ISBN-Hilfstexte, 13 Zeichen eingetippt", async () => {
        const user = userEvent.setup();
        renderBookForm();

        const isbnTextbox = screen.getByRole("textbox", { name: /isbn/i });
        await user.type(isbnTextbox, "1234567890123");

        expect(screen.getByText(/^Noch \d+ Zeichen$/)).not.toBeVisible();
        expect(screen.getByText(/zu viel/i)).not.toBeVisible();
    });

    it("ISBN-Hilftexte, 14 Zeichen eingetippt", async () => {
        const user = userEvent.setup();
        renderBookForm();

        const isbnTextbox = screen.getByRole("textbox", { name: /isbn/i });
        await user.type(isbnTextbox, "12345678901234");

        expect(screen.getByText(/^Noch -?\d+ Zeichen$/)).not.toBeVisible();
        expect(screen.getByText("1 Zeichen zu viel!")).toBeVisible();
    });

    it("ISBN-Hilfstexte, 0 Zeichen eingetippt", async () => {
        renderBookForm();

        expect(screen.getByText("Noch 13 Zeichen")).toBeVisible();
        expect(screen.getByText(/zu viel/i)).not.toBeVisible();
    });
});
