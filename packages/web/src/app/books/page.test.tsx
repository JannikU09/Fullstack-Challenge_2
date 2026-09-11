import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authorTestList, bookTestList } from "../../lib/bookTestList";
import BooksPage from "./page";

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    // if (String(url).includes("/api/authors")) {
    //   console.log("oben", String(url));
    //   return Promise.resolve(
    //     new Response(
    //       JSON.stringify({
    //         data: authorTestList,
    //       }),
    //       { status: 200 }
    //     ),
    //   );
    // }

    if (String(url).includes("/api/books")) {
      console.log("unten", String(url));
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: bookTestList,
            total: 1,
          }),
          { status: 200 },
        ),
      );
    }

    return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
  }) as typeof fetch;
});

describe("BooksPage", () => {
  it("zeigt Bücher aus der API an", async () => {
    render(<BooksPage />);
    expect(await screen.findByText("Test-Buch")).toBeInTheDocument();
  });
});

describe("POST-Test", () => {
  it("ruft fetch mit POST auf", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: authorTestList }), { status: 200 }),
      )
      // .mockResolvedValueOnce(new Response(JSON.stringify({ data: bookTestList, total: 1 }), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            data: {
              title: "Neues Buch",
              authorId: 1,
              isbn: "234523462546245",
              year: 2026,
            },
          }),
          { status: 200 },
        ),
      );

    console.log("authorTestList", authorTestList);
    console.log("isArray", Array.isArray(authorTestList));

    render(<BooksPage />);

    const titleInput = await screen.findByLabelText("Title");

    const user = userEvent.setup();
    await user.type(titleInput, "Neues Buch");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/books"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});
