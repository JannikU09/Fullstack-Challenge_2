---
title: "Phase 1: Monorepo Foundation + Database Package"
status: completed
version: "1.0"
phase: 1
---

# Phase 1: Monorepo Foundation + Database Package

## Phase Context

**GATE**: Read all referenced files before starting this phase.

**Specification References**:
- `[ref: SDD/Constraints; CON-5, CON-7]` — pnpm workspaces monorepo
- `[ref: SDD/Directory Map]` — Full project structure
- `[ref: SDD/Data Storage — Prisma Schema]` — Schema definition
- `[ref: SDD/ADR-2]` — Prisma Postgres
- `[ref: SDD/ADR-7]` — pnpm workspaces
- `[ref: SDD/ADR-8]` — Latest dependencies
- `[ref: SDD/Prisma Client Singleton with Adapter]` — Client pattern with PrismaPg

**Key Decisions**:
- pnpm workspaces with `apps/*` and `packages/*` globs
- PostgreSQL provider with `prisma-client` generator (ESM-first, custom output to `../generated/prisma`)
- `@prisma/adapter-pg` driver adapter in client singleton
- Auto-increment integer IDs for simplicity
- Seed uses `upsert` for idempotency
- Package name `@repo/database` for workspace imports

**Dependencies**:
- None — this is the first phase

---

## Tasks

Establishes the monorepo structure and the shared database package that both the pre-built Author features and the junior's Book implementation will use.

- [x] **T1.1 Monorepo Root Configuration** `[activity: build-platform]`

  1. Prime: Read SDD/Directory Map for full structure, SDD/ADR-7 for pnpm workspaces decision `[ref: SDD/Directory Map]` `[ref: SDD/ADR-7]`
  2. Test: `pnpm install` succeeds; workspace resolution works between `apps/web` and `packages/database`
  3. Implement:
     - Create root `package.json` with `"private": true`, workspace scripts (`setup`, `dev`, `lint`, `typecheck`), `"packageManager"` field for pnpm
     - Create `pnpm-workspace.yaml` with `packages: ["apps/*", "packages/*"]`
     - Create root `tsconfig.json` with shared TypeScript config (strict mode, ESNext target)
     - Create `.gitignore` (node_modules, .env, generated, prisma/dev.db, .next)
     - Create `.env.example` with `DATABASE_URL="prisma+postgres://..."` placeholder
  4. Validate: `pnpm install` runs without errors; directory structure matches SDD
  5. Success: Monorepo root with pnpm workspaces is functional `[ref: PRD/Feature 1 — Pre-Built Project Scaffold]`

- [x] **T1.2 Database Package — Prisma Schema + Author Model** `[activity: domain-modeling]`

  1. Prime: Read SDD/Data Storage for schema, SDD/Seed Data for author list, Prisma Postgres quickstart `[ref: SDD/Data Storage — Prisma Schema]` `[ref: SDD/Seed Data]`
  2. Test: `npx prisma validate` passes; `npx prisma generate` produces client in `generated/prisma`; schema has Author model with `id` (Int, autoincrement) and `name` (String)
  3. Implement:
     - Create `packages/database/package.json` with name `@repo/database`, dependencies (`prisma`, `@prisma/client`, `@prisma/adapter-pg`, `dotenv`), scripts (`generate`, `migrate`, `studio`, `seed`, `db:push`)
     - Create `packages/database/tsconfig.json`
     - Create `packages/database/prisma/schema.prisma` with PostgreSQL datasource, `prisma-client` generator with custom output, Author model (id, name only — NO `books Book[]` yet)
  4. Validate: `npx prisma validate` passes; `npx prisma generate` creates `generated/prisma/` directory with typed client
  5. Success: Author model defined, Prisma client generated `[ref: PRD/Feature 2 — Author Reference Implementation]` `[ref: SDD/Data Storage — Prisma Schema]`

- [x] **T1.3 Database Package — Prisma Client Singleton** `[activity: domain-modeling]`

  1. Prime: Read SDD/Prisma Client Singleton with Adapter example, understand PrismaPg adapter pattern `[ref: SDD/Prisma Client Singleton with Adapter]`
  2. Test: Importing `{ prisma }` from `@repo/database` resolves correctly; client connects via PrismaPg adapter
  3. Implement:
     - Create `packages/database/src/client.ts` with PrismaPg adapter singleton (reads `DATABASE_URL` from env)
     - Create `packages/database/src/index.ts` re-exporting `prisma` client and generated types
     - Configure `package.json` exports field to expose `@repo/database` correctly
  4. Validate: TypeScript compiles; exports resolve in consuming packages
  5. Success: Shared Prisma client singleton available as `@repo/database` `[ref: SDD/Prisma Client Singleton with Adapter]`

- [x] **T1.4 Database Package — Author Seed Script** `[activity: domain-modeling]`

  1. Prime: Read SDD/Seed Data for author list and idempotency requirement `[ref: SDD/Seed Data]`
  2. Test: Running seed inserts 5 authors; running seed again doesn't create duplicates (idempotent)
  3. Implement:
     - Create `packages/database/seed.ts` importing prisma from `./src/client`
     - Seed 5 authors (J.K. Rowling, George Orwell, Jane Austen, Franz Kafka, Hermann Hesse) using `upsert`
     - Configure `prisma.seed` in `packages/database/package.json` to run seed with `tsx`
  4. Validate: `pnpm --filter database seed` inserts authors; re-running doesn't duplicate
  5. Success: 5 authors seeded idempotently `[ref: PRD/Feature 2 — AC: pre-seeded data]`

- [x] **T1.5 Phase Validation** `[activity: validate]`

  - Run `pnpm install` from root — all workspaces resolve
  - Run `npx prisma validate` in `packages/database` — schema is valid
  - Run `npx prisma generate` — client is generated to `generated/prisma`
  - TypeScript compiles across all packages
  - Directory structure matches SDD/Directory Map
