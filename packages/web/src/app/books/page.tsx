import type { BookSearchParams } from "../interfaces/searchParams";
import { getAuthors, getBooks } from "./actions";
import { BookList } from "./BookList";
import { BooksFilters } from "./BooksFilters";
import { BooksPagination } from "./BooksPagination";
import "./page.css";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<BookSearchParams>;
}) {
  const params = await searchParams;
  const [{ data: books, total, totalPages }, authors] = await Promise.all([
    getBooks(params),
    getAuthors(),
  ]);

  return (
    <div>
      <BooksFilters authors={authors} total={total} />

      <div style={{ margin: "5px" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >

        {total === 1 ?
          <h1>{total} Buch</h1> :
          <h1>{total} Bücher</h1>
        }
        <h1>Neues Buch</h1>
      </div>

      <BookList books={books} authors={authors} total={total} />

      <div style={{ margin: "15px" }} />

      <BooksPagination totalPages={totalPages} />
    </div>
  );
};
