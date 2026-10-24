# Data and Privacy Plan

## Data classification
Potential health information is sensitive. Public demo records are synthetic only. Treat any future real-world screening, appointment, referral, identity, or contact data as sensitive and restrict access accordingly.

## Data minimization
For the MVP, use an internal patient code, display label, broad age band, facility, date, and fictional workflow note. Avoid phone numbers, exact addresses, full birth dates, government IDs, and unnecessary clinical detail.

## Demo data
`src/demoData.ts` contains fictional records. Never replace them with copied records from a clinic. Do not use real data in screenshots, logs, analytics, issue trackers, or AI coding tools.

## Retention and deletion
Prototype local data can be cleared with the reset control or browser storage controls. A real deployment needs a documented retention schedule, deletion process, backup retention, and legal review before launch.

## India context
Before any pilot, obtain qualified review of applicable Indian data-protection requirements, commencement/transition provisions, health-sector obligations, consent/notice, processor contracts, data location, and breach response. This document is not legal advice.
