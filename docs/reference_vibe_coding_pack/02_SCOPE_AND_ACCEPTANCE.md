# Scope, User Stories, and Acceptance Criteria

## MVP boundary
The MVP is the smallest safe product that proves the core user outcome. Do not add features simply because an AI agent suggests them.

### Must ship
- [TODO]
### Could ship only if time remains
- [TODO]
### Explicitly not shipping
- [TODO]

## User story template
**ID:** US-001  
**As a:** [role]  
**I want:** [capability]  
**So that:** [outcome]  

**Preconditions:** [TODO]  
**Main flow:** [TODO]  
**Alternative/error flows:** [TODO]  
**Authorization:** [who can do this and whose data can they access?]  
**Acceptance criteria (Given / When / Then):**
- Given [state], when [action], then [observable result].
- Given [unauthorized state], when [action], then access is denied without leaking protected data.
- Given [invalid input], when [action], then validation fails safely and data remains consistent.

## Definition of Ready
A story is ready only when scope, business rules, UI states, API/data impact, permissions, acceptance criteria, and dependencies are understood.

## Definition of Done
- Acceptance criteria pass.
- Relevant unit, integration, and end-to-end tests pass.
- Authorization and input validation are implemented server-side.
- Loading, empty, success, error, and offline states are handled where applicable.
- Accessibility and responsive/device behavior are checked.
- Logs contain no secrets or unnecessary personal data.
- Security checks and dependency scans pass or have documented, approved exceptions.
- Documentation and migrations are updated.
- Code review completed; no unresolved critical/high-risk issue.
