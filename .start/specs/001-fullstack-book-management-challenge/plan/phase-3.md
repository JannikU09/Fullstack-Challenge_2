---
title: "Phase 3: Setup Script + German README + End-to-End Validation"
status: completed
version: "1.0"
phase: 3
---

# Phase 3: Setup Script + German README + End-to-End Validation

## Phase Context

**GATE**: Read all referenced files before starting this phase.

**Specification References**:
- `[ref: SDD/Project Commands]` — All pnpm scripts
- `[ref: SDD/Deployment View]` — Local dev setup requirements
- `[ref: SDD/Implementation Gotchas]` — Pitfalls to document in README
- `[ref: PRD/Feature 1]` — Pre-Built Project Scaffold (setup script)
- `[ref: PRD/Feature 6]` — German README with step-by-step guide
- `[ref: PRD/Success Metrics]` — Time to First Success < 15 minutes, Independence < 3 questions

**Key Decisions**:
- `pnpm setup` = `pnpm install && pnpm --filter database generate && pnpm --filter database db:push && pnpm --filter database seed`
- README in German with 3 numbered task sections (Migration, API, Frontend)
- Each task includes: what to do, which file to create/edit, expected outcome, how to verify
- Troubleshooting section for common errors
- Junior creates free Prisma Postgres DB as pre-step (guided with exact instructions)

**Dependencies**:
- Phase 1 complete (database package)
- Phase 2 complete (Next.js app with all pre-built features)

---

## Tasks

Ties everything together with a one-command setup, comprehensive German documentation, and full end-to-end validation of the challenge experience.

