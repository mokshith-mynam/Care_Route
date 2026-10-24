# AI Coding Workflow

Use an AI coding assistant to implement one small vertical slice at a time. Do not ask it to silently invent clinical, legal, or security requirements.

## Prompt template
"Read README.md and the relevant files in docs/. Implement only [small feature]. Preserve the existing architecture. Do not add real patient data or clinical diagnosis. Add/update tests. Check authorization boundaries if applicable. Run tests/build/lint and report files changed, commands run, failures, known risks, and follow-up tasks. Do not claim tests passed unless they ran."

## Suggested slices
1. Dashboard data calculations.
2. Patient create/search.
3. Follow-up create/status update.
4. Referral create/status update.
5. Configurable rules and explanations.
6. Backend adapter and authentication (only after local MVP works).
7. RLS integration tests and audit trail.

## Review every generated change
- Inspect diffs and dependencies.
- Check for secrets and unsafe HTML.
- Confirm no diagnosis/prescribing logic was introduced.
- Run tests, build, lint, and manual acceptance scenarios.
- Review any SQL policy with a security-aware person.
