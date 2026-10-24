# Operations and Incident Notes

## Current demo
No backend or monitoring is active. Browser localStorage is per-browser and can be cleared by the user. There is no multi-device sync or recovery guarantee.

## Before production
- Assign operational owner and incident contact.
- Establish uptime and support expectations.
- Configure monitoring with privacy-safe logs.
- Create and test backup/restore procedures.
- Document secret rotation, access revocation, and incident triage.
- Prepare a rollback/forward-fix procedure for migrations.
- Define data retention and deletion processes.

## Incident response outline
1. Contain the incident and restrict affected access.
2. Preserve necessary logs without broadening data exposure.
3. Assess what data, users, facilities, and systems are affected.
4. Engage security, privacy/legal, and clinical owners as appropriate.
5. Follow applicable notification duties and timelines after qualified review.
6. Recover from a known-good state and verify integrity.
7. Record root cause and prevention actions.
