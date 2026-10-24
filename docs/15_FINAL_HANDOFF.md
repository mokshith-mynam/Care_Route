# Final Handoff

## Included
React/Vite MVP, local synthetic data, browser persistence, patient/follow-up/referral workflows, configurable rule UI, unit tests, Supabase schema starter, and project documentation.

## How to run
`npm install` → `npm run dev`; validate with `npm run test`, `npm run build`, and `npm run lint`.

## Known limitations
- LocalStorage demo only; no real authentication or multi-user backend.
- Fixed demo date for repeatable test scenarios.
- Rule settings for contact-attempt escalation are configuration/UI examples and do not yet process contact-attempt records.
- Referral review logic is illustrative and requires more comprehensive workflow tests.
- Supabase migration requires security review and is not automatically connected to the frontend.
- Not validated for clinical use; do not use real patient data.

## Next recommended steps
1. Run locally and fix dependency/build issues.
2. Add integration tests for all core workflows.
3. Implement Supabase data adapter and login.
4. Complete RLS and role-policy review.
5. Conduct healthcare worker discovery interviews before pilot planning.
