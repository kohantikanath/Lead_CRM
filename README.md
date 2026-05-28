# Lead CRM

Mini Lead CRM for the Superleap frontend intern assessment.

## Project Structure

```txt
Lead_CRM/
  frontend/              # Next.js + TypeScript + Tailwind UI
  backend/
    api/                 # Provided Express API for local assessment data
```

## Task 0 Checklist

- [x] Clone empty GitHub repository
- [x] Create separate `frontend` and `backend` folders
- [x] Add provided API server under `backend/api`
- [x] Scaffold Next.js TypeScript Tailwind frontend
- [x] Add environment example
- [x] Confirm frontend and backend run locally
- [x] Commit Task 0 setup

## Task 1 Checklist

- [x] Rename backend folder to `backend/api`
- [x] Create `Lead` TypeScript model
- [x] Create lead status constants
- [x] Create API client error handling
- [x] Add lead API functions
- [x] Add status transition helpers
- [x] Verify lint/build health
- [x] Commit Task 1 API layer

## Task 2 Checklist

- [x] Created `/leads` route
- [x] Added real API data loading
- [x] Added semantic leads table
- [x] Added name, email, status, source, updated time columns
- [x] Added status badges
- [x] Added loading state
- [x] Added empty state
- [x] Added error state
- [x] Added View, Edit, Delete row actions
- [x] Verified lint/build
- [x] Committed Task 2 main leads page

## Local Development

Run the local API:

```bash
cd backend/api
npm install
npm start
```

The API runs at `http://localhost:4000`.

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.
