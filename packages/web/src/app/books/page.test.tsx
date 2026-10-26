import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../../componentes/ui/Button";
import { authorTestList, bookTestList } from "../../lib/bookTestList";
import * as actions from "./actions";
import { BooksPagination } from "./BooksPagination";
import BooksPage from "./page";

vi.mock("./actions");
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  usePathname: () => "/books",
  useSearchParams: () => new URLSearchParams(),
}));

// beforeEach(() => {

//   global.fetch = vi.fn((url) => {
//     // if (String(url).includes("/api/authors")) {
//     //   console.log("oben", String(url));
//     //   return Promise.resolve(
//     //     new Response(
//     //       JSON.stringify({
//     //         data: authorTestList,
//     //       }),
//     //       { status: 200 }
//     //     ),
//     //   );
//     // }

//     if (String(url).includes("/api/books")) {
//       console.log("unten", String(url));
//       return Promise.resolve(
//         new Response(
//           JSON.stringify({
//             data: bookTestList,
//             total: 1,
//           }),
//           { status: 200 },
//         ),
//       );
//     }

//     return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
//   }) as typeof fetch;
// });


describe("BooksPage", () => {
  it("zeigt Bücher an", async () => {
    vi.mocked(actions.getBooks).mockResolvedValue({
      data: [
        {
          Author: { name: "Jannik", id: 1 },
          Books: { id: 1, title: "Test-Buch", authorId: 1, isbn: "9784845344974", year: 2026 },
        },
      ],
      total: 1,
      totalPages: 1,
      totalWithoutFilter: 1,
    });
    vi.mocked(actions.getAuthors).mockResolvedValue([{ id: 1, name: "Jannik" }]);
    const jsx = await BooksPage({
      searchParams: Promise.resolve({ q: "", authorId: 1, page: 1, pageSize: 20 }),
    });
    render(jsx);
    expect(await screen.findByText("Test-Buch")).toBeInTheDocument();
  });
});
