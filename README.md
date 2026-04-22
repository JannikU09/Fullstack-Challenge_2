# Fullstack Challenge: Buchverwaltung

## Übersicht

Dies ist eine Fullstack-Coding-Challenge. Du baust eine Buchverwaltungsfunktion mit Next.js und Drizzle ORM.

Das **Autor-Feature ist bereits fertig** — es dient dir als Referenz. Deine Aufgabe ist es, das **Buch-Feature** zu ergänzen: Datenbank-Schema, API-Endpunkte und eine Frontend-Seite.

---

## Für WebDev-Einsteiger

Wenn du wenig oder keine Erfahrung mit moderner Web-Entwicklung hast, arbeite dich zuerst durch diese Grundlagen — dann fällt dir die Challenge deutlich leichter.

**Sprach- & Framework-Progression**:

1. **JavaScript / TypeScript** — Syntax, async/await, Module-System
2. **React** — Komponenten, Props, State, Hooks (`useState`, `useEffect`)
3. **Next.js (App Router)** — Server/Client Components, Route Handlers, File-based Routing

**Empfohlene Kurse** (beide kostenlos, offiziell):

- [Next.js Learn: React Foundations](https://nextjs.org/learn/react-foundations) — React-Grundlagen für Einsteiger
- [Next.js Learn: Dashboard App](https://nextjs.org/learn/dashboard-app) — Fullstack-Tutorial mit DB + Auth + Deployment

**Tools, die dieses Projekt nutzt** (vorher kurz anschauen hilft):

| Tool            | Rolle                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **pnpm**        | Package Manager (schneller + platzsparender als npm) — [Docs](https://pnpm.io)                    |
| **Biome**       | Linter + Formatter (Alternative zu ESLint + Prettier in einem Tool) — [Docs](https://biomejs.dev) |
| **Drizzle ORM** | Type-safe SQL Query Builder für die DB-Schicht — [Docs](https://orm.drizzle.team)                 |
| **Docker**      | Lokale PostgreSQL-Instanz via `docker-compose.yml`                                                |
| **Swagger UI**  | API-Dokumentation zum manuellen Testen der Endpunkte                                              |

---

## Voraussetzungen

- Node.js 18 oder höher
- pnpm (Installation: `npm install -g pnpm`)
- Docker (für die lokale PostgreSQL-Datenbank)

---

## Projekt einrichten

```bash
pnpm run setup
pnpm dev
```

`pnpm run setup` kopiert automatisch die `.env.example`-Dateien nach `.env` (falls noch nicht vorhanden), startet PostgreSQL via Docker, installiert Dependencies, erstellt die Tabellen und befüllt die Seed-Daten.

Jedes Paket hat seine eigene `.env`-Datei — beide werden automatisch erstellt:

| Datei                    | Genutzt von                             |
| ------------------------ | --------------------------------------- |
| `packages/database/.env` | Drizzle Kit (Migrationen, Seed, Studio) |
| `packages/web/.env`      | Next.js (Dev-Server, API-Routes)        |

Beide enthalten `DATABASE_URL` mit denselben Standardwerten. Du musst nichts ändern.

Öffne http://localhost:3000

---

## Projektstruktur

```
book-manager/
├── packages/database/           # Datenbank-Paket (Drizzle ORM) — SERVER ONLY
│   ├── src/schema.ts           # Schema-Datei (hier arbeitest du!)
│   ├── src/client.ts           # Datenbank-Client
│   ├── drizzle.config.ts       # Drizzle Kit Konfiguration
│   └── seed.ts                 # Autor-Seed-Daten
└── packages/web/                # Next.js Anwendung
    ├── src/app/api/authors/    # Autor-API (Referenz!)
    ├── src/app/api/books/      # Bücher-API (deine Aufgabe!)
    ├── src/app/books/          # Bücher-Seite (deine Aufgabe!)
    └── src/app/api-doc/        # API Dokumentation (Swagger UI)
```

> ⚠️ **`@book-manager/database` ist ein Server-Only-Paket.** Importiere es nur in Server-Code (Route Handlers, Server Components, Server Actions, Seed/Migrations). Niemals in Client Components (`"use client"`) — `pg` und `DATABASE_URL` dürfen das Client-Bundle nicht erreichen.

---

## Deine Aufgaben

### Aufgabe 1: Datenbank-Schema

**Ziel**: Erstelle die `books` Tabelle in der Drizzle-Schema-Datei.

**Datei**: `packages/database/src/schema.ts`

**Was zu tun ist**:

1. Öffne `packages/database/src/schema.ts`
2. Füge eine neue `books` Tabelle hinzu mit folgenden Spalten:
   - `id` — serial, Primary Key
   - `title` — text (Pflichtfeld)
   - `isbn` — text (optional, unique)
   - `year` — integer (optional)
   - `authorId` — integer (Fremdschlüssel auf `authors.id`)

   > **Hinweis zu `isbn` (optional + unique)**: In PostgreSQL erlaubt ein `UNIQUE`-Constraint mehrere `NULL`-Werte — zwei NULLs gelten nicht als Duplikat. `isbn` kann also gleichzeitig optional und unique sein.

3. Definiere die Relation zwischen `authors` und `books`
4. Wende das Schema auf die Datenbank an:

```bash
pnpm --filter @book-manager/database db:push
```

**Überprüfung**: Öffne Drizzle Studio mit `pnpm --filter @book-manager/database studio` — du solltest die Book-Tabelle sehen.

**Hinweis**: Schau dir die `authors` Tabelle in `schema.ts` als Referenz an!

---

### Aufgabe 2: API-Endpunkte

**Ziel**: Erstelle die API-Routes für Bücher.

**Dateien, die du anlegen musst**:

- `packages/web/src/app/api/books/route.ts` — GET (alle Bücher) + POST (neues Buch)
- `packages/web/src/app/api/books/[id]/route.ts` — DELETE (Buch löschen)

**Referenz**: Schau dir `packages/web/src/app/api/authors/route.ts` an — das ist das Muster, dem du folgen sollst!

**Was zu tun ist**:

**GET /api/books** — Alle Bücher mit Autor zurückgeben:

```typescript
// Server-only Import — nur in Route Handlers / Server Components / Server Actions
import { db, books, authors } from "@book-manager/database";
import { eq } from "drizzle-orm";
// db.select().from(books).innerJoin(authors, eq(books.authorId, authors.id))
```

**POST /api/books** — Neues Buch erstellen:

- Request Body: `{ title, authorId, isbn?, year? }`
- Validierung: `title` und `authorId` sind Pflichtfelder (sonst 400 zurückgeben)
- Antwort: 201 mit dem erstellten Buch

**GET /api/books/[id]** — Ein einzelnes Buch abrufen:

- Buch mit Autor anhand der ID zurückgeben
- 404 zurückgeben, wenn das Buch nicht existiert

**DELETE /api/books/[id]** — Buch löschen:

- Buch anhand der ID löschen
- 404 zurückgeben, wenn das Buch nicht existiert
- 204 (No Content) bei Erfolg

**Überprüfung**: Teste deine Endpunkte über die [API Dokumentation](http://localhost:3000/api-doc) (Swagger UI)!

---

### Aufgabe 3: Frontend

**Ziel**: Baue die Bücher-Seite.

**Datei**: `packages/web/src/app/books/page.tsx`

**Was zu tun ist**:

1. Bücherliste anzeigen (GET /api/books)
2. Formular zum Hinzufügen neuer Bücher:
   - Titel (Pflichtfeld)
   - Autor-Dropdown (aus GET /api/authors)
   - ISBN (optional)
   - Jahr (optional)
3. Löschen-Button pro Buch (DELETE /api/books/[id])

**Hinweise**:

- Schreibe `"use client"` ganz oben in der Datei — die Seite braucht interaktive Elemente
- Nutze `useState`, `useEffect` und `fetch`
- Schau dir `packages/web/src/app/api-doc/page.tsx` als Beispiel für eine `"use client"` Komponente an

**Überprüfung**: Öffne http://localhost:3000/books — du solltest Bücher hinzufügen und löschen können.

---

### Aufgabe 4: Validierung mit Zod

**Ziel**: Typsichere Request-Validierung in den API-Routes.

**Was zu tun ist**:

1. Installiere `zod` im `@book-manager/web` Paket
2. Definiere Schemas für POST- und PUT-Bodies (`title: string, min 1`, `authorId: number, int positive`, `isbn: string optional`, `year: number int optional`)
3. Validiere eingehende Requests mit `schema.safeParse(body)`
4. Bei `!success`: 400 mit strukturierten Fehler-Details (`error.flatten()`)

**Überprüfung**: Sende per Swagger UI einen Request mit leerem `title` → 400 mit Feld-spezifischen Fehlermeldungen.

---

### Aufgabe 5: Paginierung + Suche

**Ziel**: GET /api/books unterstützt Query-Parameter.

**Was zu tun ist**:

1. Unterstütze diese Query-Parameter:
   - `?page=1&pageSize=20` — Offset-Paginierung (Defaults: 1 / 20, maximal 100)
   - `?q=harry` — Volltextsuche auf `title` (case-insensitive, `ilike`)
   - `?authorId=3` — Filter nach Autor
2. Antwort-Format:

```json
{ "data": [...], "page": 1, "pageSize": 20, "total": 42 }
```

3. Validiere Query-Parameter ebenfalls mit Zod (`z.coerce.number()`)
4. Erweitere die Bücher-Seite: Suchfeld + Pagination-Buttons

**Hinweis**: Nutze `drizzle-orm` Operatoren `ilike`, `and`, `sql<number>` count, `limit`, `offset`.

---

### Aufgabe 6: Tests (Vitest)

**Ziel**: Erste Unit-Tests für UI-Komponenten.

**Idee**: Du renderst eine React-Komponente in einer simulierten Browser-Umgebung (jsdom), interagierst mit ihr (Klick, Tipp) und prüfst, was angezeigt wird. `fetch` wird gemockt, damit die Tests keine echten API-Calls machen.

**Was zu tun ist**:

1. Installiere Vitest und die React-Testing-Tools im Web-Paket:

   ```bash
   pnpm --filter @book-manager/web add -D vitest @vitejs/plugin-react jsdom \
     @testing-library/react @testing-library/user-event @testing-library/jest-dom
   ```

2. Lege `packages/web/vitest.config.ts` an:

   ```typescript
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: "jsdom",
       setupFiles: ["./vitest.setup.ts"],
     },
   });
   ```

3. Lege `packages/web/vitest.setup.ts` an:

   ```typescript
   import "@testing-library/jest-dom/vitest";
   ```

4. Füge ein Script in `packages/web/package.json` hinzu:

   ```json
   "scripts": { "test": "vitest" }
   ```

5. Schreibe einen Test neben deiner Bücher-Seite, z.B. `packages/web/src/app/books/page.test.tsx`:

   ```typescript
   import { describe, it, expect, vi, beforeEach } from "vitest";
   import { render, screen } from "@testing-library/react";
   import BooksPage from "./page";

   beforeEach(() => {
     global.fetch = vi.fn((url) => {
       if (String(url).includes("/api/books")) {
         return Promise.resolve(
           new Response(JSON.stringify([
             { id: 1, title: "Test-Buch", author: { name: "Autor" } },
           ])),
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
   ```

6. Decke diese Fälle ab:
   - Liste wird gerendert, wenn `fetch` Bücher liefert
   - Leere Liste zeigt einen passenden Hinweis
   - Formular-Submit ruft `fetch` mit `POST` auf (mit `userEvent.type` + `userEvent.click`)

7. Tests starten:

   ```bash
   pnpm --filter @book-manager/web test
   ```

**Regel**: Nur `fetch` wird gemockt. Keine echte API, keine Datenbank. Die Komponenten selbst testen wir unverändert — so prüfen wir Verhalten, nicht Implementierung.

---

### Aufgabe 7: Buch bearbeiten (PUT)

**Ziel**: Bestehendes Buch aktualisieren.

**Was zu tun ist**:

1. `PUT /api/books/[id]` — Body wie POST, partielle Updates erlaubt
2. 404 falls Buch nicht existiert, 200 mit aktualisiertem Buch bei Erfolg
3. Frontend: Bearbeiten-Button pro Buch öffnet Inline-Formular oder Modal
4. Wiederverwendbare Form-Komponente für Create + Edit

---

### Aufgabe 8: Optimistic UI + Toasts

**Ziel**: UX-Polish durch optimistische Updates.

**Was zu tun ist**:

1. Installiere `sonner` (oder baue minimales Toast-System)
2. DELETE: Buch sofort aus Liste entfernen, bei API-Fehler rollback + Error-Toast
3. POST: neues Buch sofort anfügen (temporäre ID), nach Erfolg ID ersetzen
4. PUT: Feld-Updates sofort sichtbar, rollback bei Fehler
5. Success/Error-Toast nach jeder Mutation

**Hinweis**: `useOptimistic` Hook (React 19) oder manuelles State-Handling.

---

### Aufgabe 9: Server Components + Server Actions

**Ziel**: Vom `"use client"` Fetch-Pattern auf natives Next.js App Router umstellen.

**Was zu tun ist**:

1. `packages/web/src/app/books/page.tsx` → Server Component (kein `"use client"`)
2. Direkter DB-Zugriff via `@book-manager/database` im Server-Render
3. Mutationen via Server Actions (`"use server"`) statt `fetch('/api/books')`
4. `revalidatePath('/books')` nach Mutation
5. Formular als Client-Komponente, ruft Server Action auf

**Überprüfung**: Kein `fetch` Call im Client-Bundle für die Bücher-Seite.

---

### Aufgabe 10: Migrationen statt `db:push`

**Ziel**: Versionierte SQL-Migrationen im Repo.

**Was zu tun ist**:

1. Entferne `db:push` Workflow
2. Generiere Migration: `pnpm --filter @book-manager/database generate`
3. Commit die SQL-Datei unter `packages/database/drizzle/`
4. Setup-Script ruft `migrate` statt `push`
5. Füge Script `pnpm --filter @book-manager/database migrate:status` oder equivalent hinzu

**Überprüfung**: Frisches `docker compose down -v && pnpm run setup` reproduziert DB-State.

---

## Hilfreiche Links

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Docs](https://react.dev)

---

## Nützliche Befehle

| Befehl                                          | Beschreibung                                        |
| ----------------------------------------------- | --------------------------------------------------- |
| `pnpm dev`                                      | Startet den Entwicklungsserver                      |
| `pnpm lint`                                     | Prüft den Code mit Biome (Linting + Formatierung)   |
| `pnpm lint:fix`                                 | Behebt Linting- und Formatierungsfehler automatisch |
| `pnpm format`                                   | Formatiert den Code mit Biome                       |
| `pnpm --filter @book-manager/database db:push`  | Wendet Schema-Änderungen auf die Datenbank an       |
| `pnpm --filter @book-manager/database generate` | Generiert SQL-Migrationsdateien                     |
| `pnpm --filter @book-manager/database migrate`  | Führt Migrationen aus                               |
| `pnpm --filter @book-manager/database studio`   | Öffnet Drizzle Studio                               |
| `pnpm --filter @book-manager/database seed`     | Fügt Autor-Daten ein                                |
| `pnpm run db:start`                             | Startet PostgreSQL via Docker                       |
| `pnpm run db:stop`                              | Stoppt PostgreSQL                                   |

---

## Fehlerbehebung

**"Table does not exist"**
→ Hast du `db:push` ausgeführt? `pnpm --filter @book-manager/database db:push`

**"Cannot find module @book-manager/database"**
→ Führe `pnpm install` im Projektverzeichnis aus

**"DATABASE_URL is not set"**
→ Kopiere `.env.example` nach `.env` und füge deinen Connection String ein

**Autor-Relation Fehler**
→ Hast du die Relation zwischen `books` und `authors` in `schema.ts` definiert?
