# CareRoute Project File Index

- `README.md` — setup, commands, limitations, project structure.
- `START_HERE_PROMPT.md` — prompt for an AI coding assistant.
- `src/App.tsx` — main interactive CareRoute interface and workflow forms.
- `src/styles.css` — responsive styling.
- `src/demoData.ts` — fictional patient, follow-up, referral, and rule records.
- `src/rules.ts` — explainable date/routing functions.
- `src/storage.ts` — browser localStorage demo persistence.
- `src/types.ts` — domain types.
- `src/rules.test.ts` — unit tests for routing rules.
- `supabase/migrations/202610230001_initial_schema.sql` — database schema and starter RLS policies (must be reviewed).
- `scripts/seed-demo.sql` — notes for seeding a future Supabase demo.
- `docs/01...18...` — project-specific requirements, architecture, privacy, security, operations, testing, 48-hour plan, and demo script.
- `docs/reference_vibe_coding_pack/` — original reference documentation supplied by the user.
- `.env.example` — safe environment variable names; no credentials.
- `.github/workflows/ci.yml` — basic test/build/lint workflow.

## Current implementation status
The browser demo is functional in intent and uses localStorage; it is not connected to Supabase. Run tests/build/lint locally before relying on it. The SQL is a starter for review, not a production-certified security configuration.
