import { render, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { BooksPagination } from "./BooksPagination";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: vi.fn(),
        push: vi.fn(),
    }),
    usePathname: () => "/books",
    useSearchParams: () => new URLSearchParams(),
}))

describe("BooksPagination", () => {
    it("prüft ob die BooksPaginaion rendert.", async () => {
        render(<BooksPagination totalPages={30} />);
        const paginationTest = screen.getByTestId("booksPagination");
        expect(paginationTest).toBeInTheDocument();
    });
});
