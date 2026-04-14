---
title: "Phase 2: Next.js App + Reference Implementation"
status: completed
version: "1.0"
phase: 2
---

# Phase 2: Next.js App + Reference Implementation

## Phase Context

**GATE**: Read all referenced files before starting this phase.

**Specification References**:
- `[ref: SDD/Directory Map]` — apps/web structure
- `[ref: SDD/ADR-1]` — App Router with Route Handlers
- `[ref: SDD/ADR-3]` — Author as reference implementation
- `[ref: SDD/ADR-6]` — OpenAPI Spec + Swagger UI
- `[ref: SDD/Author API Route]` — GET /api/authors example
- `[ref: SDD/Internal API — OpenAPI Specification]` — Full OpenAPI spec
- `[ref: SDD/Swagger UI Integration]` — swagger-ui-react setup
- `[ref: SDD/User Interface & UX]` — Navigation, layout, wireframe

**Key Decisions**:
- Next.js App Router with `app/` directory convention
- `transpilePackages: ["@repo/database"]` in next.config.ts for monorepo support
- `swagger-ui-react` for interactive API docs at `/api-doc`
- Simple navigation: Home (`/`), Bücher (`/books`), API Docs (`/api-doc`)
- Landing page explains the challenge with links to tasks
- Author route is GET-only (simple reference for junior to copy)

**Dependencies**:
- Phase 1 complete (database package with Prisma client and Author model)

---

## Tasks

Establishes the Next.js application with working reference features (Author API, Swagger UI, app shell) that the junior developer will study and extend.

- [x] **T2.1 Next.js App Scaffold** `[activity: build-feature]`

  1. Prime: Read SDD/Directory Map for `apps/web` structure, SDD/ADR-1 for App Router decision `[ref: SDD/Directory Map]` `[ref: SDD/ADR-1]`
  2. Test: `pnpm dev` starts Next.js on port 3000; TypeScript compiles; `@repo/database` import resolves
  3. Implement:
     - Create `apps/web/package.json` with Next.js, React, TypeScript deps + dependency on `@repo/database` via `workspace:*`
     - Create `apps/web/tsconfig.json` extending root config, with `@/*` path alias to `./src/*`
     - Create `apps/web/next.config.ts` with `transpilePackages: ["@repo/database"]`
     - Wire root `pnpm dev` script to run `next dev` in `apps/web`
  4. Validate: `pnpm dev` starts successfully; no TypeScript errors
  5. Success: Next.js dev server runs with monorepo package resolution `[ref: PRD/Feature 1 — AC: app starts in browser]`

- [x] **T2.2 App Shell — Layout + Landing Page** `[activity: frontend-ui]`

  1. Prime: Read SDD/User Interface & UX for navigation structure and wireframe `[ref: SDD/User Interface & UX]`
  2. Test: Root page renders with navigation links (Home, Bücher, API Docs); navigation links point to correct routes
  3. Implement:
     - Create `apps/web/src/app/layout.tsx` — root layout with `<html>`, `<body>`, simple top navigation bar with links to `/`, `/books`, `/api-doc`
     - Create `apps/web/src/app/page.tsx` — landing page with challenge overview (brief German intro explaining the 3 tasks: Migration, API, Frontend)
     - Add minimal global CSS for readable layout (max-width centered container, basic typography)
  4. Validate: Page renders in browser; navigation links visible; responsive basic layout
  5. Success: Working landing page with navigation `[ref: PRD/Feature 1 — AC: working landing page]` `[ref: SDD/User Interface & UX — Information Architecture]`

- [x] **T2.3 Author API Route (Reference Implementation)** `[activity: backend-api]`

  1. Prime: Read SDD/Author API Route example for exact pattern, understand `@repo/database` import `[ref: SDD/Author API Route]` `[ref: SDD/ADR-3]`
  2. Test: `GET /api/authors` returns JSON array; response includes `id` and `name` fields; status 200
  3. Implement:
     - Create `apps/web/src/app/api/authors/route.ts`
     - Export `GET` function that calls `prisma.author.findMany()` via `@repo/database`
     - Return `NextResponse.json(authors)`
  4. Validate: `curl http://localhost:3000/api/authors` returns seeded authors as JSON array
  5. Success: Working Author API endpoint that serves as reference pattern `[ref: PRD/Feature 2 — AC: GET /api/authors returns seeded authors]`

- [x] **T2.4 OpenAPI Specification Module** `[activity: backend-api]` `[parallel: true]`

  1. Prime: Read SDD/Internal API — OpenAPI Specification for complete spec `[ref: SDD/Internal API — OpenAPI Specification]`
  2. Test: Importing `openApiSpec` from `@/lib/swagger` returns a valid OpenAPI 3.0 object with all paths defined
  3. Implement:
     - Create `apps/web/src/lib/swagger.ts` exporting `openApiSpec` object
     - Include all paths: `/api/authors` (GET), `/api/books` (GET, POST), `/api/books/{id}` (GET, PUT, DELETE)
     - Include all component schemas: Author, Book, BookWithAuthor, CreateBookInput, UpdateBookInput, ErrorResponse
     - German descriptions for all endpoints and schemas
  4. Validate: Object has correct OpenAPI 3.0 structure; all paths and schemas present
  5. Success: Complete OpenAPI spec describing expected API contract `[ref: SDD/Internal API — OpenAPI Specification]`

- [x] **T2.5 Swagger UI Page** `[activity: frontend-ui]`

  1. Prime: Read SDD/Swagger UI Integration and Swagger UI Page example `[ref: SDD/Swagger UI Integration]` `[ref: SDD/Swagger UI Page]`
  2. Test: Navigating to `/api-doc` renders Swagger UI with all endpoints listed; endpoints are interactive (can send requests)
  3. Implement:
     - Add `swagger-ui-react` and `@types/swagger-ui-react` as dependencies to `apps/web`
     - Create `apps/web/src/app/api-doc/page.tsx` as a `"use client"` component
     - Import `SwaggerUI` from `swagger-ui-react`, import CSS, render with `spec={openApiSpec}`
  4. Validate: `/api-doc` page loads in browser; Swagger UI renders all endpoints; can test GET /api/authors from UI
  5. Success: Interactive API documentation browsable at `/api-doc` `[ref: PRD/Feature 6 — AC: API docs viewable]` `[ref: SDD/ADR-6]`

- [x] **T2.6 Phase Validation** `[activity: validate]`

  - `pnpm dev` starts and shows landing page with navigation
  - GET `/api/authors` returns 5 authors as JSON
  - `/api-doc` renders Swagger UI with all expected endpoints
  - Navigation between Home, Bücher (empty/404 is OK), and API Docs works
  - TypeScript compiles; lint passes
  - All pre-built code is clean, readable, and serves as a reference pattern for a junior developer
