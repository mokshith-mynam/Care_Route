# Manual Acceptance Test Sheet

- [ ] Start with clean demo storage and confirm seeded patient/follow-up/referral counts.
- [ ] Search CR-1002; verify result is stable.
- [ ] Add a fictional patient; refresh and confirm persistence.
- [ ] Add a follow-up; verify it appears in the table.
- [ ] Complete an overdue follow-up; confirm overdue count drops.
- [ ] Change grace period; verify flags update.
- [ ] Create a referral; change to Completed; verify status persists.
- [ ] Search for a nonexistent patient; verify empty state.
- [ ] Resize to mobile width; verify navigation and tables remain usable.
- [ ] Use keyboard to navigate controls and modal.
- [ ] Confirm no real patient data or secrets exist in repository.
- [ ] Confirm public-facing disclaimer is visible.
