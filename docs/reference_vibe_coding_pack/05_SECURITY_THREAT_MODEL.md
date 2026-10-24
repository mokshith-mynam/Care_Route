# Security Requirements and Threat Model

## Security objective
Reduce likelihood and impact of abuse, data exposure, account takeover, fraud, and service disruption. **Absolute security cannot be guaranteed.** Revisit this model when features, dependencies, integrations, or deployment change.

## 1. Assets
List assets and impact if compromised: accounts, personal data, payment state, admin actions, signing keys, API credentials, source code, logs, backups, availability. [TODO]

## 2. Trust boundaries and entry points
List browser/mobile client, API, admin tools, database, queues, file uploads, webhooks, third-party APIs, CI/CD, cloud console, support workflows. [TODO]

## 3. Threat scenarios
| Threat | Likelihood | Impact | Mitigation | Verification test | Owner |
|---|---|---|---|---|---|
| Broken access control / IDOR | [TODO] | High | Server-side ownership/role checks; deny by default | User A cannot read/change User B's record | [TODO] |
| Injection | [TODO] | High | Parameterized queries, safe APIs, server validation | Security tests with hostile inputs | [TODO] |
| Authentication/session theft | [TODO] | High | Established auth provider, secure session handling, MFA for admins | Session expiry/revocation tests | [TODO] |
| XSS / unsafe rendering | [TODO] | High | Context-aware output encoding, safe rendering, CSP where appropriate | Payload tests | [TODO] |
| CSRF (cookie-based auth) | [TODO] | [TODO] | SameSite, anti-CSRF tokens/origin checks as appropriate | CSRF tests | [TODO] |
| Secret leakage | [TODO] | High | Secret manager, scanning, rotation | CI secret scan | [TODO] |
| Dependency/supply-chain compromise | [TODO] | High | Lockfiles, trusted sources, scanning, updates | Dependency audit | [TODO] |
| Abuse / brute force / scraping | [TODO] | [TODO] | Rate limits, quotas, alerts, abuse controls | Load/abuse test | [TODO] |
| Malicious upload | [TODO] | [TODO] | Allowlist types, size limits, isolated storage/scanning | Upload tests | [TODO] |
| Data loss / ransomware | [TODO] | High | Least privilege, encrypted backups, restore drills | Restore test | [TODO] |
| Sensitive data in logs | [TODO] | High | Redaction, allowlisted logging | Inspect test logs | [TODO] |
| Misconfigured cloud/CORS | [TODO] | High | Minimal origins/permissions, reviewed IaC/config | Config scan | [TODO] |

Add product-specific threats; this table is not exhaustive.

## 4. Baseline controls
- Authorization: deny by default; check role, ownership, tenant, and action on every server request.
- Validation: validate types, lengths, formats, ranges, and business rules on the server; treat client validation as UX only.
- Database: parameterized queries/ORM safely used; least-privilege DB user; constraints; encrypted transport.
- Authentication: use a maintained identity solution; secure password reset; MFA for privileged accounts; rate limit sensitive flows.
- Sessions/tokens: short-lived access where appropriate; secure storage; rotation/revocation; cookies use Secure, HttpOnly, and suitable SameSite settings.
- Web: HTTPS, safe CORS allowlist, security headers, CSP where compatible, CSRF controls when applicable.
- Android: keep secrets out of APK; use Android Keystore for appropriate local secrets; use platform secure storage; minimize exported components and permissions; validate deep links; configure network security; do not trust client-side checks.
- Files: enforce size/type limits, store outside executable paths, randomize storage names, scan where appropriate.
- Operations: separate environments, least privilege, MFA, audit admin actions, patch dependencies, protect backups, monitor suspicious behavior.
- Errors: show safe messages to users; do not expose stack traces, tokens, SQL, or internal configuration.

## 5. Abuse cases
- Can a logged-out person perform privileged actions?
- Can User A access User B's records by changing an ID?
- Can a low-privilege user promote themselves?
- Can replaying a request charge twice or duplicate an operation?
- Can an untrusted webhook forge events?
- Can a reset link be reused or leaked through logs/referrers?
- Can a user enumerate accounts or bypass quotas?
- Can an admin export more data than necessary?
Record results and evidence: [TODO]

## 6. Security verification
Before launch:
- Run SAST, dependency vulnerability scan, secret scan, and infrastructure/config scan.
- Test authentication, authorization, tenant isolation, validation, rate limits, and sensitive workflows.
- Perform dynamic testing in staging with non-production data.
- Fix critical/high findings before launch; exceptions require named risk owner, rationale, compensating controls, and expiry.
- Use an independent penetration test for high-risk products and after major architectural changes.
- Track security issues privately and define a responsible disclosure contact.

## 7. Incident response
See `10_OPERATIONS_AND_INCIDENTS.md`.
