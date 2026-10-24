import { describe, expect, it } from 'vitest';
import {
  followUpReason,
  generateCoordinationInsights,
  isFollowUpDueToday,
  isFollowUpOverdue,
  isReferralUnconfirmed,
  needsReferralReview,
  referralReason,
} from './rules';
import type { FollowUp, Patient, Referral, RuleConfig } from './types';

const defaultTestRules: RuleConfig = {
  overdueGraceDays: 1,
  contactAttemptsBeforeEscalation: 3,
  referralReviewDays: 2,
  referralInactivityDays: 5,
  flagUnassignedTasks: true,
  flagMissingNextFollowUp: true,
};

const makeFollowUp = (overrides: Partial<FollowUp> = {}): FollowUp => ({
  id: 'FU-TEST-1',
  patientId: 'CR-1001',
  followUpType: 'Routine check-in',
  dueDate: '2026-10-20',
  status: 'Scheduled',
  assignedWorker: 'HW-01',
  reason: 'Routine check-in',
  updatedAt: '2026-10-18',
  ...overrides,
});

const makeReferral = (overrides: Partial<Referral> = {}): Referral => ({
  id: 'RF-TEST-1',
  patientId: 'CR-1001',
  destination: 'District Health Centre',
  receivingService: 'Primary Care Clinic',
  status: 'Sent',
  referralDate: '2026-10-20',
  appointmentDate: '2026-10-20',
  lastUpdatedBy: 'HW-01',
  updatedAt: '2026-10-20',
  ...overrides,
});

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'CR-1001',
  displayName: 'Test Patient',
  ageBand: '30–39',
  facility: 'Community Clinic A',
  contactPhone: '555-0101',
  createdAt: '2026-10-10',
  lastScreening: '2026-10-18',
  observation: 'Routine screening recorded.',
  ...overrides,
});

describe('Follow-up routing rules', () => {
  it('flags an unresolved follow-up beyond the grace period as overdue', () => {
    // Due 2026-10-20, checked against 2026-10-23 with grace of 1 day -> 3 days past, overdue!
    expect(isFollowUpOverdue(makeFollowUp(), '2026-10-23', defaultTestRules)).toBe(true);
  });

  it('does not flag a task within the grace period', () => {
    // Due 2026-10-22, checked against 2026-10-23 with grace of 1 day -> 1 day diff <= 1 grace, not overdue
    expect(isFollowUpOverdue(makeFollowUp({ dueDate: '2026-10-22' }), '2026-10-23', defaultTestRules)).toBe(false);
  });

  it('does not flag completed follow-ups as overdue regardless of date', () => {
    expect(isFollowUpOverdue(makeFollowUp({ status: 'Completed', dueDate: '2026-10-10' }), '2026-10-23', defaultTestRules)).toBe(false);
  });

  it('does not flag closed follow-ups as overdue', () => {
    expect(isFollowUpOverdue(makeFollowUp({ status: 'Closed', dueDate: '2026-10-10' }), '2026-10-23', defaultTestRules)).toBe(false);
  });

  it('detects tasks due today accurately', () => {
    expect(isFollowUpDueToday(makeFollowUp({ dueDate: '2026-10-23' }), '2026-10-23')).toBe(true);
    expect(isFollowUpDueToday(makeFollowUp({ dueDate: '2026-10-24' }), '2026-10-23')).toBe(false);
  });

  it('provides human-readable, explainable reason for overdue tasks', () => {
    const reason = followUpReason(makeFollowUp(), '2026-10-23', defaultTestRules);
    expect(reason).toContain('Follow-up overdue');
    expect(reason).toContain('exceeding 1-day grace period');
  });

  it('explains pending contact attempt status', () => {
    const reason = followUpReason(makeFollowUp({ status: 'Contact attempt pending', dueDate: '2026-10-24' }), '2026-10-23', defaultTestRules);
    expect(reason).toContain('Contact attempt is pending');
  });

  it('flags unassigned worker tasks', () => {
    const reason = followUpReason(makeFollowUp({ assignedWorker: 'Unassigned', dueDate: '2026-10-25' }), '2026-10-23', defaultTestRules);
    expect(reason).toContain('Unassigned task');
  });
});

describe('Referral review & loop closure rules', () => {
  it('flags a referral when appointment passed threshold without an outcome', () => {
    // Appointment 2026-10-20, checked against 2026-10-23 (3 days > 2 day review threshold)
    expect(needsReferralReview(makeReferral(), '2026-10-23', defaultTestRules)).toBe(true);
  });

  it('does not flag completed referrals', () => {
    expect(needsReferralReview(makeReferral({ status: 'Completed' }), '2026-10-23', defaultTestRules)).toBe(false);
  });

  it('does not flag unable to confirm referrals', () => {
    expect(needsReferralReview(makeReferral({ status: 'Unable to Confirm' }), '2026-10-23', defaultTestRules)).toBe(false);
  });

  it('flags inactive referrals when referralDate exceeds inactivity threshold without appointment', () => {
    // Sent on 2026-10-15 (8 days before 2026-10-23 > 5 days inactivity threshold)
    const inactiveReferral = makeReferral({
      referralDate: '2026-10-15',
      appointmentDate: undefined,
      status: 'Sent',
    });
    expect(needsReferralReview(inactiveReferral, '2026-10-23', defaultTestRules)).toBe(true);
  });

  it('identifies unconfirmed referrals for loop closure tracking', () => {
    expect(isReferralUnconfirmed(makeReferral({ status: 'Sent' }))).toBe(true);
    expect(isReferralUnconfirmed(makeReferral({ status: 'Received' }))).toBe(true);
    expect(isReferralUnconfirmed(makeReferral({ status: 'Appointment Pending' }))).toBe(true);
    expect(isReferralUnconfirmed(makeReferral({ status: 'Completed' }))).toBe(false);
    expect(isReferralUnconfirmed(makeReferral({ status: 'Unable to Confirm' }))).toBe(false);
  });

  it('explains referral review reason clearly', () => {
    const reason = referralReason(makeReferral(), '2026-10-23', defaultTestRules);
    expect(reason).toContain('Appointment follow-up overdue');
  });
});

describe('Coordination insights generation', () => {
  it('surfaces overdue follow-ups and unconfirmed referrals in Needs Attention', () => {
    const patients = [makePatient()];
    const followUps = [makeFollowUp()];
    const referrals = [makeReferral()];

    const insights = generateCoordinationInsights(patients, followUps, referrals, '2026-10-23', defaultTestRules);

    expect(insights.length).toBeGreaterThanOrEqual(2);
    const fuInsight = insights.find((i) => i.recordId === 'FU-TEST-1');
    expect(fuInsight).toBeDefined();
    expect(fuInsight?.type).toBe('follow_up_overdue');
    expect(fuInsight?.ruleExplanation).toContain('grace period');

    const refInsight = insights.find((i) => i.recordId === 'RF-TEST-1');
    expect(refInsight).toBeDefined();
    expect(refInsight?.type).toBe('referral_inactivity');
  });
});
