# UX, UI States, and Accessibility

## Navigation / screen inventory
| Screen | Purpose | Roles | Entry point | Main actions |
|---|---|---|---|---|
| [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

## Flow specifications
For every important flow, document normal path, cancellation, back navigation, validation, network failure, permission denial, session expiry, and recovery.

## Required UI states
- Loading / pending
- Empty state
- Success / confirmation
- Validation error
- Server error with retry or recovery guidance
- Offline / poor connection where relevant
- Unauthorized / expired session
- Destructive action confirmation
- Partial completion / duplicate submission

## Accessibility and usability
- Keyboard navigation and visible focus (web)
- Semantic labels and screen-reader names
- Color contrast and no color-only meaning
- Text scaling and touch target sizes
- Android accessibility semantics and system back behavior
- Form labels, helpful errors, and preserved input after recoverable errors
- Respect reduced motion and user preferences
- Test with assistive technology and real devices where possible

## Design system
Typography, spacing, color tokens, component states, responsive breakpoints, light/dark theme, localization: [TODO]

## Content
Use plain language. Avoid exposing internal errors, sensitive data, or misleading success messages. All destructive and money-moving actions require clear confirmation and idempotent backend behavior.
