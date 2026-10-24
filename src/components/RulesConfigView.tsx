import { useState } from 'react';
import {
  Activity,
  Bell,
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  GitBranch,
  Lock,
  Save,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import type { Translations } from '../i18n';
import type { FollowUp, Patient, Referral, RuleConfig, UserRole } from '../types';
import { followUpReason, isFollowUpOverdue, needsReferralReview, referralReason } from '../rules';

interface RulesConfigViewProps {
  rules: RuleConfig;
  onSaveRules: (newRules: RuleConfig) => Promise<{ success: boolean; error?: string }>;
  activeRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  followUps: FollowUp[];
  referrals: Referral[];
  patients: Patient[];
  today: string;
  t: Translations;
}

export function RulesConfigView({
  rules,
  onSaveRules,
  activeRole,
  onSwitchRole,
  followUps,
  referrals,
  patients,
  today,
  t,
}: RulesConfigViewProps) {
  const [formRules, setFormRules] = useState<RuleConfig>({ ...rules });
  const [isSaving, setIsSaving] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const patientMap = new Map(patients.map((p) => [p.id, p.displayName]));

  const canEdit = activeRole === 'Supervisor' || activeRole === 'Administrator';

  // Live preview using formRules
  const previewOverdue = followUps.filter((f) => isFollowUpOverdue(f, today, formRules));
  const previewReferralReviews = referrals.filter((r) => needsReferralReview(r, today, formRules));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPermissionError(null);
    setSaveSuccess(false);

    try {
      const res = await onSaveRules(formRules);
      if (!res.success && res.error) {
        setPermissionError(res.error);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update administrative rules';
      setPermissionError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TRANSPARENT ADMINISTRATIVE WORKFLOW</div>
          <h1>{t.navRules}</h1>
          <p>
            Configure administrative routing thresholds, overdue grace periods, and explainable flag criteria.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {canEdit ? (
            <div className="rule-badge">
              <ShieldCheck size={16} /> Authorized ({activeRole} Role)
            </div>
          ) : (
            <div className="rule-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
              <Lock size={16} /> Restricted to Supervisors and Administrators
            </div>
          )}
        </div>
      </div>

      {/* Non-clinical Disclaimer */}
      <div className="non-diagnostic-box">
        <Activity size={18} />
        <div>
          <strong>Administrative Rules Protocol:</strong> These configurable rules organize administrative queues, handoff reminders, and task follow-ups. They are NOT clinical triage algorithms, medical risk scores, or diagnostic indicators.
        </div>
      </div>

      {/* Permission Denied Banner (Demonstrates Backend Enforcement) */}
      {permissionError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #f87171',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            color: '#7f1d1d',
          }}
        >
          <Lock size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#dc2626' }} />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
              HTTP 403 Forbidden: Backend Authorization Enforced
            </strong>
            <p style={{ margin: '0 0 10px', fontSize: '13px', lineHeight: 1.5 }}>
              {permissionError}
            </p>
            <button
              type="button"
              className="primary-button"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => {
                onSwitchRole('Supervisor');
                setPermissionError(null);
              }}
            >
              <UserCheck size={14} /> Switch to Supervisor Role (Demo Simulator)
            </button>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#065f46',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} color="#059669" />
          Administrative routing rules updated successfully in local SQLite database!
        </div>
      )}

      <form onSubmit={handleSave}>
        <section className="panel" style={{ padding: '8px 24px 24px' }}>
          {/* Setting 1: Overdue Grace Period */}
          <div className="rule-setting">
            <div className="rule-setting-icon">
              <CalendarCheck size={20} />
            </div>
            <div className="rule-setting-copy">
              <h3>Overdue Grace Period</h3>
              <p>
                Number of full days after the scheduled due date before an unresolved follow-up task is flagged overdue in the work queue.
              </p>
            </div>
            <select
              disabled={!canEdit}
              value={formRules.overdueGraceDays}
              onChange={(e) => setFormRules({ ...formRules, overdueGraceDays: Number(e.target.value) })}
            >
              <option value={0}>0 days (Immediate)</option>
              <option value={1}>1 day (Recommended)</option>
              <option value={2}>2 days</option>
              <option value={3}>3 days</option>
              <option value={7}>7 days (1 week)</option>
            </select>
          </div>

          {/* Setting 2: Referral Review Threshold */}
          <div className="rule-setting">
            <div className="rule-setting-icon">
              <GitBranch size={20} />
            </div>
            <div className="rule-setting-copy">
              <h3>Referral Appointment Review Threshold</h3>
              <p>
                Days after a recorded appointment date without a confirmed outcome before a referral is flagged for coordinator review.
              </p>
            </div>
            <select
              disabled={!canEdit}
              value={formRules.referralReviewDays}
              onChange={(e) => setFormRules({ ...formRules, referralReviewDays: Number(e.target.value) })}
            >
              <option value={0}>0 days (Day of appointment)</option>
              <option value={1}>1 day</option>
              <option value={2}>2 days (Standard)</option>
              <option value={3}>3 days</option>
              <option value={5}>5 days</option>
            </select>
          </div>

          {/* Setting 3: Referral Inactivity Period */}
          <div className="rule-setting">
            <div className="rule-setting-icon">
              <Bell size={20} />
            </div>
            <div className="rule-setting-copy">
              <h3>Referral Inactivity Threshold</h3>
              <p>
                Days after referral submission without receipt or appointment confirmation before surfacing in the Needs Attention queue.
              </p>
            </div>
            <select
              disabled={!canEdit}
              value={formRules.referralInactivityDays}
              onChange={(e) => setFormRules({ ...formRules, referralInactivityDays: Number(e.target.value) })}
            >
              <option value={2}>2 days</option>
              <option value={3}>3 days</option>
              <option value={5}>5 days (Standard)</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
            </select>
          </div>

          {/* Setting 4: Unassigned Tasks Flag */}
          <div className="rule-setting">
            <div className="rule-setting-icon" style={{ background: '#fef2f2', color: '#b91c1c' }}>
              <Users size={20} />
            </div>
            <div className="rule-setting-copy">
              <h3>Flag Unassigned Coordination Tasks</h3>
              <p>
                Automatically surface any active follow-up task that has no health worker assigned.
              </p>
            </div>
            <select
              disabled={!canEdit}
              value={formRules.flagUnassignedTasks ? 'true' : 'false'}
              onChange={(e) => setFormRules({ ...formRules, flagUnassignedTasks: e.target.value === 'true' })}
            >
              <option value="true">Enabled (Flag unassigned)</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          {/* Setting 5: Missing Next Follow-up Date Flag */}
          <div className="rule-setting">
            <div className="rule-setting-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <CalendarCheck size={20} />
            </div>
            <div className="rule-setting-copy">
              <h3>Flag Referrals Missing Next Check-in Date</h3>
              <p>
                Alert care coordinators when an open referral lacks a scheduled next contact check date.
              </p>
            </div>
            <select
              disabled={!canEdit}
              value={formRules.flagMissingNextFollowUp ? 'true' : 'false'}
              onChange={(e) => setFormRules({ ...formRules, flagMissingNextFollowUp: e.target.value === 'true' })}
            >
              <option value="true">Enabled (Flag missing check-in)</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          {/* Live Preview Summary */}
          <div className="rule-summary">
            <div>
              <strong>Live Rule Impact Preview</strong>
              <span>Recalculated in real-time based on selected thresholds against demo date ({today})</span>
            </div>
            <div className="summary-number">
              {previewOverdue.length + previewReferralReviews.length}
              <span> flagged coordination items</span>
            </div>
          </div>

          {/* Examples Breakdown */}
          <div className="rule-examples">
            <h3>Why Cases Would Be Flagged Under These Rules</h3>
            {previewOverdue.slice(0, 3).map((f) => (
              <div key={f.id} className="rule-example">
                <CircleAlert size={16} />
                <div>
                  <strong>{f.id} · {patientMap.get(f.patientId) || f.patientId}</strong>
                  <span>{followUpReason(f, today, formRules)}</span>
                </div>
              </div>
            ))}
            {previewReferralReviews.slice(0, 3).map((r) => (
              <div key={r.id} className="rule-example">
                <GitBranch size={16} />
                <div>
                  <strong>{r.id} · {patientMap.get(r.patientId) || r.patientId} ({r.destination})</strong>
                  <span>{referralReason(r, today, formRules)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e3ebe8' }}>
            {!canEdit && (
              <span style={{ fontSize: '12px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} /> Read-only access: only Supervisors and Administrators can save routing rules.
              </span>
            )}
            <button
              type="submit"
              className="primary-button"
              disabled={!canEdit || isSaving}
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
