import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { bookTestList } from "../../lib/bookTestList";
import BooksPage from "./page";

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (String(url).includes("/api/books")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: bookTestList,
            total: 1,
          }),
        ),
      );
    }
    return Promise.resolve(new Response(JSON.stringify([])));
  }) as typeof fetch;
});

describe("BooksPage", () => {
  it("zeigt Bücher aus der API an", async () => {
    render(<BooksPage />);
    expect(await screen.findByText("Test-Buch")).toBeInTheDocument();
  });
});
