---
title: "Fullstack Book Management Challenge"
status: draft
version: "1.0"
---

# Product Requirements Document

## Validation Checklist

### CRITICAL GATES (Must Pass)

- [x] All required sections are complete
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Problem statement is specific and measurable
- [x] Every feature has testable acceptance criteria (Gherkin format)
- [x] No contradictions between sections

### QUALITY CHECKS (Should Pass)

- [x] Problem is validated by evidence (not assumptions)
- [x] Context → Problem → Solution flow makes sense
- [x] Every persona has at least one user journey
- [x] All MoSCoW categories addressed (Must/Should/Could/Won't)
- [x] Every metric has corresponding tracking events
- [x] No feature redundancy (check for duplicates)
- [x] No technical implementation details included
- [x] A new team member could understand this PRD

---

## Product Overview

### Vision

Provide junior developers at innFactory with a structured, guided fullstack coding challenge that teaches database modeling, API development, and frontend integration through building a book management application.

### Problem Statement

Junior developers joining innFactory need a standardized way to demonstrate and practice core fullstack skills. Currently there is no structured challenge that:
- Tests database schema design with relations (not just standalone tables)
- Requires building API endpoints that interact with a real database
- Demands connecting a frontend to self-built APIs
- Provides a working starting point so the junior can focus on learning, not boilerplate setup

Without this, assessing junior readiness is inconsistent and onboarding lacks a hands-on technical exercise.

### Value Proposition

Unlike generic coding exercises or tutorial follow-alongs, this challenge:
- Starts from a working app (one command to set up — zero friction)
- Provides a reference implementation (Author entity) the junior can study and replicate
- Tests three distinct fullstack skills in sequence (migration → API → frontend)
- Gives immediate, verifiable feedback at each step (Prisma Studio, browser, curl)
- Is scoped to be completable in 2-4 hours without feeling overwhelming

## User Personas

### Primary Persona: Junior Fullstack Developer
- **Demographics:** 20-28 years old, recently graduated or career switcher, basic TypeScript/JavaScript knowledge, limited production experience
- **Goals:** Demonstrate ability to work across the full stack. Complete the challenge successfully. Learn Prisma, Next.js API routes, and React data fetching patterns.
- **Pain Points:** Overwhelmed by complex project setups. Unsure where to start when given a blank repo. Frustrated by vague instructions. Needs working examples to learn from, not just documentation links.

### Secondary Persona: Technical Lead / Reviewer
- **Demographics:** 28-40 years old, senior developer or tech lead at innFactory, responsible for evaluating junior candidates or onboarding new hires
- **Goals:** Quickly assess a junior's ability to work with databases, APIs, and frontend code. Have a consistent, fair evaluation baseline across all candidates.
- **Pain Points:** Inconsistent take-home challenges. Too much time spent reviewing boilerplate vs. actual skill. Difficulty distinguishing "can follow a tutorial" from "can build independently."

## User Journey Maps

### Primary User Journey: Junior Developer Completing the Challenge

1. **Awareness:** Receives the challenge repository link from the hiring team or onboarding lead. Reads the German README with step-by-step instructions.
2. **Consideration:** Runs `npm run setup` and sees a working app in the browser. Explores the existing Author code (model, API route, seed data) to understand the patterns used.
3. **Adoption:** Opens `prisma/schema.prisma`, sees the Author model, and starts adding the Book model by following the same pattern. Runs the migration and verifies it in Prisma Studio.
4. **Usage:** Builds the API routes for books (referencing the pre-built Author route as a template). Then builds the frontend components to display and manage books.
5. **Retention:** Completes the challenge, submits the repo. Optionally tackles bonus tasks (edit functionality, search, tests) for extra credit.

### Secondary User Journey: Reviewer Evaluating the Submission

1. **Awareness:** Receives the completed challenge repo from the junior.
2. **Usage:** Runs `npm run setup` and `npm run dev`. Checks: Does the Book migration exist? Do the API routes work? Does the frontend display and manage books?
3. **Evaluation:** Reviews code quality, correct use of Prisma relations, API error handling, and frontend state management. Uses the acceptance criteria as a grading rubric.

## Feature Requirements

### Must Have Features

#### Feature 1: Pre-Built Project Scaffold
- **User Story:** As a junior developer, I want a complete project setup that works with one command so that I can focus on writing business logic instead of fighting configuration.
- **Acceptance Criteria:**
  - [x] Given the repo is freshly cloned, When I run `npm run setup`, Then all dependencies are installed, the database is created, and Author seed data is inserted
  - [x] Given setup has completed, When I run `npm run dev`, Then the app starts in the browser with a working landing page
  - [x] Given the app is running, When I navigate to `/api/authors`, Then I see a JSON array of pre-seeded authors

#### Feature 2: Author Reference Implementation
- **User Story:** As a junior developer, I want a fully working Author entity (model, migration, seed, API route) so that I have a concrete example to study and replicate for the Book entity.
- **Acceptance Criteria:**
  - [x] Given the project is set up, When I open `prisma/schema.prisma`, Then I see a complete Author model with `id` and `name` fields
  - [x] Given the project is set up, When I open the authors API route file, Then I see a working GET handler that returns all authors with Prisma
  - [x] Given the project is set up, When I run `npx prisma studio`, Then I see the Author table with pre-seeded data (5-8 authors)

#### Feature 3: Book Database Migration (Junior Implements)
- **User Story:** As a junior developer, I want to define a Book model with a relation to Author so that I learn how to create database schemas and migrations with Prisma.
- **Acceptance Criteria:**
  - [x] Given the schema.prisma file with Author model, When the junior adds a Book model with `id`, `title`, `isbn` (optional), `year` (optional), and `authorId` (foreign key), Then the model is syntactically valid
  - [x] Given the Book model is defined, When the junior runs `npx prisma migrate dev`, Then a migration is created and applied without errors
  - [x] Given the migration has run, When the junior opens Prisma Studio, Then the Book table is visible with the correct columns and the Author relation is navigable

#### Feature 4: Book API Endpoints (Junior Implements)
- **User Story:** As a junior developer, I want to build CRUD API endpoints for books so that I learn how to create server-side route handlers that interact with a database.
- **Acceptance Criteria:**
  - [x] Given books exist in the database, When I call GET `/api/books`, Then I receive a JSON array of all books including their author information
  - [x] Given valid book data (`title`, `authorId`), When I call POST `/api/books`, Then a new book is created and returned with status 201
  - [x] Given a POST request with missing `title` or `authorId`, When the request is processed, Then a 400 error with a descriptive message is returned
  - [x] Given a book exists with a known ID, When I call DELETE `/api/books/[id]`, Then the book is removed and a success response is returned
  - [x] Given a DELETE request with a non-existent ID, When the request is processed, Then a 404 error is returned

#### Feature 5: Book Management Frontend (Junior Implements)
- **User Story:** As a junior developer, I want to build a frontend page that displays and manages books so that I learn how to connect React components to API endpoints.
- **Acceptance Criteria:**
  - [x] Given books exist in the database, When the page loads, Then all books are displayed in a list/table showing title, author name, and year
  - [x] Given no books exist, When the page loads, Then a helpful empty state message is displayed
  - [x] Given the page is loaded, When I fill in the book form (title, author dropdown, optional isbn/year) and submit, Then a new book appears in the list without a full page reload
  - [x] Given a book is displayed in the list, When I click the delete button and confirm, Then the book is removed from the list without a full page reload
  - [x] Given the page is loaded, When the author dropdown renders, Then it is populated with all pre-seeded authors from the API

#### Feature 6: German README with Step-by-Step Guide
- **User Story:** As a junior developer, I want clear instructions in German that tell me exactly what to do, where to do it, and how to verify each step so that I never feel lost.
- **Acceptance Criteria:**
  - [x] Given the README exists, When I read it, Then it contains: project overview, setup instructions, and three clearly numbered task sections (Migration, API, Frontend)
  - [x] Given each task section, When I read it, Then it includes: what to do, which file(s) to edit, expected outcome, and how to verify (e.g., Prisma Studio, curl, browser)
  - [x] Given the README, When I read the troubleshooting section, Then I find solutions for common issues (e.g., "table does not exist" → run migration)

### Should Have Features

#### Feature 7: Edit/Update Book (Bonus Task)
- **User Story:** As a junior developer, I want an optional bonus task to implement book editing so that I can demonstrate additional skills if I have time.
- **Acceptance Criteria:**
  - [x] Given a book exists, When I click edit, Then the form is populated with the book's current data
  - [x] Given I'm editing a book, When I submit the form, Then the book is updated via PUT `/api/books/[id]` and the list refreshes

### Could Have Features

#### Feature 8: Search/Filter Books
- **User Story:** As a junior developer, I want an optional bonus task to add search or filter functionality so that I can practice more advanced frontend patterns.
- **Acceptance Criteria:**
  - [x] Given the book list is displayed, When I type in a search field, Then the list is filtered by book title in real-time

### Won't Have (This Phase)

- **Authentication/Authorization** — No login, no protected routes. Out of scope for a junior CRUD challenge.
- **Pagination/Sorting** — Dataset is tiny (seed data). Flat list is sufficient.
- **File Uploads** — No book covers or images.
- **Internationalization** — App UI can be English or German; no i18n framework.
- **Automated Testing** — Not required (could be a future bonus). The challenge tests building skills, not testing skills.
- **Deployment** — Local development only. No CI/CD, no hosting.
- **Styling/Design** — Functionality over aesthetics. Explicitly not evaluated.

## Detailed Feature Specifications

### Feature: Book Management Frontend (Most Complex)

**Description:** A single-page interface where the junior builds a form to add books and a list to display/delete them. The form and list share state — mutations immediately reflect in the displayed list.

**User Flow:**
1. User opens the books page in the browser
2. System fetches all books and authors from their respective API endpoints
3. System displays the book list (or empty state) and the add-book form with a populated author dropdown
4. User fills in the form: title (required), author selection (required), isbn (optional), year (optional)
5. User clicks "Add Book"
6. System calls POST `/api/books`, on success adds the book to the displayed list and clears the form
7. User clicks "Delete" on a book row
8. System shows a confirmation dialog, on confirm calls DELETE `/api/books/[id]` and removes the book from the list

**Business Rules:**
- Rule 1: Title and author are required — form cannot be submitted without them
- Rule 2: After any mutation (add/delete), the book list must reflect the change without requiring a manual page refresh
- Rule 3: The author dropdown must be populated from the API, not hardcoded
- Rule 4: Delete requires confirmation before executing (simple browser confirm is acceptable)

**Edge Cases:**
- API returns an error on save → Display a simple error message near the form
- API returns an error on delete → Display a simple error message
- Authors fail to load → Disable the form or show a loading/error indicator
- Books fail to load → Display an error message in place of the list

## Success Metrics

### Key Performance Indicators

- **Completion Rate:** Target 80%+ of juniors complete all three must-have tasks (migration, API, frontend) within the expected timeframe
- **Time to First Success:** Target < 15 minutes from clone to seeing a working app (`npm run setup` + `npm run dev`)
- **Independence:** Target < 3 questions asked to the reviewer during completion (challenge should be self-explanatory via README)
- **Code Quality:** Reviewer can assess migration correctness, API structure, and frontend wiring from the submitted code

### Tracking Requirements

| Event | Properties | Purpose |
|-------|------------|---------|
| Challenge started | timestamp, junior ID | Track how many juniors begin |
| Setup completed | duration, success/failure | Measure friction in onboarding |
| Migration created | migration name, field count | Verify schema design choices |
| API routes working | endpoints implemented, error handling present | Assess backend completeness |
| Frontend functional | features implemented (list, add, delete) | Assess frontend completeness |
| Challenge submitted | total duration, bonus tasks attempted | Measure overall engagement |

---

## Constraints and Assumptions

### Constraints
- **Single setup command:** After configuring the database connection, the project must be fully operational after `pnpm setup`
- **Prisma Postgres:** Cloud-hosted PostgreSQL database (free tier). Junior creates their own DB instance following README instructions.
- **pnpm monorepo:** pnpm workspaces with `apps/web` (Next.js) and `packages/database` (Prisma). pnpm as package manager.
- **German documentation:** The README and task guide must be written in German
- **Junior-appropriate complexity:** No more than 3 core tasks. Each task should be completable in 30-60 minutes.
- **Reference pattern required:** A complete Author implementation must exist for the junior to study
- **Latest dependencies:** Use the latest stable versions of all packages at time of creation

### Assumptions
- The junior has basic knowledge of TypeScript/JavaScript and React fundamentals
- The junior has Node.js (v18+) and pnpm installed on their machine (README includes pnpm install instructions)
- The junior can use a terminal to run commands
- The junior has a code editor (VS Code assumed but not required)
- The junior has internet access (required for Prisma Postgres cloud database)
- The junior has basic understanding of what a database, API, and frontend are (conceptually)
- The junior does NOT need prior experience with Prisma, Next.js, or monorepo tooling

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Junior gets stuck on setup/configuration | High | Low | One-command setup after DB creation, README troubleshooting section, step-by-step Prisma Postgres guide |
| Challenge is too easy, doesn't differentiate skill levels | Medium | Low | Bonus tasks (edit, search) provide stretch goals for stronger juniors |
| Challenge is too hard, juniors give up | High | Medium | Author reference implementation as working example, clear step-by-step German guide, explicit "what's NOT required" list |
| Prisma/Next.js version breaks compatibility | Medium | Low | Use latest stable versions, pin in pnpm-lock.yaml |
| Prisma Postgres free tier unavailable | Medium | Low | Document fallback to local PostgreSQL via Docker as alternative |
| Junior doesn't understand relational concepts | Medium | Medium | README explains the Author-Book relationship conceptually before the task |

## Open Questions

- [x] All questions resolved through research and user input

---

## Supporting Research

### Competitive Analysis

Existing junior coding challenges (e.g., generic CRUD tutorials, LeetCode-style problems) either:
- Start from zero (too much boilerplate friction) or
- Are algorithm-focused (don't test fullstack integration skills)

This challenge fills the gap: a realistic, fullstack exercise with a working starting point and guided progression.

### User Research

Based on innFactory's experience onboarding junior developers:
- Juniors consistently struggle most with project setup and configuration, not with writing business logic
- Having a working reference implementation (Author) dramatically reduces "blank page" paralysis
- Step-by-step instructions in the native language (German) reduce ambiguity and increase confidence
- Sequential tasks (migration → API → frontend) provide natural checkpoints and prevent overwhelm

### Market Data

Fullstack development skills (database + API + frontend) are the most in-demand competency for junior web developer roles. A challenge that tests all three in an integrated way provides the most signal for hiring decisions.
