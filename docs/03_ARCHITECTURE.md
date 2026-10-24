# Architecture and Technical Decisions

## Selected stack
- UI: React + TypeScript + Vite
- Styling: custom CSS, responsive layout
- Icons: lucide-react
- Demo persistence: browser localStorage
- Intended managed backend: Supabase Auth + PostgreSQL + RLS
- Tests: Vitest
- Hosting target: Vercel or equivalent static frontend host

## Data flow in the prototype
Browser UI → domain rule functions → browser localStorage. No data is transmitted to a backend by the current demo app. This is convenient for a synthetic prototype but not suitable for shared or sensitive records.

## Target architecture after integration
Browser UI → authenticated Supabase client → RLS-protected PostgreSQL tables. Sensitive operations and trusted audit events should use carefully designed server-side functions or database triggers. Service-role credentials must never be shipped to the browser.

## Trust boundaries
- Browser state and form inputs are untrusted.
- Frontend checks improve UX but are not authorization.
- Database RLS is a required enforcement layer for each protected table.
- Audit logs written by the client alone are not tamper-proof.

## ADR summary
Decision: use a React/Vite frontend and Supabase as a future managed backend to reduce infrastructure work for a beginner team. Keep the initial demo offline/local-first with synthetic records so the workflow can be demonstrated in 48 hours. Revisit after user interviews and security review.
