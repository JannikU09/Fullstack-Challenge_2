# Specification: 001-fullstack-book-management-challenge

## Status

| Field | Value |
|-------|-------|
| **Created** | 2026-04-13 |
| **Current Phase** | Ready |
| **Last Updated** | 2026-04-13 |

## Documents

| Document | Status | Notes |
|----------|--------|-------|
| requirements.md | completed | PRD written with full acceptance criteria |
| solution.md | completed | SDD with 8 ADRs, pnpm monorepo, Prisma Postgres, OpenAPI/Swagger |
| plan/ | completed | 3 phases, 14 tasks — monorepo foundation, Next.js app, setup + README + validation |

**Status values**: `pending` | `in_progress` | `completed` | `skipped`

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-13 | Spec created | Fullstack book management challenge for junior developers |
| 2026-04-13 | PRD completed | Full requirements with 6 must-have features, Gherkin acceptance criteria, MoSCoW prioritization |
| 2026-04-13 | Standard mode selected | Simple scope, single domain — no need for Agent Team |
| 2026-04-13 | SDD completed | Architecture: pnpm monorepo (apps/web + packages/database), Prisma Postgres, Swagger UI, 8 confirmed ADRs |
| 2026-04-13 | Switched from SQLite to Prisma Postgres | User requested cloud-hosted DB per Prisma Postgres quickstart |
| 2026-04-13 | Switched to pnpm monorepo | User requested proper monorepo structure with pnpm workspaces |
| 2026-04-13 | Latest dependencies required | User specified using latest stable versions of all packages |
| 2026-04-13 | PLAN completed | 3 phases, 14 tasks covering scaffold build + validation |
| 2026-04-13 | Specification ready for implementation | PRD + SDD + PLAN all complete |

## Context

A coding challenge for junior developers to build a fullstack book management app using Next.js and Prisma in a monorepo. The junior dev writes the Book migration, API endpoint logic, and frontend. Books have a relation to Author. README guide in German. Designed to be very simple to start.

---
*This file is managed by the specify-meta skill.*
