# Release Checklist

## MVP demo release
- [ ] All demo records are synthetic.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes or known lint findings are fixed/documented.
- [ ] Create/update patient, follow-up, and referral flows tested.
- [ ] Dashboard numbers recalculate from stored records.
- [ ] No exposed secrets or real patient data in Git history.
- [ ] Public demo clearly says synthetic data only and is not for clinical use.
- [ ] Reset demo works and presentation backup screenshots exist.

## Production gate — not satisfied by this prototype
- [ ] Supabase integration implemented, not just configured.
- [ ] Role/facility RLS policies reviewed and negative-tested.
- [ ] Self-role escalation prevented; privileged changes server-controlled.
- [ ] Trusted audit trail and security monitoring implemented.
- [ ] Privacy/legal and clinical workflow review completed.
- [ ] Backup, restore, incident response, and rollback tested.
- [ ] Accessibility, dependency, secret, and security scans reviewed.
- [ ] Production data retention/deletion and support model approved.
