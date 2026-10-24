# Data Model, Privacy, and Retention

## 1. Data inventory
| Data field/category | Purpose | Source | Sensitivity | Stored where | Who can access | Retention/deletion |
|---|---|---|---|---|---|---|
| [TODO] | [TODO] | [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

Collect only data needed for a defined purpose. Avoid collecting government IDs, precise location, contacts, biometrics, health data, or other sensitive data unless necessary and approved.

## 2. Data model
For every entity define:
- Fields and types
- Primary key and foreign keys
- Required/optional fields
- Constraints and indexes
- Tenant/owner relationship
- Creation/update timestamps
- Soft-delete vs permanent-delete semantics
- Audit requirements

Entity: [TODO]
Relationships: [TODO]

## 3. Privacy lifecycle
Document collection, use, sharing, access, correction, export, retention, deletion, backups, and vendor processing. Explain what deletion means for backups and legal holds.

## 4. Consent and transparency
- What is collected and why: [TODO]
- Legal basis / consent flow where applicable: [TODO]
- How users withdraw consent or close accounts: [TODO]
- Privacy notice owner and version: [TODO]
- Third-party processors and sharing: [TODO]

## 5. Access and tenancy
Define access rules explicitly. Example: a user may read or modify only records within their authorized account/team. Enforce this in the backend/database policy, not only by hiding UI controls. Test cross-user and cross-tenant access.

## 6. Synthetic data
Use invented people, addresses, emails, and records. Do not use real customer/patient data in demos. Clearly mark seeded accounts and disable demo credentials in production.

## 7. Jurisdiction and compliance
Target countries/regions: [TODO]
Applicable privacy, consumer, accessibility, sector, data-localization, and platform rules: [TODO]
Reviewer / decision date: [TODO]

Do not claim compliance merely because a checklist exists. Obtain qualified legal/privacy review when regulated or sensitive data is involved.
