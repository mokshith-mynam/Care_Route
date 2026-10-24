# Scope and Acceptance Criteria

## Included
Dashboard; patient directory; synthetic patient creation; follow-up scheduling and status update; referral creation/status update; simple configurable thresholds; local browser persistence; rule unit tests; Supabase schema starter; demo guide.

## Acceptance tests
1. Creating a patient adds it to the directory and survives a page refresh in the same browser.
2. Creating a follow-up makes it visible in the follow-up list.
3. Marking a follow-up completed removes it from the overdue calculation.
4. An unresolved task beyond the grace period is flagged with a clear reason.
5. Creating/updating a referral changes its visible status.
6. Changing the overdue grace setting changes rule results.
7. Empty search results and empty queues have helpful states.
8. Public demo contains only fictional records.
9. `npm run test` and `npm run build` pass before release.

## Explicit limitations
The current app uses `localStorage`, a fixed demo date, and a single demo persona. It is not multi-user, does not provide server-side authorization, and does not connect to Supabase despite including a starter schema. Do not use for operational care coordination.
