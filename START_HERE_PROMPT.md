# Start Here — AI Coding Assistant Prompt

You are helping build CareRoute, a privacy-conscious community health follow-up coordination prototype. Read `README.md` and all relevant files in `docs/` before changing code.

Constraints:
- This is a coordination tool, not a diagnostic or treatment system.
- Use synthetic data only. Never create realistic identifying patient details.
- The current frontend uses browser localStorage. Do not claim it is multi-user or connected to Supabase unless you implement and test that integration.
- Do not expose secrets or service-role keys.
- Server-side authorization and RLS are mandatory before real data use.
- Explainable rules must show the reason a case is flagged.

Work one vertical slice at a time. For each task: summarize the intended change, inspect existing patterns, implement the smallest safe change, add/update tests, run `npm run test`, `npm run build`, and `npm run lint`, and report changed files, commands run, test results, known limitations, and next steps. Never claim a command passed unless it was executed successfully.

First task: run the project, verify the existing MVP, and report any build or lint failures without adding new features.
