# Database files

- `local/careroute.db` is the SQLite database used by the local backend. The backend creates the directory and initializes/seeds the schema on first run.
- `migrations/202610230001_initial_schema.sql` is the PostgreSQL/Supabase schema starter. It is not applied to SQLite and must be run manually for a Supabase project.
- `scripts/seed-demo.sql` contains notes for preparing a synthetic Supabase dataset.

The SQLite location is resolved relative to `backend/db.js`, so `npm run dev` and `npm start` use the same database regardless of the shell's current working directory.
