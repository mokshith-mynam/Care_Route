# API and Domain Contract

The current MVP has no remote API. This contract describes the domain operations expected when a backend is added.

## Operations
- `listPatients(query, facilityScope)` → patient records permitted to caller.
- `createPatient(input)` → validated patient ID and record.
- `createFollowUp(patientId, dueDate, reason, assignee)` → new scheduled task.
- `updateFollowUpStatus(id, status, outcome?)` → authorized state transition and audit event.
- `createReferral(patientId, destination, referralDate, appointmentDate?)` → referral record.
- `updateReferralStatus(id, status, outcome?)` → authorized status update.
- `getDashboardSummary(date, facilityScope)` → counts derived from authoritative records.
- `updateRuleConfig(config)` → administrator-only validated thresholds.

## Contract requirements
Validate every input on the server; authorize every record operation; return stable error codes; use idempotency where retries could duplicate actions; log actor/action/record reference without unnecessary sensitive payloads; define date/time-zone semantics; test forbidden access as well as successful paths.
