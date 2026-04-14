import { db, pool } from "./src/client.js";
import { authors } from "./src/schema.js";

const authorData = [
  { id: 1, name: "J.K. Rowling" },
  { id: 2, name: "George Orwell" },
  { id: 3, name: "Jane Austen" },
  { id: 4, name: "Franz Kafka" },
  { id: 5, name: "Hermann Hesse" },
];

async function main() {
  console.log("Seeding authors...");

  for (const author of authorData) {
    await db
      .insert(authors)
      .values(author)
      .onConflictDoUpdate({
        target: authors.id,
        set: { name: author.name },
      });
  }

  console.log(`Seeded ${authorData.length} authors.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
