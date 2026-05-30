# Lead CRM

Mini Lead CRM for the Superleap frontend intern assessment. The app implements the required Level 1 flows and a Level 2 Kanban board: browse, search, filter, create, view, edit, delete, and move leads through valid pipeline states.

## Project Structure

```txt
Lead_CRM/
  frontend/
    src/
      app/                 # Next.js routes and route-level UI
      components/
        leads/             # Reusable lead forms, actions, and modals
        ui/                # Shared modal, menu, and dialog primitives
      lib/
        api/               # API client and TanStack Query hooks
        leads/             # Shared pipeline transition rules
      types/               # Lead domain types
  backend/
    api/
      server.js            # Provided Express mock API
      seed.json            # Local sample lead data
      generate.js          # Larger dataset generator
```

## Demo

[Watch the 3-4 minute walkthrough](Demo-Video.mp4)

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

Create the frontend environment file:

```bash
cd frontend
cp .env.local.example .env.local
```

Install and run the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`. The example environment file contains:

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

### Code organization

- Route pages handle data loading and page composition.
- `lib/api` owns HTTP requests and TanStack Query hooks.
- `lib/leads/status.ts` is the single frontend source of truth for allowed status transitions.
- Reusable forms, actions, modals, and shared UI primitives live under `components`.
- Async states are visible: forms disable while saving, destructive actions use confirmation dialogs, and loading, empty, not-found, and API-error states are handled explicitly.

### List and Kanban navigation

- List and Kanban use dedicated `/leads` and `/board` routes instead of hiding the board behind local-only state.
- Search and status filters stay in URL params so they survive route switches, refreshes, and shared links.
- Search input uses a local draft and debounced URL updates. The filter component stays mounted during refreshes so users can type continuously without losing focus.

For example:

```txt
/board?q=aman&status=NEW
```

### Kanban interaction rules

- Kanban drag-and-drop uses `@dnd-kit/react` because it provides focused draggable and droppable primitives, pointer and keyboard interactions, touch-aware sensors, drag overlays, and disabled target handling without bringing in a large UI framework.
- The full card surface is draggable. A separate drag button was removed to keep the interaction direct.
- Double-click opens a card's detail modal. A single click does not open the modal, which avoids accidental opens while preparing to drag. Keyboard users can open the focused card with Enter.
- When dragging starts, only allowed destinations stay visually active. Invalid columns are muted so the UI explains the state machine before the user drops the card.
- A valid drop moves the card immediately and sends the API request optimistically. If the request fails, the card returns to its original column and a toast explains the rollback.
- An invalid drop snaps back, shows a clear toast, and sends no API request.
- `CONVERTED` and `LOST` cards remain locked because the API treats them as terminal states.

### Layout and visual consistency

- The leads workspace is intentionally full width so all five Kanban columns have useful space.
- Each Kanban column has its own bounded `42rem` scroll area. A column with 50 or more cards remains readable without making the entire page excessively tall.
- The list view follows the same approach: rows scroll inside a bounded `42rem` table region while the header stays sticky.
- Global scrollbars are reduced to a minimal neutral indicator to keep dense list and board views visually quiet.
- Embedded create and edit forms use edge-to-edge modal footers with a clear divider, matching the structure of the other dialogs.

## What I Would Improve With More Time

- Add Level 3 bulk actions and virtualization for large datasets.
- Add automated browser tests for create/edit/delete/status flows.
- Improve concurrent edit handling with updated timestamps or conflict messaging.

For offline support, I would add a local mutation queue, cache recent lead data, and reconcile changes when the API becomes available again.

For concurrent edits, I would use `updated_at` as a version check or add an ETag. The API would reject stale updates with a conflict response, and the UI would ask the user to refresh or review the newer data before saving again.

## AI Usage Note

I used AI assistance to break the work into small tasks, review edge cases, and iterate on UI details. I reviewed the suggestions before using them and adjusted ideas that did not fit the requirements. For example, I replaced an early confirm-before-save Kanban flow with optimistic updates and rollback feedback. I verified the final behavior with lint checks, production builds, and manual testing.
