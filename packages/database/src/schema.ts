import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const authors = pgTable("Author", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
