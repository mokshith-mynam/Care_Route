# Product Requirements Document (PRD)

## 1. Summary
- Product name: [TODO]
- One-sentence description: [TODO]
- Problem being solved: [TODO]
- Why existing alternatives are insufficient: [TODO]
- Product owner: [TODO]
- Last updated / version: [TODO]

## 2. Users and context
For each user type, document:
- Role and goals
- Technical comfort and accessibility needs
- Typical device, connectivity, and environment
- Pain points
- What they must never be able to access or do

Primary persona: [TODO]
Secondary personas: [TODO]
Explicitly excluded users/use cases: [TODO]

## 3. Outcomes and measurement
| Outcome | Metric | Baseline | Target | Measurement method |
|---|---|---|---|---|
| [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

Avoid vanity metrics. Define how each metric is collected and how privacy is preserved.

## 4. Functional requirements
Give each requirement a stable ID, priority, and acceptance test.
- FR-001 [MUST]: [TODO]
- FR-002 [SHOULD]: [TODO]
- FR-003 [COULD]: [TODO]

For each feature describe: trigger, preconditions, happy path, alternate paths, errors, permissions, data written/read, audit needs, and acceptance criteria.

## 5. Non-functional requirements
- Availability target / service hours: [TODO]
- Performance targets (e.g. p95 response time): [TODO]
- Expected load and growth: [TODO]
- Accessibility target: [TODO; consider WCAG 2.2 AA for web]
- Supported browsers / Android versions: [TODO]
- Localization and time zones: [TODO]
- Recovery point objective (RPO): [TODO]
- Recovery time objective (RTO): [TODO]
- Retention and deletion expectations: [TODO]
- Security and privacy requirements: see `05_SECURITY_THREAT_MODEL.md`

## 6. Business rules
Write explicit, testable rules. Include edge cases, limits, rounding, time zones, status transitions, cancellation/refund rules if relevant.
- BR-001: [TODO]
- BR-002: [TODO]

## 7. Assumptions and unresolved questions
| Question / assumption | Owner | Risk if wrong | Due date | Decision |
|---|---|---|---|---|
| [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

## 8. Out of scope
- [TODO]
- [TODO]

## 9. Dependencies and constraints
Third-party services, platform policies, budget, team skills, legal requirements, data residency, deadline: [TODO]

## 10. Sign-off
Product owner: [TODO] | Date: [TODO]
Engineering owner: [TODO] | Date: [TODO]
Security/privacy reviewer (if needed): [TODO] | Date: [TODO]
