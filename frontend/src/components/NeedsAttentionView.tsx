import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock,
  GitBranch,
  Shield,
  UserX,
} from 'lucide-react';
import type { Translations } from '../i18n';
import type { CoordinationInsight, FollowUp, Patient, Referral, RuleConfig } from '../types';
import type { MainTab } from './Sidebar';
import { generateCoordinationInsights } from '../rules';

interface NeedsAttentionViewProps {
  patients: Patient[];
  followUps: FollowUp[];
  referrals: Referral[];
  rules: RuleConfig;
  today: string;
  onNavigateTab: (tab: MainTab) => void;
  onSelectPatient: (patientId: string) => void;
  t: Translations;
}

export function NeedsAttentionView({
  patients,
  followUps,
  referrals,
  rules,
  today,
  onNavigateTab,
  onSelectPatient,
  t,
}: NeedsAttentionViewProps) {
  const insights: CoordinationInsight[] = generateCoordinationInsights(
    patients,
    followUps,
    referrals,
    today,
    rules
  );

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t.needsAttention}</div>
          <h1>{t.navNeedsAttention}</h1>
          <p>
            {t.attentionDescription}
          </p>
        </div>

        <div className="rule-badge">
          <Shield size={16} /> Transparent Rule Evaluation
        </div>
      </div>

      <div className="non-diagnostic-box">
        <CircleAlert size={18} />
        <div>
          <strong>{t.operationalWorkflowOnly}</strong> {t.attentionWarning}
        </div>
      </div>

      {insights.length === 0 ? (
        <section className="panel" style={{ padding: '40px 20px' }}>
          <div className="empty-state">
            <CheckCircle2 size={36} color="#059669" />
            <strong>{t.noCoordinationGaps}</strong>
            <p>
              All active follow-ups are within the {rules.overdueGraceDays}-day grace period, all referrals have recorded updates, and no unassigned tasks exist.
            </p>
          </div>
        </section>
      ) : (
        <div>
          <div style={{ marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
            {insights.length} {t.itemsRequiringReview}
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {insights.map((insight) => (
              <div key={insight.id} className="insight-card">
                <div className={`insight-icon ${insight.severity}`}>
                  {insight.type === 'follow_up_overdue' && <Clock size={20} />}
                  {insight.type === 'referral_inactivity' && <GitBranch size={20} />}
                  {insight.type === 'unassigned_task' && <UserX size={20} />}
                  {insight.type === 'missing_next_followup' && <AlertCircle size={20} />}
                </div>

                <div className="insight-main">
                  <h3>{insight.title}</h3>
                  <div className="insight-meta">
                    <span>
                      Person:{' '}
                      <strong
                        style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0f766e' }}
                        onClick={() => onSelectPatient(insight.patientId)}
                      >
                        {insight.patientName} ({insight.patientId})
                      </strong>
                    </span>
                    <span>·</span>
                    <span>{t.recordId}: <strong>{insight.recordId}</strong></span>
                  </div>

                  <div className="insight-rule-box">
                    <strong>{t.administrativeTrigger}</strong> {insight.ruleExplanation}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    className="primary-button"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                    onClick={() => onNavigateTab(insight.linkTab)}
                  >
                    Open {insight.linkTab} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
