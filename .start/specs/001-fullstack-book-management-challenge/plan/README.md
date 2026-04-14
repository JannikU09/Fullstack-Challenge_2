---
title: "Fullstack Book Management Challenge"
status: draft
version: "1.0"
---

# Implementation Plan

## Validation Checklist

### CRITICAL GATES (Must Pass)

- [x] All `[NEEDS CLARIFICATION: ...]` markers have been addressed
- [x] All specification file paths are correct and exist
- [x] Each phase follows TDD: Prime → Test → Implement → Validate
- [x] Every task has verifiable success criteria
- [x] A developer could follow this plan independently

### QUALITY CHECKS (Should Pass)

- [x] Context priming section is complete
- [x] All implementation phases are defined with linked phase files
- [x] Dependencies between phases are clear (no circular dependencies)
- [x] Parallel work is properly tagged with `[parallel: true]`
- [x] Activity hints provided for specialist selection `[activity: type]`
- [x] Every phase references relevant SDD sections
- [x] Every test references PRD acceptance criteria
- [x] Integration & E2E tests defined in final phase
- [x] Project commands match actual project setup
---

## Context Priming

*GATE: Read all files in this section before starting any implementation.*

**Specification**:
- `.start/specs/001-fullstack-book-management-challenge/requirements.md` - Product Requirements
- `.start/specs/001-fullstack-book-management-challenge/solution.md` - Solution Design

**Key Design Decisions**:
- **ADR-2**: Prisma Postgres — cloud-hosted PostgreSQL via `@prisma/adapter-pg`, not SQLite
- **ADR-4**: `prisma db push` for initial setup (Author), `prisma migrate dev` for junior (Book)
- **ADR-7**: pnpm workspaces monorepo — `apps/web` + `packages/database`, import via `@repo/database`
- **ADR-8**: Latest stable dependencies — always use most recent versions at time of implementation

**Implementation Context**:

This plan builds the **scaffold** (pre-built parts) of the coding challenge. The junior developer will later add Book-related code on top. Everything we build must work as a reference implementation and be junior-readable.

```bash
# Package Manager
pnpm install              # Install all workspace deps
pnpm setup                # Full setup (install + generate + db push + seed)

# Development
pnpm dev                  # Start Next.js dev server
pnpm lint                 # Lint via Next.js

# Database (from packages/database)
pnpm --filter database generate   # Regenerate Prisma client
pnpm --filter database migrate    # Run prisma migrate dev
pnpm --filter database studio     # Open Prisma Studio
pnpm --filter database seed       # Seed author data

# Validation
pnpm typecheck            # TypeScript type checking across workspaces
```

---

## Implementation Phases

Each phase is defined in a separate file. Tasks follow red-green-refactor: **Prime** (understand context), **Test** (red), **Implement** (green), **Validate** (refactor + verify).

> **Tracking Principle**: Track logical units that produce verifiable outcomes. The TDD cycle is the method, not separate tracked items.

- [x] [Phase 1: Monorepo Foundation + Database Package](phase-1.md)
- [x] [Phase 2: Next.js App + Reference Implementation](phase-2.md)
- [x] [Phase 3: Setup Script + German README + End-to-End Validation](phase-3.md)

---

## Plan Verification

Before this plan is ready for implementation, verify:

| Criterion | Status |
|-----------|--------|
| A developer can follow this plan without additional clarification | ✅ |
| Every task produces a verifiable deliverable | ✅ |
| All PRD acceptance criteria map to specific tasks | ✅ |
| All SDD components have implementation tasks | ✅ |
| Dependencies are explicit with no circular references | ✅ |
| Parallel opportunities are marked with `[parallel: true]` | ✅ |
| Each task has specification references `[ref: ...]` | ✅ |
| Project commands in Context Priming are accurate | ✅ |
| All phase files exist and are linked from this manifest as `[Phase N: Title](phase-N.md)` | ✅ |
