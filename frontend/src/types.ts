export type FollowUpStatus =
  | 'Scheduled'
  | 'Due today'
  | 'Overdue'
  | 'Contact attempt pending'
  | 'Rescheduled'
  | 'Completed'
  | 'Closed';

export type ReferralStatus =
  | 'Draft'
  | 'Sent'
  | 'Received'
  | 'Appointment Pending'
  | 'Review required'
  | 'Completed'
  | 'Unable to Confirm'
  | 'Cancelled';

export type UserRole =
  | 'Health worker'
  | 'Supervisor'
  | 'Clinical reviewer'
  | 'Administrator';

export interface ScreeningObservation {
  id: string;
  patientId: string;
  screeningType: string;
  observationNotes: string;
  recordedBy: string;
  recordedAt: string;
}

export interface CaregiverConsent {
  patientId: string;
  status: 'Active' | 'Revoked' | 'Not Provided';
  scope: string;
  caregiverName: string;
  grantedDate: string;
  revokedDate?: string;
  recordedBy: string;
}

export interface Patient {
  id: string;
  displayName: string;
  ageBand: string;
  facility: string;
  contactPhone: string;
  createdAt: string;
  lastScreening: string;
  observation: string;
  notes?: string;
  consent?: CaregiverConsent;
}

export interface NewPatientFormData {
  displayName: string;
  ageBand: string;
  facility: string;
  contactPhone: string;
  observation: string;
  notes: string;
  consent?: {
    status: 'Active' | 'Revoked' | 'Not Provided';
    scope: string;
    caregiverName: string;
  };
}

export interface FollowUp {
  id: string;
  patientId: string;
  followUpType: string;
  dueDate: string;
  status: FollowUpStatus;
  assignedWorker: string;
  reason: string;
  rescheduleReason?: string;
  closeReason?: string;
  outcome?: string;
  nextFollowUpDate?: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  patientId: string;
  destination: string;
  receivingService: string;
  status: ReferralStatus;
  referralDate: string;
  appointmentDate?: string;
  nextFollowUpDate?: string;
  outcome?: string;
  unableToConfirmReason?: string;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface ReferralStatusHistoryItem {
  id: string;
  referralId: string;
  status: ReferralStatus;
  note?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  entityType: 'patient' | 'observation' | 'follow_up' | 'referral' | 'consent' | 'rules';
  entityId: string;
  action: string;
  actorRole: UserRole;
  actorId: string;
  description: string;
  timestamp: string;
}

export interface RuleConfig {
  overdueGraceDays: number;
  contactAttemptsBeforeEscalation: number;
  referralReviewDays: number;
  referralInactivityDays: number;
  flagUnassignedTasks: boolean;
  flagMissingNextFollowUp: boolean;
}

export interface CoordinationInsight {
  id: string;
  type: 'follow_up_overdue' | 'referral_inactivity' | 'unassigned_task' | 'missing_next_followup' | 'contact_pending';
  severity: 'urgent' | 'warning' | 'info';
  title: string;
  ruleExplanation: string;
  recordId: string;
  patientId: string;
  patientName: string;
  linkTab: 'Follow-ups' | 'Referrals' | 'Patients';
}

export interface AnalyticsSummary {
  totalPatients: number;
  totalFollowUps: number;
  dueTodayCount: number;
  overdueCount: number;
  completedFollowUps: number;
  unassignedFollowUps: number;
  totalReferrals: number;
  openReferrals: number;
  unconfirmedReferrals: number;
  completedReferrals: number;
  unableToConfirmReferrals: number;
  workloadByWorker: {
    worker: string;
    assignedCount: number;
    overdueCount: number;
    completedCount: number;
  }[];
  serviceBottlenecks: {
    destination: string;
    receivingService: string;
    total: number;
    open: number;
    unconfirmed: number;
    avgDaysOpen: number;
  }[];
  dailyTrends: {
    date: string;
    scheduled: number;
    completed: number;
    overdue: number;
  }[];
}