- [x] **T3.1 Setup Script** `[activity: build-platform]`

  1. Prime: Read SDD/Project Commands for all script definitions, SDD/ADR-4 for db push vs migrate strategy `[ref: SDD/Project Commands]` `[ref: SDD/ADR-4]`
  2. Test: On a clean clone (after `.env` is configured), `pnpm setup` installs all deps, generates Prisma client, pushes Author schema to cloud DB, seeds 5 authors — all in one command
  3. Implement:
     - Add `"setup"` script to root `package.json`: chains install → generate → db:push → seed
     - Ensure `packages/database` scripts load `.env` from the project root (configure `dotenv` path or use Prisma's `--schema` flag)
     - Ensure `db:push` uses `prisma db push` (not `migrate dev`) for the initial Author schema
     - Test idempotency: running `pnpm setup` twice should not fail or duplicate data
  4. Validate: Fresh clone + `.env` config + `pnpm setup` → 5 authors in Prisma Postgres; `pnpm dev` shows working app
  5. Success: Single-command setup works end-to-end `[ref: PRD/Feature 1 — AC: npm run setup bootstraps everything]`

- [x] **T3.2 German README — Project Overview + Setup** `[activity: frontend-ui]`

  1. Prime: Read PRD/Feature 6 for README requirements, SDD/Deployment View for setup prerequisites, SDD/Implementation Gotchas for common pitfalls `[ref: PRD/Feature 6]` `[ref: SDD/Deployment View]` `[ref: SDD/Implementation Gotchas]`
  2. Test: A developer reading only the README can: install pnpm, create a Prisma Postgres DB, configure `.env`, run `pnpm setup`, and see a working app in < 15 minutes
  3. Implement:
     - Write `README.md` in German with sections:
       - **Projektübersicht**: What this challenge is and what the junior will build
       - **Voraussetzungen**: Node.js 18+, pnpm (`npm install -g pnpm`), free Prisma account
       - **Datenbank einrichten**: Step-by-step instructions to create a free Prisma Postgres database (`npx prisma init --db`), copy the connection string to `.env`
       - **Projekt starten**: `pnpm setup` → `pnpm dev` → open browser
       - **Projekt Struktur**: Brief explanation of monorepo layout (`apps/web`, `packages/database`)
  4. Validate: Instructions are clear, complete, and in correct German
  5. Success: Junior can set up the project independently using only the README `[ref: PRD/Feature 6 — AC: setup instructions]` `[ref: PRD/Success Metrics — Time to First Success < 15 min]`

- [x] **T3.3 German README — Challenge Tasks** `[activity: frontend-ui]`

  1. Prime: Read PRD/Features 3-5 for task acceptance criteria, SDD/Data Storage for Book schema, SDD/Expected Book API Route for API pattern `[ref: PRD/Feature 3]` `[ref: PRD/Feature 4]` `[ref: PRD/Feature 5]` `[ref: SDD/Expected Book API Route]`
  2. Test: Each task section tells the junior: what to do, which file(s) to create/edit (exact paths), expected outcome, and how to verify the result
  3. Implement:
     - **Aufgabe 1: Datenbank-Migration** (Book Model)
       - Explain: open `packages/database/prisma/schema.prisma`, add `Book` model with fields (title, isbn?, year?, authorId), add `books Book[]` to Author model
       - Verify: `pnpm --filter database migrate` succeeds, `pnpm --filter database studio` shows Book table
     - **Aufgabe 2: API-Endpunkte** (Book Routes)
       - Explain: create `apps/web/src/app/api/books/route.ts` (GET + POST) and `apps/web/src/app/api/books/[id]/route.ts` (DELETE)
       - Reference: look at `apps/web/src/app/api/authors/route.ts` as example
       - Verify: test via Swagger UI at `/api-doc` or curl
     - **Aufgabe 3: Frontend** (Books Page)
       - Explain: create `apps/web/src/app/books/page.tsx` with book list, add form, delete button
       - Reference: uses `"use client"`, `useState`, `useEffect`, `fetch` — see `/api-doc` page as `"use client"` example
       - Verify: books page works in browser, can add and delete books
  4. Validate: Tasks are sequential, each builds on previous, file paths are correct
  5. Success: 3 clear task sections with exact file paths and verification steps `[ref: PRD/Feature 6 — AC: three numbered task sections]`

- [x] **T3.4 German README — Bonus Tasks + Troubleshooting** `[activity: frontend-ui]`

  1. Prime: Read PRD/Should Have and Could Have features, SDD/Implementation Gotchas `[ref: PRD/Feature 7]` `[ref: PRD/Feature 8]` `[ref: SDD/Implementation Gotchas]`
  2. Test: Troubleshooting section covers most likely junior errors; bonus tasks are clearly optional
  3. Implement:
     - **Bonus-Aufgaben** (optional):
       - Edit/Update: PUT endpoint + form pre-fill
       - Search/Filter: Client-side filtering by title
     - **Hilfreiche Links**: Links to Prisma docs, Next.js Route Handlers docs, React docs
     - **Fehlerbehebung** (Troubleshooting):
       - "Table does not exist" → run migration
       - "Cannot find module @repo/database" → run `pnpm install` from root
       - "prisma generate" needed after schema changes
       - `.env` not found → copy `.env.example` to `.env` and add connection string
       - Author relation error → add `books Book[]` to Author model
  4. Validate: Troubleshooting covers SDD/Implementation Gotchas items
  5. Success: Complete README with bonus tasks and troubleshooting `[ref: PRD/Feature 6 — AC: troubleshooting section]`

- [x] **T3.5 End-to-End Challenge Validation** `[activity: validate]`

  Simulate the full junior developer experience from scratch:

  1. **Setup validation** (pre-built):
     - Fresh clone of repo
     - Configure `.env` with a Prisma Postgres connection string
     - Run `pnpm setup` — verify it completes without errors
     - Run `pnpm dev` — verify app starts on port 3000
     - Verify landing page loads with navigation
     - Verify `GET /api/authors` returns 5 authors
     - Verify `/api-doc` renders Swagger UI with all endpoints

  2. **Task 1 validation** (simulate junior):
     - Add Book model to `packages/database/prisma/schema.prisma`
     - Add `books Book[]` to Author model
     - Run `pnpm --filter database migrate` — verify migration succeeds
     - Run `pnpm --filter database studio` — verify Book table exists with correct columns

  3. **Task 2 validation** (simulate junior):
     - Create `apps/web/src/app/api/books/route.ts` with GET and POST
     - Create `apps/web/src/app/api/books/[id]/route.ts` with DELETE
     - Test via Swagger UI: create a book, list books, delete a book
     - Verify error handling: POST without title returns 400, DELETE non-existent returns 404

  4. **Task 3 validation** (simulate junior):
     - Create `apps/web/src/app/books/page.tsx` with list, form, and delete
     - Verify: page loads, shows books, can add new book, can delete book
     - Verify: author dropdown populated from API, empty state shows message

  5. Success:
     - `[ref: PRD/Feature 1 — all ACs]` — Setup works end-to-end
     - `[ref: PRD/Feature 2 — all ACs]` — Author reference implementation complete
     - `[ref: PRD/Feature 3 — all ACs]` — Migration workflow works
     - `[ref: PRD/Feature 4 — all ACs]` — API endpoints work correctly
     - `[ref: PRD/Feature 5 — all ACs]` — Frontend displays and manages books
     - `[ref: PRD/Feature 6 — all ACs]` — README guides through entire process
