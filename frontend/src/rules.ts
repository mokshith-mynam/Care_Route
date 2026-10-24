import type { CoordinationInsight, FollowUp, Patient, Referral, RuleConfig } from './types';

const closedFollowUpStatuses = new Set(['Completed', 'Closed']);
const closedReferralStatuses = new Set(['Completed', 'Cancelled', 'Unable to Confirm']);

export function dayNumber(isoDate: string): number {
  if (!isoDate) return 0;
  const [year, month, day] = isoDate.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

export function daysBetween(dateA: string, dateB: string): number {
  return dayNumber(dateB) - dayNumber(dateA);
}

export function isFollowUpOverdue(item: FollowUp, today: string, rules: RuleConfig): boolean {
  if (closedFollowUpStatuses.has(item.status)) return false;
  return dayNumber(today) - dayNumber(item.dueDate) > rules.overdueGraceDays;
}

export function isFollowUpDueToday(item: FollowUp, today: string): boolean {
  if (closedFollowUpStatuses.has(item.status)) return false;
  return item.dueDate === today;
}

export function needsReferralReview(item: Referral, today: string, rules: RuleConfig): boolean {
  if (closedReferralStatuses.has(item.status)) return false;
  if (item.status === 'Review required') return true;

  if (item.appointmentDate) {
    return dayNumber(today) - dayNumber(item.appointmentDate) > rules.referralReviewDays;
  }

  // If no appointment date is set, check inactivity threshold
  if (rules.referralInactivityDays && rules.referralInactivityDays > 0) {
    return dayNumber(today) - dayNumber(item.referralDate) > rules.referralInactivityDays;
  }

  return false;
}

export function isReferralUnconfirmed(item: Referral): boolean {
  return ['Draft', 'Sent', 'Received', 'Appointment Pending', 'Review required'].includes(item.status);
}

export function followUpReason(item: FollowUp, today: string, rules: RuleConfig): string | null {
  if (isFollowUpOverdue(item, today, rules)) {
    const days = dayNumber(today) - dayNumber(item.dueDate);
    return `Follow-up overdue: due ${item.dueDate} (${days} day${days === 1 ? '' : 's'} past, exceeding ${rules.overdueGraceDays}-day grace period; status: ${item.status}).`;
  }
  if (!item.assignedWorker || item.assignedWorker === 'Unassigned') {
    return 'Unassigned task: No health worker assigned to this coordination follow-up.';
  }
  if (item.status === 'Contact attempt pending') {
    return 'Contact attempt is pending; update the outcome or escalate according to the configured workflow.';
  }
  if (item.status === 'Rescheduled') {
    return item.rescheduleReason
      ? `Task rescheduled: ${item.rescheduleReason}`
      : 'Task was rescheduled; pending next contact date.';
  }
  return null;
}

export function referralReason(item: Referral, today: string, rules: RuleConfig): string | null {
  if (item.status === 'Review required') {
    return 'Referral flagged for administrative review by care coordinator.';
  }
  if (item.appointmentDate && dayNumber(today) - dayNumber(item.appointmentDate) > rules.referralReviewDays) {
    const days = dayNumber(today) - dayNumber(item.appointmentDate);
    return `Appointment follow-up overdue: appointment date was ${item.appointmentDate} (${days} days ago), exceeding ${rules.referralReviewDays}-day threshold with no outcome recorded.`;
  }
  if (rules.referralInactivityDays && dayNumber(today) - dayNumber(item.referralDate) > rules.referralInactivityDays) {
    const days = dayNumber(today) - dayNumber(item.referralDate);
    return `Handoff unconfirmed: sent ${days} days ago (threshold: ${rules.referralInactivityDays} days) with no receipt or appointment update.`;
  }
  if (rules.flagMissingNextFollowUp && isReferralUnconfirmed(item) && !item.nextFollowUpDate) {
    return 'Coordination gap: Open referral has no scheduled next follow-up check date.';
  }
  return null;
}

export function generateCoordinationInsights(
  patients: Patient[],
  followUps: FollowUp[],
  referrals: Referral[],
  today: string,
  rules: RuleConfig
): CoordinationInsight[] {
  const insights: CoordinationInsight[] = [];
  const patientMap = new Map(patients.map((p) => [p.id, p.displayName]));

  // 1. Overdue follow-ups
  for (const f of followUps) {
    if (isFollowUpOverdue(f, today, rules)) {
      const days = dayNumber(today) - dayNumber(f.dueDate);
      insights.push({
        id: `INS-FU-${f.id}`,
        type: 'follow_up_overdue',
        severity: days > 3 ? 'urgent' : 'warning',
        title: `Overdue Follow-Up: ${f.id} (${f.reason})`,
        ruleExplanation: `Rule: Task due ${f.dueDate} is ${days} days past, exceeding the ${rules.overdueGraceDays}-day grace period.`,
        recordId: f.id,
        patientId: f.patientId,
        patientName: patientMap.get(f.patientId) || f.patientId,
        linkTab: 'Follow-ups',
      });
    } else if (rules.flagUnassignedTasks && (!f.assignedWorker || f.assignedWorker === 'Unassigned') && !closedFollowUpStatuses.has(f.status)) {
      insights.push({
        id: `INS-UNASG-${f.id}`,
        type: 'unassigned_task',
        severity: 'info',
        title: `Unassigned Follow-Up: ${f.id}`,
        ruleExplanation: 'Rule: Active coordination task has no health worker assigned.',
        recordId: f.id,
        patientId: f.patientId,
        patientName: patientMap.get(f.patientId) || f.patientId,
        linkTab: 'Follow-ups',
      });
    }
  }

  // 2. Unconfirmed or stale referrals
  for (const r of referrals) {
    if (needsReferralReview(r, today, rules)) {
      const reason = referralReason(r, today, rules) || 'Referral requires review.';
      insights.push({
        id: `INS-RF-${r.id}`,
        type: 'referral_inactivity',
        severity: 'warning',
        title: `Referral Needs Review: ${r.id} (${r.destination})`,
        ruleExplanation: `Rule: ${reason}`,
        recordId: r.id,
        patientId: r.patientId,
        patientName: patientMap.get(r.patientId) || r.patientId,
        linkTab: 'Referrals',
      });
    } else if (rules.flagMissingNextFollowUp && isReferralUnconfirmed(r) && !r.nextFollowUpDate) {
      insights.push({
        id: `INS-MISSED-CHECK-${r.id}`,
        type: 'missing_next_followup',
        severity: 'info',
        title: `Missing Next Check Date: ${r.id}`,
        ruleExplanation: 'Rule: Referral is pending handoff confirmation but has no next follow-up date scheduled.',
        recordId: r.id,
        patientId: r.patientId,
        patientName: patientMap.get(r.patientId) || r.patientId,
        linkTab: 'Referrals',
      });
    }
  }

  return insights;
}
