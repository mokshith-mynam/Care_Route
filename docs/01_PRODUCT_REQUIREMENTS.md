# CareRoute Product Requirements Document

**Version:** 0.1.0 · **Stage:** 48-hour prototype · **Product owner:** founding team

## Summary
CareRoute helps primary-care and community health teams coordinate follow-up tasks and referrals. It records basic screening observations, schedules follow-ups, highlights unresolved work using explainable rules, and supports referral status tracking. It must not replace clinical diagnosis or professional judgment.

## Users
- **Community health worker:** create/update synthetic patient records, schedule follow-ups, record contact outcomes, and see assigned tasks.
- **Clinical reviewer:** review cases referred for human review; no automated diagnosis.
- **Administrator:** manage role access and approved administrative routing thresholds.
- **Referral coordinator:** track destination, appointment status, and referral outcome.

## MVP functional requirements
- FR-001 MUST: Display counts for active demo patients, due-today tasks, overdue tasks, and open referrals based on stored records.
- FR-002 MUST: Create and search patient records using unique demo IDs.
- FR-003 MUST: Create follow-ups with due date, reason, status, and assigned worker.
- FR-004 MUST: Update follow-up status and retain outcome information.
- FR-005 MUST: Create referrals and update status, destination, appointment date, and outcome.
- FR-006 MUST: Evaluate configurable overdue and referral-review thresholds and show a human-readable reason.
- FR-007 MUST: Clearly label all demo records as synthetic and show a non-diagnostic disclaimer.
- FR-008 SHOULD: Enforce role- and facility-scoped server-side authorization in the Supabase integration.
- FR-009 SHOULD: Record auditable changes to sensitive records in a trusted backend.

## Non-functional requirements
- Responsive desktop/mobile layout; keyboard-accessible controls and visible focus states.
- No secrets in source control or client bundles.
- No real patient data in development, tests, screenshots, or public demo.
- Core rules covered by automated tests.
- Avoid presenting unconfirmed status as evidence that care was missed.

## Business rules
- A completed follow-up is not overdue.
- A task is overdue only if unresolved and its due date exceeds the configured grace period.
- A referral without an appointment date is not automatically flagged as late.
- A referral with no outcome after the configured threshold is queued for human review, not automatically considered failed.
- Administrative routing rules are not clinical risk scores.

## Out of scope
Diagnosis, treatment recommendations, emergency triage, real SMS/WhatsApp messaging, hospital integrations, predictive ML, billing, and production handling of patient data.

## Success measures for the prototype
- All seeded scenarios return expected flags.
- Create/update workflows persist after refresh in the same browser.
- Referral and follow-up state updates recalculate dashboard counts.
- Access control migration is reviewed and tested separately before real data use.
