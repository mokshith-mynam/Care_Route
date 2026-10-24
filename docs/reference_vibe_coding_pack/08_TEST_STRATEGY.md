# Test Strategy and Quality Gates

## Test pyramid
1. Unit tests: pure business rules, validators, permissions, state transitions.
2. Integration tests: database, API, queues, third-party adapters, transactions.
3. End-to-end tests: critical user journeys across UI and backend.
4. Security tests: auth, authorization, input handling, abuse controls, configuration.
5. Non-functional tests: performance, accessibility, resilience, backup restoration.

## Coverage policy
Coverage percentage alone does not prove correctness. Prioritize critical paths and failure modes. Target: [TODO].

## Critical journey matrix
| Journey | Unit | Integration | E2E | Security negative case |
|---|---|---|---|---|
| Sign up / sign in / reset | [TODO] | [TODO] | [TODO] | [TODO] |
| Create/read/update/delete core object | [TODO] | [TODO] | [TODO] | Cross-user access denied |
| Admin action | [TODO] | [TODO] | [TODO] | Non-admin denied |
| Payment/webhook (if applicable) | [TODO] | [TODO] | [TODO] | Replay/forgery denied |
| Export/delete account | [TODO] | [TODO] | [TODO] | Scope and authorization checked |

## Required edge cases
- Missing, malformed, oversized, and unexpected input
- Boundary values and timezone/date transitions
- Duplicate submissions and concurrent updates
- Expired/revoked session
- Unauthorized user and cross-tenant ID
- Network timeout, retry, partial failure, and external provider outage
- Empty results, pagination, large result set
- Database constraint violation and migration failure
- Accessibility and small-screen layouts

## CI quality gates
- Formatting, linting, type checking
- Unit/integration tests
- Build and migration checks
- Dependency and secret scanning
- Static analysis and applicable license policy
- E2E smoke tests in staging
- Build artifacts traceable to a commit

## Test data
Use synthetic data. Never include production credentials or real personal records in test fixtures.

## Test report template
Commit/build: [TODO] | Environment: [TODO] | Date: [TODO]
Passed/failed/skipped: [TODO]
Known issues and severity: [TODO]
Security scan findings: [TODO]
Decision: [go / no-go] | Approver: [TODO]
