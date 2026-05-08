# Fullstack Challenge: Buchverwaltung

## Übersicht

Dies ist eine Fullstack-Coding-Challenge. Du baust eine Buchverwaltungsfunktion mit Next.js und Drizzle ORM.

Das **Autor-Feature ist bereits fertig** — es dient dir als Referenz. Deine Aufgabe ist es, das **Buch-Feature** zu ergänzen: UI-Komponenten, Datenbank-Schema und API-Endpunkte — aufeinander aufbauend von einfach zu komplex.

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
    ├── src/components/
    │   ├── ui/                 # Button, Input, Select (deine Aufgabe!)
    │   └── BookForm.tsx        # wiederverwendbare Form (deine Aufgabe!)
    └── src/app/api-doc/        # API Dokumentation (Swagger UI)
```

> ⚠️ **`@book-manager/database` ist ein Server-Only-Paket.** Importiere es nur in Server-Code (Route Handlers, Server Components, Server Actions, Seed/Migrations). Niemals in Client Components (`"use client"`) — `pg` und `DATABASE_URL` dürfen das Client-Bundle nicht erreichen.

---

## Deine Aufgaben

Aufgaben steigen von **einfach → komplex**:

1. **UI-Basis** (stateless Bausteine)
2. **UI-Komposition** (State, wiederverwendbare Form)
3. **Seite mit Mock-Daten** (UI-Integration ohne Backend)
4. **Datenbank** (Schema, Migrationen)
5. **API** (CRUD, Validierung, Edit, Suche)
6. **Qualität & Architektur** (Tests, Optimistic UX, Server Components)

---

### Aufgabe 1: UI-Basis — Button

**Ziel**: Einfachste wiederverwendbare Komponente — stateless, nur Props.

**Datei**: `packages/web/src/components/ui/Button.tsx`

**Was zu tun ist**:

1. Props: `variant: "primary" | "danger"`, `type?: "button" | "submit"`, `onClick?`, `disabled?`, `children`
2. Varianten visuell unterscheiden (Farbe, Hover)
3. `disabled`-Zustand respektieren

**Hinweise**:

- Kein `"use client"` nötig — keine Hooks, kein State im Modul
- Styling minimal (Tailwind oder inline)
- Klein halten — keine Logik im Button

---

### Aufgabe 2: UI-Basis — Input + Select

**Ziel**: Form-Felder als wiederverwendbare Komponenten — weiterhin stateless.

**Dateien**:

- `packages/web/src/components/ui/Input.tsx`
- `packages/web/src/components/ui/Select.tsx`

**Was zu tun ist**:

**`Input.tsx`**:

- Props: `label`, `name`, `value`, `onChange`, `type?` (default `"text"`), `required?`, `error?`
- Label + Input + Fehlertext rendern

**`Select.tsx`**:

- Props: `label`, `name`, `value`, `onChange`, `options: { value: string | number; label: string }[]`, `required?`

**Hinweise**:

- Immer noch stateless — Parent hält den Wert
- Fehleranzeige nur wenn `error` gesetzt

---

### Aufgabe 3: UI-Komposition — BookForm (wiederverwendbar)

**Ziel**: Form-Komponente mit lokalem State, die für Create UND Edit funktioniert.

**Datei**: `packages/web/src/components/BookForm.tsx`

**Was zu tun ist**:

1. `"use client"` oben — State + Events nötig
2. Props:
   - `initialValues?: { title?; authorId?; isbn?; year? }`
   - `authors: { id: number; name: string }[]`
   - `onSubmit: (values) => Promise<void> | void`
   - `submitLabel?: string` (default `"Speichern"`)
3. Felder: Titel (Pflicht), Autor-Dropdown, ISBN (optional), Jahr (optional)
4. Lokaler Form-State via `useState`
5. Nutzt `Input`, `Select`, `Button` aus Aufgaben 1-2

**Hinweise**:

- Form kennt **keine API** — erhält `onSubmit` als Prop. Wiederverwendbar für Create und Edit (Aufgabe 9).
- Nach erfolgreichem Submit Felder leeren (nur wenn keine `initialValues`)

---

### Aufgabe 4: Bücher-Seite mit Mock-Daten

**Ziel**: Komplette Seite zusammenstecken — noch ohne echte API.

**Datei**: `packages/web/src/app/books/page.tsx`

**Was zu tun ist**:

1. `"use client"` oben
2. Statische Mock-Daten im State (`useState<Book[]>([...])`, `useState<Author[]>([...])`)
3. Bücherliste rendern (Titel, Autor-Name, ISBN, Jahr)
4. `BookForm` einbinden → `onSubmit` fügt Buch in lokalen State ein
5. Löschen-Button pro Buch → entfernt aus lokalem State

**Überprüfung**: http://localhost:3000/books — Seite rendert, Add/Delete funktioniert lokal.

**Hinweis**: Mock-Daten werden in Aufgabe 7 durch echte API ersetzt.

---

### Aufgabe 5: Datenbank-Schema

**Ziel**: `books` Tabelle in Drizzle-Schema.

**Datei**: `packages/database/src/schema.ts`

**Was zu tun ist**:

1. `books` Tabelle mit Spalten:
   - `id` — serial, Primary Key
   - `title` — text (Pflichtfeld)
   - `isbn` — text (optional, unique)
   - `year` — integer (optional)
   - `authorId` — integer (Fremdschlüssel auf `authors.id`)

   > **Hinweis `isbn` (optional + unique)**: PostgreSQL erlaubt mehrere `NULL`-Werte in `UNIQUE`-Constraints — zwei NULLs gelten nicht als Duplikat.

2. Relation `authors` ↔ `books` definieren
3. Schema anwenden:

```bash
pnpm --filter @book-manager/database db:push
```

**Überprüfung**: `pnpm --filter @book-manager/database studio` → Book-Tabelle sichtbar.

**Hinweis**: `authors` Tabelle in `schema.ts` als Referenz.

---

### Aufgabe 6: Versionierte Migrationen

**Ziel**: SQL-Migrationen statt `db:push` im Repo.

**Was zu tun ist**:

1. `db:push`-Workflow aus Setup entfernen
2. Migration generieren: `pnpm --filter @book-manager/database generate`
3. SQL-Datei unter `packages/database/drizzle/` committen
4. Setup-Script ruft `migrate` statt `push`
5. Script `migrate:status` (oder äquivalent) ergänzen

**Überprüfung**: `docker compose down -v && pnpm run setup` reproduziert DB-State sauber.

---

### Aufgabe 7: API-Endpunkte (GET, POST, DELETE) + Verdrahtung

**Ziel**: Basis-CRUD + Mock-Daten in der Seite durch echte API ersetzen.

**Dateien**:

- `packages/web/src/app/api/books/route.ts` — GET (Liste) + POST (neu)
- `packages/web/src/app/api/books/[id]/route.ts` — GET (einzeln) + DELETE

**Referenz**: `packages/web/src/app/api/authors/route.ts` — dem Muster folgen.

**Was zu tun ist**:

**GET /api/books** — Alle Bücher mit Autor (Join):

```typescript
// Server-only Import — nur Route Handlers / Server Components / Server Actions
import { db, books, authors } from "@book-manager/database";
import { eq } from "drizzle-orm";
// db.select().from(books).innerJoin(authors, eq(books.authorId, authors.id))
```

**POST /api/books** — Neues Buch:

- Body: `{ title, authorId, isbn?, year? }`
- Validierung: `title` + `authorId` Pflicht (sonst 400)
- Antwort: 201 mit erstelltem Buch

**GET /api/books/[id]** — Einzelnes Buch mit Autor:

- 404 falls nicht vorhanden

**DELETE /api/books/[id]**:

- 404 falls nicht vorhanden
- 204 bei Erfolg

**Verdrahtung**: In `books/page.tsx`:

- Mock-Daten durch `fetch('/api/books')` im `useEffect` ersetzen
- Autoren per `fetch('/api/authors')` laden
- Form-`onSubmit` → `fetch('/api/books', { method: 'POST' })`
- Delete-Button → `fetch('/api/books/:id', { method: 'DELETE' })`

**Überprüfung**: Swagger UI ([API-Doc](http://localhost:3000/api-doc)) + Seite zeigt echte DB-Daten.

---

### Aufgabe 8: Validierung mit Zod

**Ziel**: Typsichere Request-Validierung in API-Routes.

**Was zu tun ist**:

1. `zod` im `@book-manager/web` Paket installieren
2. Schemas für POST/PUT-Bodies: `title: string min 1`, `authorId: number int positive`, `isbn: string optional`, `year: number int optional`
3. Requests mit `schema.safeParse(body)` validieren
4. Bei `!success`: 400 mit `error.flatten()`

**Überprüfung**: Swagger UI → Request mit leerem `title` → 400 mit Feld-Fehlern.

---

### Aufgabe 9: Buch bearbeiten (PUT) — BookForm wiederverwenden

**Ziel**: Update-Endpunkt + Edit-UI durch Wiederverwendung der `BookForm`.

**Was zu tun ist**:

1. `PUT /api/books/[id]` — Body wie POST, partielle Updates erlaubt
2. 404 falls nicht vorhanden, 200 mit aktualisiertem Buch bei Erfolg
3. Zod-Schema für PUT (alle Felder optional)
4. Frontend: Bearbeiten-Button pro Buch → öffnet `BookForm` (Inline oder Modal) mit `initialValues`
5. **Dieselbe `BookForm` aus Aufgabe 3** für Create + Edit — `onSubmit` entscheidet POST vs. PUT

**Hinweis**: Hier zahlt sich Aufgabe 3 aus — kein zweites Formular.

---

### Aufgabe 10: Paginierung + Suche

**Ziel**: GET /api/books mit Query-Parametern.

**Was zu tun ist**:

1. Query-Parameter:
   - `?page=1&pageSize=20` — Offset-Paginierung (Defaults 1/20, max 100)
   - `?q=harry` — Volltext auf `title` (case-insensitive, `ilike`)
   - `?authorId=3` — Filter
2. Antwort-Format:

```json
{ "data": [...], "page": 1, "pageSize": 20, "total": 42 }
```

3. Query-Validierung via Zod (`z.coerce.number()`)
4. Seite erweitern: Suchfeld + Pagination-Buttons

**Hinweis**: `drizzle-orm` Operatoren `ilike`, `and`, `sql<number>` count, `limit`, `offset`.

---

### Aufgabe 11: Tests (Vitest)

**Ziel**: Unit-Tests für UI-Komponenten.

**Idee**: React-Komponente in jsdom rendern, interagieren (Klick, Tipp), prüfen. `fetch` gemockt — keine echte API.

**Was zu tun ist**:

1. Dependencies installieren:

   ```bash
   pnpm --filter @book-manager/web add -D vitest @vitejs/plugin-react jsdom \
     @testing-library/react @testing-library/user-event @testing-library/jest-dom
   ```

2. `packages/web/vitest.config.ts`:

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

3. `packages/web/vitest.setup.ts`:

   ```typescript
   import "@testing-library/jest-dom/vitest";
   ```

4. **TypeScript-Augmentation** — sonst wirft `.toBeInTheDocument()` einen Fehler:

   In `packages/web/tsconfig.json` → `compilerOptions`:

   ```json
   "types": ["node", "react", "vitest/globals"]
   ```

   Ambient-File `packages/web/src/vitest.d.ts` anlegen:

   ```ts
   import "@testing-library/jest-dom/vitest";
   ```

   > **Warum?** `@testing-library/jest-dom/vitest` erweitert Vitests `expect` via Module-Augmentation. Der Import muss für TS sichtbar sein. `vitest.setup.ts` liegt außerhalb des `include`-Blocks — daher Ambient-File unter `src/`.

5. Script in `packages/web/package.json`:

   ```json
   "scripts": { "test": "vitest" }
   ```

6. Test neben Bücher-Seite, z.B. `packages/web/src/app/books/page.test.tsx`:

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

7. Decke ab:
   - Liste rendert bei `fetch`-Daten
   - Leere Liste → passender Hinweis
   - Form-Submit ruft `fetch` mit `POST` (`userEvent.type` + `userEvent.click`)
   - `BookForm` isoliert: Submit ruft `onSubmit`-Prop mit korrekten Werten

8. Starten: `pnpm --filter @book-manager/web test`

**Regel**: Nur `fetch` wird gemockt. Keine echte API, keine DB. Verhalten testen, nicht Implementierung.

---

### Aufgabe 12: Optimistic UI + Toasts

**Ziel**: UX-Polish durch optimistische Updates.

**Was zu tun ist**:

1. `sonner` installieren (oder minimales Toast-System)
2. DELETE: Buch sofort entfernen, bei Fehler rollback + Error-Toast
3. POST: neues Buch sofort anfügen (temporäre ID), nach Erfolg ID ersetzen
4. PUT: Feld-Updates sofort sichtbar, rollback bei Fehler
5. Success/Error-Toast nach jeder Mutation

**Hinweis**: `useOptimistic` Hook (React 19) oder manuelles State-Handling.

---

### Aufgabe 13: Server Components + Server Actions

**Ziel**: `"use client"` Fetch-Pattern → natives Next.js App Router.

**Was zu tun ist**:

1. `packages/web/src/app/books/page.tsx` → Server Component (kein `"use client"`)
2. Direkter DB-Zugriff via `@book-manager/database` im Server-Render
3. Mutationen via Server Actions (`"use server"`) statt `fetch('/api/books')`
4. `revalidatePath('/books')` nach Mutation
5. `BookForm` bleibt Client-Komponente, ruft Server Action auf

**Überprüfung**: Kein `fetch` Call im Client-Bundle für Bücher-Seite.

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
 