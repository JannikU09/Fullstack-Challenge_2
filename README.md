# Fullstack Challenge: Buchverwaltung

## Übersicht

Dies ist eine Fullstack-Coding-Challenge. Du baust eine Buchverwaltungsfunktion mit Next.js und Drizzle ORM.

Das **Autor-Feature ist bereits fertig** — es dient dir als Referenz. Deine Aufgabe ist es, das **Buch-Feature** zu ergänzen: Datenbank-Schema, API-Endpunkte und eine Frontend-Seite.

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

| Datei | Genutzt von |
|-------|-------------|
| `packages/database/.env` | Drizzle Kit (Migrationen, Seed, Studio) |
| `packages/web/.env` | Next.js (Dev-Server, API-Routes) |

Beide enthalten `DATABASE_URL` mit denselben Standardwerten. Du musst nichts ändern.

Öffne http://localhost:3000

---

## Projektstruktur

```
fullstack-challenge/
├── packages/database/           # Datenbank-Paket (Drizzle ORM)
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
3. Definiere die Relation zwischen `authors` und `books`
4. Wende das Schema auf die Datenbank an:

```bash
pnpm --filter @repo/database db:push
```

**Überprüfung**: Öffne Drizzle Studio mit `pnpm --filter @repo/database studio` — du solltest die Book-Tabelle sehen.

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
import { db, books, authors } from "@repo/database";
import { eq } from "drizzle-orm";
// db.select().from(books).innerJoin(authors, eq(books.authorId, authors.id))
```

**POST /api/books** — Neues Buch erstellen:

- Request Body: `{ title, authorId, isbn?, year? }`
- Validierung: `title` und `authorId` sind Pflichtfelder (sonst 400 zurückgeben)
- Antwort: 201 mit dem erstellten Buch

**DELETE /api/books/[id]** — Buch löschen:

- Buch anhand der ID löschen
- 404 zurückgeben, wenn das Buch nicht existiert
- 200 bei Erfolg

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

## Bonus-Aufgaben (optional)

- **Buch bearbeiten**: PUT-Endpunkt + Formular zum Aktualisieren eines bestehenden Buchs
- **Suche/Filter**: Bücher nach Titel oder Autor filtern

---

## Hilfreiche Links

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Docs](https://react.dev)

---

## Nützliche Befehle

| Befehl                                  | Beschreibung                                        |
| --------------------------------------- | --------------------------------------------------- |
| `pnpm dev`                              | Startet den Entwicklungsserver                      |
| `pnpm lint`                             | Prüft den Code mit Biome (Linting + Formatierung)   |
| `pnpm lint:fix`                         | Behebt Linting- und Formatierungsfehler automatisch |
| `pnpm format`                           | Formatiert den Code mit Biome                       |
| `pnpm --filter @repo/database db:push`  | Wendet Schema-Änderungen auf die Datenbank an       |
| `pnpm --filter @repo/database generate` | Generiert SQL-Migrationsdateien                     |
| `pnpm --filter @repo/database migrate`  | Führt Migrationen aus                               |
| `pnpm --filter @repo/database studio`   | Öffnet Drizzle Studio                               |
| `pnpm --filter @repo/database seed`     | Fügt Autor-Daten ein                                |
| `pnpm run db:start`                     | Startet PostgreSQL via Docker                       |
| `pnpm run db:stop`                      | Stoppt PostgreSQL                                   |

---

## Fehlerbehebung

**"Table does not exist"**
→ Hast du `db:push` ausgeführt? `pnpm --filter @repo/database db:push`

**"Cannot find module @repo/database"**
→ Führe `pnpm install` im Projektverzeichnis aus

**"DATABASE_URL is not set"**
→ Kopiere `.env.example` nach `.env` und füge deinen Connection String ein

**Autor-Relation Fehler**
→ Hast du die Relation zwischen `books` und `authors` in `schema.ts` definiert?
