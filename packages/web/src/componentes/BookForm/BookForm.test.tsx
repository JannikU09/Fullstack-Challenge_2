import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BookInitialValues } from "../../app/interfaces/BookInitialValues";
import { authorTestList } from "../../lib/bookTestList";
import { BookForm } from "./BookForm";

const initialValuess: BookInitialValues = {
    title: undefined,
    authorId: undefined,
    isbn: undefined,
    year: undefined,
};

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
}));

beforeEach(() => {
    replaceMock.mockClear();
});

function renderBookForm(initialValues_1: BookInitialValues = initialValuess ?? undefined) {
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
});
