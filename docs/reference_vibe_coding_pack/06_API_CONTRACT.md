# API Contract

Use this document for REST/GraphQL/RPC endpoints or internal service contracts. Keep it aligned with the implementation; OpenAPI is recommended for REST APIs.

## API conventions
- Base URL by environment: [TODO]
- Versioning policy: [TODO]
- Authentication mechanism: [TODO]
- Authorization model: [TODO]
- Content type and serialization: [TODO]
- Pagination/filter/sort conventions: [TODO]
- Rate limits: [TODO]
- Idempotency rules for retries: [TODO]
- Standard error schema: [TODO]
- Correlation/request ID: [TODO]

## Endpoint template
### `POST /v1/[resource]`
**Purpose:** [TODO]  
**Authentication:** [required / public]  
**Authorization:** [specific role, owner, tenant rules]  
**Request schema:**
```json
{
  "field": "example"
}
```
**Validation:** required fields, bounds, allowed values, cross-field/business rules.  
**Success response:** [status and schema]  
**Errors:** 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 absent/hidden resource, 409 conflict, 429 rate limited, 5xx unexpected failure (adapt deliberately).  
**Side effects / transaction:** [TODO]  
**Audit/logging:** [TODO; do not log secrets or unnecessary personal data]  
**Tests:** happy path, invalid input, unauthenticated, wrong role, wrong owner/tenant, duplicate/replay, concurrency, rate limit.

Repeat per endpoint. Never assume an unguessable ID alone provides authorization.
