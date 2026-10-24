import {
  ArrowDownRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  CircleAlert,
  GitBranch,
  Plus,
  ShieldAlert,
  UserPlus,
  Users,
} from 'lucide-react';
import type { Translations } from '../i18n';
import type { FollowUp, Patient, Referral, RuleConfig } from '../types';
import type { MainTab } from './Sidebar';
import { followUpReason, isFollowUpOverdue } from '../rules';

interface DashboardViewProps {
  patients: Patient[];
  followUps: FollowUp[];
  referrals: Referral[];
  rules: RuleConfig;
  today: string;
  onOpenNewFollowUp: () => void;
  onOpenNewReferral: () => void;
  onOpenNewPatient: () => void;
  onNavigateTab: (tab: MainTab) => void;
  onCompleteFollowUp: (id: string) => void;
  onRescheduleFollowUp: (id: string) => void;
  onCloseFollowUp?: (id: string) => void;
  onSelectPatient: (patientId: string) => void;
  t: Translations;
}

export function DashboardView({
  patients,
  followUps,
  referrals,
  rules,
  today,
  onOpenNewFollowUp,
  onOpenNewReferral,
  onOpenNewPatient,
  onNavigateTab,
  onCompleteFollowUp,
  onRescheduleFollowUp,
  onSelectPatient,
  t,
}: DashboardViewProps) {
  const patientMap = new Map(patients.map((p) => [p.id, p.displayName]));

  const dueToday = followUps.filter(
    (f) => f.dueDate === today && f.status !== 'Completed' && f.status !== 'Closed'
  );
  const overdue = followUps.filter((f) => isFollowUpOverdue(f, today, rules));
  const openReferrals = referrals.filter(
    (r) => !['Completed', 'Cancelled', 'Unable to Confirm'].includes(r.status)
  );

  return (
    <div>
      {/* Page Heading & Quick Actions */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t.overviewEyebrow}</div>
          <h1>{t.overviewTitle} <span>✳</span></h1>
          <p>{t.overviewDescription}</p>
        </div>

        <div className="heading-actions">
          <button type="button" className="outline-button" onClick={onOpenNewPatient}>
            <UserPlus size={16} /> {t.addPatient}
          </button>
          <button type="button" className="secondary-button" onClick={onOpenNewReferral}>
            <GitBranch size={16} /> {t.newReferral}
          </button>
          <button type="button" className="primary-button" onClick={onOpenNewFollowUp}>
            <Plus size={16} /> {t.newFollowUp}
          </button>
        </div>
      </div>

      {/* Non-diagnostic safety disclaimer */}
      <div className="non-diagnostic-box">
        <ShieldAlert size={18} />
        <div>
          <strong>{t.protocolTitle}</strong> {t.nonDiagnosticDisclaimer}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => onNavigateTab('Patients')} style={{ cursor: 'pointer' }}>
          <div className="metric-header">
            <span className="metric-label">{t.activePatients}</span>
            <div className="metric-icon teal"><Users size={20} /></div>
          </div>
          <div className="metric-value">{patients.length}</div>
          <div className="metric-note">{t.syntheticRecords}</div>
        </div>

        <div className="metric-card" onClick={() => onNavigateTab('Follow-ups')} style={{ cursor: 'pointer' }}>
          <div className="metric-header">
            <span className="metric-label">{t.dueToday}</span>
            <div className="metric-icon blue"><CalendarCheck size={20} /></div>
          </div>
          <div className="metric-value">{dueToday.length}</div>
          <div className="metric-note">{t.dueForCheckin} {today}</div>
        </div>

        <div className="metric-card" onClick={() => onNavigateTab('Follow-ups')} style={{ cursor: 'pointer' }}>
          <div className="metric-header">
            <span className="metric-label">{t.overdueTasks}</span>
            <div className="metric-icon amber"><CircleAlert size={20} /></div>
          </div>
          <div className="metric-value" style={{ color: overdue.length > 0 ? '#b45309' : 'inherit' }}>
            {overdue.length}
          </div>
          <div className="metric-note">{t.exceedsGrace.replace('{days}', String(rules.overdueGraceDays))}</div>
        </div>

        <div className="metric-card" onClick={() => onNavigateTab('Referrals')} style={{ cursor: 'pointer' }}>
          <div className="metric-header">
            <span className="metric-label">{t.openReferrals}</span>
            <div className="metric-icon purple"><GitBranch size={20} /></div>
          </div>
          <div className="metric-value">{openReferrals.length}</div>
          <div className="metric-note">{t.pendingHandoff}</div>
        </div>
      </div>

      {/* 2-Column Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Priority Work Queue (Explainable Rules) */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{t.priorityQueue}</h2>
              <p>{t.queueDescription}</p>
            </div>
            <button type="button" className="text-button" onClick={() => onNavigateTab('Follow-ups')}>
              {t.viewAllFollowUps} <ArrowDownRight size={14} />
            </button>
          </div>

          <div className="panel-body">
            {overdue.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={32} color="#059669" />
                <strong>{t.noOverdueFollowUps}</strong>
                <p>{t.withinGrace.replace('{days}', String(rules.overdueGraceDays))}</p>
              </div>
            ) : (
              overdue.slice(0, 5).map((item) => (
                <div key={item.id} className="task-item">
                  <div className="task-avatar urgent">
                    <CircleAlert size={18} />
                  </div>

                  <div className="task-details">
                    <div className="task-details-top">
                      <strong
                        onClick={() => onSelectPatient(item.patientId)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        title={t.viewProfile}
                      >
                        {patientMap.get(item.patientId) || item.patientId}
                      </strong>
                      <span className="task-id-badge">{item.id}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{t.assigned} {item.assignedWorker}</span>
                    </div>

                    <div className="task-reason">
                      <strong>{item.followUpType}:</strong> {item.reason}
                    </div>

                    <div className="task-explain">
                      {followUpReason(item, today, rules)}
                    </div>
                  </div>

                  <div className="task-actions">
                    <span className="status-pill overdue">{t.statusOverdue}</span>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => onCompleteFollowUp(item.id)}
                        title={t.markCompleted}
                      >
                        <Check size={12} /> {t.resolve}
                      </button>
                      <button
                        type="button"
                        className="outline-button"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => onRescheduleFollowUp(item.id)}
                        title={t.rescheduleWithReason}
                      >
                        {t.reschedule}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e3ebe8', fontSize: '11px', color: '#64748b' }}>
              <span>
                <CircleAlert size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#f59e0b' }} />
                {t.rulesChecked} <strong>{today}</strong>
              </span>
              <button
                type="button"
                className="text-button"
                style={{ fontSize: '11px' }}
                onClick={() => onNavigateTab('Rules')}
              >
                {t.configureGrace} ({rules.overdueGraceDays}d)
              </button>
            </div>
          </div>
        </section>

        {/* Recent Open Referrals */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{t.referralHandoffs}</h2>
              <p>{t.pendingHandoff}</p>
            </div>
            <button type="button" className="text-button" onClick={() => onNavigateTab('Referrals')}>
              {t.loopClosure} <ArrowDownRight size={14} />
            </button>
          </div>

          <div className="panel-body">
            {openReferrals.length === 0 ? (
              <div className="empty-state">
                <Check size={32} color="#059669" />
                <strong>{t.noOpenReferrals}</strong>
                <p>{t.allReferralsRecorded}</p>
              </div>
            ) : (
              openReferrals.slice(0, 5).map((r) => (
                <div key={r.id} className="task-item">
                  <div className="task-avatar" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                    <GitBranch size={18} />
                  </div>

                  <div className="task-details">
                    <div className="task-details-top">
                      <strong
                        onClick={() => onSelectPatient(r.patientId)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {patientMap.get(r.patientId) || r.patientId}
                      </strong>
                      <span className="task-id-badge">{r.id}</span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#334155' }}>
                      <strong>Destination:</strong> {r.destination} ({r.receivingService})
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                      Sent on {r.referralDate} {r.appointmentDate ? `· Appt: ${r.appointmentDate}` : '· Appointment pending'}
                    </div>
                  </div>

                  <div className="task-actions">
                    <span className={`status-pill ${r.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))
            )}

            <button
              type="button"
              className="secondary-button"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => onNavigateTab('Referrals')}
            >
              {t.openFullRegistry}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
