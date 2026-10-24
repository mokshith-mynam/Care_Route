# CareRoute Project File Index

## Frontend

- `frontend/index.html` — Vite HTML entry point.
- `frontend/src/App.tsx` — main application state, navigation, and workflow orchestration.
- `frontend/src/components/` — dashboard, patient, follow-up, referral, analytics, timeline, rules, export, and storage views.
- `frontend/src/apiClient.ts` — browser API wrapper, backend selection, and offline write queue.
- `frontend/src/supabaseClient.ts` and `frontend/src/supabaseService.ts` — optional Supabase browser integration.
- `frontend/src/rules.ts` — explainable administrative coordination rules.
- `frontend/src/demoData.ts` — browser fallback and sample structures.
- `frontend/src/i18n.ts` — English, Spanish, Kiswahili, and Hindi translations.
- `frontend/src/styles.css` — responsive accessible styles.

## Backend

- `backend/server.js` — production HTTP server for the built frontend and API.
- `backend/apiHandler.js` — `/api/*` routes and server-side demo role checks.
- `backend/db.js` — SQLite schema initialization, queries, seeding, reset, and purge operations.
- `backend/seedData.js` — fictional records loaded into local SQLite on first run.
- `backend/tests/` — API and security test suites plus manual acceptance notes.

## Database

- `database/local/careroute.db` — local SQLite records used by the default backend.
- `database/migrations/202610230001_initial_schema.sql` — optional Supabase PostgreSQL schema and RLS starter migration.
- `database/scripts/seed-demo.sql` — notes for setting up fictional Supabase demo records.

## Project wiring and docs

- `vite.config.ts` — sets `frontend/` as the Vite root and forwards development API calls to `backend/apiHandler.js`.
- `package.json` — shared install, dev, build, test, lint, and production start commands.
- `README.md` — setup instructions, feature overview, and architecture map.
- `docs/` — product, architecture, privacy, security, operations, testing, and release notes.
- `.env.example` — environment variable names without credentials.
- `.github/workflows/ci.yml` — continuous integration workflow.

The default development and production paths use `database/local/careroute.db`. Supabase is an optional backend. Its SQL migration is not applied automatically.
