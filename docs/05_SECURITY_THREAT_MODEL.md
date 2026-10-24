# CareRoute Security Threat Model & Hardened Security Controls

## Assets Protected
Patient identifiers, non-diagnostic screening observations, caregiver consent agreements, routine follow-up schedules, referral loop-closure records, user identities, facility assignments, administrative routing rules, audit event logs, and credentials.

---

## Threats Identified & Verified Remediations

| Threat / Vulnerability | Severity | Vector / File | Verified Remediation |
| :--- | :--- | :--- | :--- |
| **Path / Directory Traversal** | High | `server.js` | Enforced strict path normalization and resolved boundary checks ensuring static file lookups never escape `dist/`. |
| **Privilege Escalation** | High | `supabase/migrations/` | Enforced `prevent_profile_tampering()` trigger allowing only true `administrator` (and rejecting `supervisor`) role updates on `public.profiles`. |
| **Audit Trail Tampering & Forgery** | High | `supabase/migrations/` & `db.js` | Enforced DB-level immutability (`trg_audit_events_immutable`) and revoked direct client `INSERT` policies, routing audit records exclusively through trusted triggers and RPCs. |
| **Denial of Service (DoS) & Flooding** | High | `apiHandler.js` | Enforced sliding-window IP rate limiting (500 req/min general, 60 req/min destructive) and strict `1MB` payload limit (`MAX_BODY_SIZE`). |
| **Cross-Origin Data Exfiltration (CORS)** | High | `apiHandler.js` | Replaced wildcard `*` with dynamic origin inspection, strictly restricting cross-origin access to verified local development environments. |
| **Header Identity Spoofing** | High | `apiHandler.js` & `apiClient.ts` | Added cryptographic HMAC-SHA256 session token generation and verification (`/api/auth/session`) supporting verified `Authorization: Bearer <token>` requests. |
| **Prototype Pollution** | Medium | `apiHandler.js` | Implemented recursive JSON sanitization stripping `__proto__`, `constructor`, and `prototype` from request bodies. |
| **Information Disclosure** | Medium | `server.js` & `apiHandler.js` | Replaced leaked stack traces and internal database errors with generic, sanitized error messages. |
| **Missing Security Headers** | Medium | `server.js` & `apiHandler.js` | Added `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, and `Permissions-Policy`. |
| **Cross-Facility Data Leakage** | High | `supabase/migrations/` | Enforced strict PostgreSQL Row-Level Security (RLS) scoping all queries to `current_facility_id()`. |
| **Missing User Profile Trigger** | Medium | `supabase/migrations/` | Attached `on_auth_user_created` trigger on `auth.users` automatically provisioning new profile records and preventing lockout. |
| **Identity / Owner Tampering** | High | `supabase/migrations/` | Added `prevent_record_identity_tampering()` trigger locking `id`, `created_by`, and `facility_id` from modification after creation. |
| **SQLite Concurrency Contention** | Medium | `db.js` | Enabled SQLite WAL journal mode (`PRAGMA journal_mode = WAL;`) and 5000ms busy timeout to prevent concurrency lockouts. |
| **Unbounded Input Fields** | Low | `db.js` | Applied defensive length boundaries (`.slice(0, N)`) across patient names, facilities, notes, follow-up reasons, and referral outcomes. |
| **Search Path Hijacking** | Medium | `supabase/migrations/` | Explicitly configured `SET search_path = public, auth, pg_temp` on all `SECURITY DEFINER` functions. |
| **Unauthorized Administrative Updates** | High | `apiHandler.js` | Enforced server-side RBAC returning HTTP 403 Forbidden for non-supervisors attempting to modify routing rules or purge/reset data. |

---

## Automated Security Test Suite
All security controls are verified by automated tests in `tests/security_vulnerabilities.test.ts` and `tests/api_rbac.test.ts`:
- Path traversal outside `dist/` is blocked.
- Non-GET/HEAD methods on static files return HTTP 405 Method Not Allowed.
- Security headers (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`) are verified on all endpoints.
- Cross-origin wildcard reflection is denied for untrusted external origins.
- Cryptographic HMAC session tokens are issued, verified, and accepted via `Bearer` authorization.
- Oversized JSON bodies receive HTTP 413 Payload Too Large without server crash.
- Malformed JSON receives HTTP 400 Bad Request safely.
- Prototype pollution attacks are neutralized.
- Non-supervisors receive HTTP 403 on protected administrative operations.
