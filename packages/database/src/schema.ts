import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const authors = pgTable("Author", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const books = pgTable("Books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isbn: text("isbn").unique(),
  year: integer("year"),
  authorId: integer("authorId").references(() => authors.id).notNull(),
});

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
