# Deployment, Operations, Monitoring, and Incident Response

## 1. Environments and access
- Separate dev, staging, and production accounts/projects.
- Require MFA for cloud, source control, app-store, and production access where available.
- Use least privilege; review access regularly.
- Production access owner and escalation: [TODO]
- Secrets manager and rotation process: [TODO]

## 2. Deployment process
1. Build from reviewed commit in CI.
2. Run quality/security gates.
3. Deploy to staging and smoke-test.
4. Review database migrations, compatibility, and rollback/forward-fix plan.
5. Obtain release approval.
6. Deploy gradually where supported.
7. Verify health, errors, and key journeys.
8. Roll back or disable the feature if health gates fail.

## 3. Observability
Define actionable alerts for availability, latency, error rate, queue lag, database health, failed jobs, unusual authentication activity, rate-limit spikes, and cost anomalies.
- Service-level indicators / targets: [TODO]
- Alert channels and on-call owner: [TODO]
- Dashboard: [TODO]
- Log retention and access: [TODO]

Logs should be structured and useful, but redact passwords, tokens, session IDs, payment data, and unnecessary personal information. Limit access and retention.

## 4. Backups and recovery
- What is backed up and how often: [TODO]
- Encryption and access controls: [TODO]
- RPO / RTO: [TODO]
- Restore drill frequency and owner: [TODO]
- Recovery procedure location: [TODO]

A successful backup job is not proof that restoration works. Perform and document restore tests.

## 5. Incident response runbook
**Trigger:** suspected account compromise, data exposure, malware, secret leak, service disruption, or unauthorized admin action.

1. Protect people and limit harm; page incident lead.
2. Preserve relevant logs/evidence; avoid destructive cleanup before evidence is retained.
3. Contain the incident: revoke sessions/keys, disable affected integrations/features, restrict access, or isolate systems as appropriate.
4. Determine affected systems, data, users, timeline, and persistence.
5. Recover from known-good state; rotate exposed credentials and fix root cause.
6. Have legal/privacy/security owners assess notification obligations and deadlines for applicable jurisdictions.
7. Communicate accurately to affected parties and stakeholders as required.
8. Record timeline, decisions, impact, and evidence.
9. Conduct a blameless post-incident review with tracked preventive actions.

Incident lead: [TODO]
Security contact: [TODO]
Legal/privacy contact: [TODO]
External reporting requirements: [TODO]

## 6. Maintenance
Patch cadence: [TODO]
Dependency review owner: [TODO]
Domain/certificate renewal owner: [TODO]
Vendor review cadence: [TODO]
Cost budget and alerts: [TODO]
