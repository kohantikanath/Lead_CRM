# Lead CRM

Mini Lead CRM for the Superleap frontend intern assessment. The app implements the required Level 1 flows and a Level 2 Kanban board: browse, search, filter, create, view, edit, delete, and move leads through valid pipeline states.

## Project Structure

```txt
Lead_CRM/
  frontend/              # Next.js + TypeScript + Tailwind UI
  backend/
    api/                 # Provided Express API for local assessment data
```

## Tech Stack

**Frontend:** Next.js App Router with TypeScript. I chose Next.js because the assessment allows React/Next.js, and App Router gives clean deep-linkable routes for `/leads`, `/leads/new`, `/leads/[id]`, and `/leads/[id]/edit`.

**Styling:** Tailwind CSS. It keeps the UI implementation lightweight and makes it easy to tune spacing, table density, focus states, and responsive behavior without adding a heavy component library.

**State:** No global state library. Server data is fetched through a small API layer, URL state is used for search/filter, and local component state is used for forms, confirmation dialogs, and async button states.

**API:** Provided Express mock API under `backend/api`. The frontend integrates with it through `NEXT_PUBLIC_API_URL`, so the UI exercises real HTTP loading, mutation, error, and refresh behavior.

## Local Setup

Install and run the API:

```bash
cd backend/api
npm install
npm start
```

The API runs at `http://localhost:4000`.

Install and run the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

Create this file if it does not already exist:

```bash
cd frontend
cp .env.local.example .env.local
```

Expected value:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Useful Commands

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend syntax check:

```bash
cd backend/api
node --check server.js
```

## Features

- Lead list with semantic table markup
- List and Kanban views with refresh-safe URL state
- Responsive five-column Kanban board with drag-and-drop status transitions
- Search by name/email using URL query state
- Status filters using URL query state
- Create lead form with inline validation
- Detail and edit pages with refresh-safe deep links
- Delete flow with confirmation and loading/error states
- Status transition control that only shows valid next statuses
- Locked UI for terminal statuses: `CONVERTED` and `LOST`
- Loading, empty, error, and not-found states
- Pipeline summary counts and responsive table behavior

## Status Rules

The UI uses the same state machine as the API:

```txt
NEW -> CONTACTED -> QUALIFIED -> CONVERTED
NEW -> LOST
CONTACTED -> LOST
QUALIFIED -> LOST
CONVERTED -> locked
LOST -> locked
```

Invalid transitions are not offered in the UI. For example, a `NEW` lead can only move to `CONTACTED` or `LOST`; `CONVERTED` and `LOST` leads show a locked state instead of a status menu.

The Kanban board makes the same rules visible while dragging. Valid destination columns are highlighted, invalid columns are muted and disabled, and terminal leads do not expose drag handles. A valid drop stages the card in its new column with compact Confirm and Cancel controls. The API request is sent only after confirmation because valid status transitions intentionally cannot be reversed.

## Design Decisions

Components are split by responsibility: route pages handle data fetching and page layout, `lib/api` owns HTTP behavior, `lib/leads/status.ts` owns pipeline rules, and reusable lead UI lives in `components/leads`.

Async behavior is explicit. Forms disable submit while invalid or saving, delete uses a confirmation dialog, status changes show saving/error feedback, and pages include loading/error states for API failures.

URL state is used for view selection, search, and filters so filtered views are shareable and survive refreshes, for example:

```txt
/leads?view=kanban&q=aman&status=NEW
```

Kanban drag-and-drop uses `@dnd-kit/react`. The board reuses the same centralized transition rules as the list actions and the API, stages one move at a time, and keeps invalid drop targets disabled before a request can be sent.

## What I Would Improve With More Time

- Add Level 3 bulk actions and virtualization for large datasets.
- Add optimistic status/delete updates with rollback for an even faster feel.
- Add automated browser tests for create/edit/delete/status flows.
- Improve concurrent edit handling with updated timestamps or conflict messaging.

For offline support, I would add a local mutation queue, cache recent lead data, and reconcile changes when the API becomes available again.

## AI Usage Note

I used AI assistance to break the assessment into tasks, scaffold the project structure, and iterate on implementation details. I reviewed and adjusted the code as it was added, kept commits task-sized, and verified behavior with lint, production builds, and live local API checks.

## Submission Recording Checklist

- Show `/leads` loading data from the local API
- Search and filter leads, then clear filters
- Create a new lead
- Open a lead detail page
- Edit lead contact details
- Change a valid status
- Show a terminal lead as locked
- Delete a lead with confirmation
- Switch between List and Kanban views
- Drag an active lead and show invalid columns becoming disabled
- Stage, cancel, and confirm a valid Kanban status move

## Completed Task Checklist

- [x] Task 0: Project setup
- [x] Task 1: Data model and API layer
- [x] Task 2: Main leads page
- [x] Task 3: Search and filters
- [x] Task 4: Create lead
- [x] Task 5: View and edit lead
- [x] Task 6: Delete lead
- [x] Task 7: Status transitions
- [x] Task 8: Polish pass
- [x] Task 9: README and submission prep
- [x] Level 2 Task 1: List and Kanban view toggle
- [x] Level 2 Task 2: Responsive Kanban board
- [x] Level 2 Task 3: Rule-aware staged drag-and-drop
- [x] Level 2 Task 4: Documentation and regression pass
