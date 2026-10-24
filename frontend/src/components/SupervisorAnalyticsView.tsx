import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  Clock,
  HelpCircle,
  Info,
  Shield,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import type { Translations } from '../i18n';
import type { AnalyticsSummary } from '../types';

interface SupervisorAnalyticsViewProps {
  analytics: AnalyticsSummary;
  today: string;
  t: Translations;
}

export function SupervisorAnalyticsView({ analytics, today, t }: SupervisorAnalyticsViewProps) {
  const completionRate =
    analytics.totalFollowUps > 0
      ? Math.round((analytics.completedFollowUps / analytics.totalFollowUps) * 100)
      : 0;

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OPERATIONAL INTELLIGENCE</div>
          <h1>{t.navAnalytics}</h1>
          <p>
            {t.analyticsDescription}
          </p>
        </div>

        <div className="rule-badge">
          <BarChart2 size={16} /> Non-Identifiable Aggregates
        </div>
      </div>

      {/* Safety Notice */}
      <div className="non-diagnostic-box" style={{ marginBottom: '24px' }}>
        <Shield size={18} />
        <div>
          <strong>{t.operationalMetrics}</strong> {t.adminRulesDescription}
        </div>
      </div>

      {/* Aggregate Metric Highlights */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">{t.completionRate}</span>
            <div className="metric-icon teal"><CheckCircle size={20} /></div>
          </div>
          <div className="metric-value">{completionRate}%</div>
          <div className="metric-note">
            {analytics.completedFollowUps} of {analytics.totalFollowUps} tasks completed
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Overdue Tasks</span>
            <div className="metric-icon amber"><Clock size={20} /></div>
          </div>
          <div className="metric-value" style={{ color: analytics.overdueCount > 0 ? '#b45309' : 'inherit' }}>
            {analytics.overdueCount}
          </div>
          <div className="metric-note">Requires supervisory reallocation</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">{t.unassignedWork}</span>
            <div className="metric-icon red"><AlertTriangle size={20} /></div>
          </div>
          <div className="metric-value">{analytics.unassignedFollowUps}</div>
          <div className="metric-note">Tasks needing worker assignment</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">{t.unconfirmedReferrals}</span>
            <div className="metric-icon purple"><TrendingUp size={20} /></div>
          </div>
          <div className="metric-value">{analytics.unconfirmedReferrals}</div>
          <div className="metric-note">Pending handoff or outcome closure</div>
        </div>
      </div>

      {/* 2-Column Analytics Grid */}
      <div className="analytics-grid">
        {/* Workload Distribution */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{t.teamWorkload}</h2>
              <p>Active and completed task allocation across community health staff</p>
            </div>
            <UserCheck size={18} color="#0f766e" />
          </div>

          <div className="panel-body">
            {analytics.workloadByWorker.map((w) => {
              const maxCount = Math.max(...analytics.workloadByWorker.map((x) => x.assignedCount), 1);
              const pct = Math.round((w.assignedCount / maxCount) * 100);

              return (
                <div key={w.worker} className="workload-bar-item">
                  <div className="workload-bar-label">
                    <span>
                      <strong>{w.worker === 'Unassigned' ? 'Unassigned Queue' : w.worker}</strong>{' '}
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        ({w.assignedCount} tasks · {w.overdueCount} overdue · {w.completedCount} completed)
                      </span>
                    </span>
                    <span style={{ fontWeight: 700, color: w.overdueCount > 0 ? '#b45309' : '#0f766e' }}>
                      {w.assignedCount} total
                    </span>
                  </div>

                  <div className="workload-bar-track">
                    <div
                      className="workload-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: w.worker === 'Unassigned' ? '#ef4444' : '#0d9488',
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <div style={{ background: '#f8faf9', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#64748b', marginTop: '16px' }}>
              <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              <strong>{t.supervisorAction}</strong> {t.overdueTasks} · {t.unassignedWork} ({t.navFollowUps})
            </div>
          </div>
        </section>

        {/* Facility Bottleneck Analytics */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{t.receivingFacilityBottlenecks}</h2>
              <p>Open referrals and average turnaround days by receiving destination</p>
            </div>
          </div>

          <div className="panel-body">
            {analytics.serviceBottlenecks.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b' }}>{t.noFacilityReferrals}</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {analytics.serviceBottlenecks.map((item) => (
                  <div
                    key={item.destination}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: item.unconfirmed > 1 ? '#fffbf7' : '#ffffff',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '14px' }}>{item.destination}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.receivingService}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: item.unconfirmed > 0 ? '#b45309' : '#059669' }}>
                        {item.unconfirmed} unconfirmed
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Avg open: {item.avgDaysOpen} day{item.avgDaysOpen === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 7-Day Activity Trends Table */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{t.sevenDayTrend}</h2>
            <p>Scheduled, completed, and overdue follow-up counts over recent days</p>
          </div>
          <TrendingUp size={18} color="#0f766e" />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Active Scheduled Tasks</th>
                <th>Completed That Day</th>
                <th>Overdue Count</th>
                <th>Daily Health</th>
              </tr>
            </thead>
            <tbody>
              {analytics.dailyTrends.map((trend) => (
                <tr key={trend.date} style={{ fontWeight: trend.date === today ? 700 : 400 }}>
                  <td>
                    {trend.date} {trend.date === today && <span style={{ color: '#0f766e' }}>(Today)</span>}
                  </td>
                  <td>{trend.scheduled}</td>
                  <td style={{ color: '#059669', fontWeight: 600 }}>+{trend.completed}</td>
                  <td style={{ color: trend.overdue > 0 ? '#b45309' : 'inherit' }}>{trend.overdue}</td>
                  <td>
                    {trend.overdue === 0 ? (
                      <span className="status-pill complete">Optimal</span>
                    ) : (
                      <span className="status-pill overdue">{trend.overdue} flagged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Metric Calculation Explanations */}
      <div style={{ marginTop: '24px', background: '#f8faf9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={16} color="#0f766e" />
          How Operational Metrics Are Calculated
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
          <div>
            <strong>Completion Rate:</strong>
            <p style={{ margin: '4px 0 0' }}>
              Calculated as <code>(Completed Follow-ups ÷ Total Tasks) × 100</code>. Reflects the proportion of scheduled coordination handoffs that reached resolution.
            </p>
          </div>
          <div>
            <strong>Overdue Count:</strong>
            <p style={{ margin: '4px 0 0' }}>
              Number of unresolved tasks whose scheduled due date is greater than the configured overdue grace period (currently {analytics.overdueCount} tasks past due).
            </p>
          </div>
          <div>
            <strong>Avg Days Open:</strong>
            <p style={{ margin: '4px 0 0' }}>
              Sum of calendar days elapsed since referral date divided by unclosed referrals. Used to detect administrative handoff bottlenecks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
