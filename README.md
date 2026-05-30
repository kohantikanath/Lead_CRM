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

**Frontend:** Next.js App Router with TypeScript. I chose Next.js because the assessment allows React/Next.js, and App Router gives clean deep-linkable routes for `/leads`, `/board`, `/leads/new`, `/leads/[id]`, and `/leads/[id]/edit`.

**Styling:** Tailwind CSS. It keeps the UI implementation lightweight and makes it easy to tune spacing, table density, focus states, and responsive behavior without adding a heavy component library.

**State:** TanStack Query owns server state and cache refreshes. URL state is used for the current view, search, and filters. Local component state is used for forms, dialogs, drag feedback, and optimistic board movement.

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
- Dedicated `/leads` list and `/board` Kanban routes
- List and Kanban switching with refresh-safe URL state
- Responsive five-column Kanban board with drag-and-drop status transitions
- Optimistic Kanban movement with API-failure rollback feedback
- Muted invalid drop destinations with API-free rejection feedback
- Direct card dragging, double-click detail opening, and keyboard detail access
- Search by name/email using URL query state
- Status filters using URL query state
- Create lead form with inline validation
- Detail and edit pages with refresh-safe deep links
- Delete flow with confirmation and loading/error states
- Status transition control that only shows valid next statuses
- Locked UI for terminal statuses: `CONVERTED` and `LOST`
- Loading, empty, error, and not-found states
- Pipeline summary counts and responsive full-width layout
- Bounded list and Kanban scroll regions for larger datasets
- Sticky list headers and compact site-wide scrollbar styling
- Consistent edge-to-edge modal form footers

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

The Kanban board makes the same rules visible while dragging. Valid destination columns are highlighted, invalid columns are muted, and terminal leads stay locked. A valid drop moves the card immediately while the API request runs. If the API rejects the update, the card returns to its original column and the board shows an error message. Invalid drops also snap back with feedback and do not send an API request.

## Design Decisions

Components are split by responsibility: route pages handle data fetching and page layout, `lib/api` owns HTTP behavior, `lib/leads/status.ts` owns pipeline rules, and reusable lead UI lives in `components/leads`.

Async behavior is explicit. Forms disable submit while invalid or saving, delete uses a confirmation dialog, status changes show saving/error feedback, and pages include loading/error states for API failures.

List and Kanban use dedicated routes. Search and status filters stay in URL params so filtered views remain shareable and survive route switches and refreshes, for example:

```txt
/board?q=aman&status=NEW
```

Kanban drag-and-drop uses `@dnd-kit/react` because it provides focused draggable and droppable primitives, pointer and keyboard interactions, touch-aware sensors, drag overlays, and disabled target handling without bringing in a large UI framework. The board reuses the same centralized transition rules as the list actions and the API, processes one optimistic move at a time, and keeps invalid transitions API-free.

The layout is intentionally full width so all five columns have useful space. Kanban columns and the list table use bounded `42rem` scroll regions, keeping the page readable when a status contains many leads. The table header remains sticky while rows scroll. Global scrollbars are reduced to a minimal neutral indicator, and embedded create/edit forms use edge-to-edge modal footers so their visual structure matches the rest of the interface.

## What I Would Improve With More Time

- Add Level 3 bulk actions and virtualization for large datasets.
- Add optimistic delete updates with rollback for an even faster feel.
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
- Confirm valid Kanban moves update immediately and failed moves roll back

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
- [x] Level 2 Task 3: Rule-aware optimistic drag-and-drop
- [x] Level 2 Task 4: Documentation and regression pass
