# Test Strategy

## Automated
- Unit test due-date/grace-period logic, completed-state exclusion, referral review threshold, and missing appointment dates.
- Run `npm run test`, `npm run build`, and `npm run lint`.
- Add integration tests for Supabase policies before enabling backend mode.

## Manual acceptance
1. Create patient and refresh.
2. Create follow-up and refresh.
3. Update status and verify dashboard counts.
4. Change rule threshold and verify flags.
5. Create referral, update status, and verify outcome.
6. Search by patient ID, display label, and facility.
7. Test mobile layout and keyboard focus.
8. Test denied requests as a user from another facility.
9. Verify no real personal/health data in demo, screenshots, logs, or commits.

## Test data
Use `src/demoData.ts` only. Test dates are fixed to 2026-10-23 for repeatability. Update tests and scenarios if the demo date changes.
