# Production Release Checklist — Go / No-Go

Mark each item **PASS**, **FAIL**, or **NOT VERIFIED** and attach evidence. NOT VERIFIED is not a pass.

## Product and UX
- [ ] MVP requirements and acceptance criteria approved.
- [ ] Critical user journeys work on supported devices/browsers.
- [ ] Loading, empty, error, offline, and session-expiry states handled.
- [ ] Accessibility and responsive/device checks completed.
- [ ] Privacy notice, terms, support contact, and account deletion flow reviewed where applicable.

## Engineering
- [ ] Reproducible build from reviewed commit.
- [ ] Formatting, linting, type checks, unit/integration/E2E tests pass.
- [ ] No known data corruption, duplicate-action, or race-condition issue in critical flows.
- [ ] Database migrations tested; recovery/forward-fix plan exists.
- [ ] API contract and operational docs match implementation.

## Security and privacy
- [ ] Authorization verified server-side for every protected resource/action.
- [ ] Cross-user/cross-tenant negative tests pass.
- [ ] Input validation, safe output rendering, and safe database access reviewed.
- [ ] Authentication, reset, session expiry/revocation, and privileged-account protection tested.
- [ ] No secrets in repository, client bundle, logs, build artifacts, or public configuration.
- [ ] Dependency, secret, static analysis, and applicable infrastructure scans reviewed.
- [ ] Critical/high findings fixed or formally accepted by a named risk owner with expiry and compensating controls.
- [ ] Data minimization, retention, deletion, access, and vendor sharing reviewed.
- [ ] Independent security testing completed if product risk warrants it.

## Operations
- [ ] TLS and production configuration verified.
- [ ] Least-privilege production access and MFA configured.
- [ ] Alerts, dashboards, error reporting, and safe logging work.
- [ ] Backup restoration has been tested.
- [ ] Incident response and support escalation owners identified.
- [ ] Rollback/disable plan tested.
- [ ] Cost limits and alerts configured.

## Web-specific
- [ ] CORS allowlist, security headers, cookie settings, CSRF protections where applicable reviewed.
- [ ] Production source maps/debug endpoints/error pages are controlled.
- [ ] Domain, TLS renewal, DNS, caching, and CDN settings checked.

## Android-specific
- [ ] Release build signed securely; signing keys are not in source control.
- [ ] Manifest permissions and exported components reviewed.
- [ ] No production secrets embedded in APK.
- [ ] Network security, deep links, backups, and local storage reviewed.
- [ ] Tested on supported Android versions and real devices.
- [ ] Play Console policy, privacy disclosures, data safety, and permissions reviewed as applicable.
- [ ] Crash reporting and staged rollout/rollback approach configured.

## Approval
Release: [TODO]
Commit/build ID: [TODO]
Known issues: [TODO]
Product owner: [TODO]
Engineering owner: [TODO]
Security/privacy approver if required: [TODO]
Decision: [GO / NO-GO]
Date/time: [TODO]

**Automatic NO-GO examples:** exposed secret; unresolved critical vulnerability; broken authorization; failing critical journey; untested destructive migration; no viable recovery path for important data.
