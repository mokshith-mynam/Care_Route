import { useState } from 'react';
import {
  History,
  Search,
  Shield,
} from 'lucide-react';
import type { Translations } from '../i18n';
import type { AuditEvent } from '../types';

interface TimelineViewProps {
  events: AuditEvent[];
  t: Translations;
}

export function TimelineView({ events, t }: TimelineViewProps) {
  const [filterType, setFilterType] = useState<string>('All');
  const [query, setQuery] = useState<string>('');

  const filtered = events.filter((evt) => {
    if (filterType !== 'All' && evt.entityType !== filterType) return false;
    const searchable = `${evt.id} ${evt.entityId} ${evt.description} ${evt.actorId} ${evt.actorRole}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t.navTimeline}</div>
          <h1>{t.navTimeline}</h1>
          <p>
            {t.timelineDescription}
          </p>
        </div>

        <div className="rule-badge">
          <History size={16} /> {t.factualAuditHistory.replace(':', '')}
        </div>
      </div>

      <div className="non-diagnostic-box" style={{ marginBottom: '20px' }}>
        <Shield size={18} />
        <div>
          <strong>{t.factualAuditHistory}</strong> {t.factualAuditDescription}
        </div>
      </div>

      <section className="panel">
        <div className="table-toolbar">
          <div className="search-input-group">
            <Search size={16} color="#6b827e" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600 }}>{t.entityType}</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">{t.allActivities}</option>
              <option value="patient">{t.navPatients}</option>
              <option value="observation">{t.screeningObservations}</option>
              <option value="follow_up">{t.navFollowUps}</option>
              <option value="referral">{t.navReferrals}</option>
              <option value="consent">{t.caregiverConsent}</option>
              <option value="rules">{t.navRules}</option>
            </select>

            <span style={{ fontSize: '13px', color: '#64748b' }}>
              <strong>{filtered.length}</strong> {t.events}
            </span>
          </div>
        </div>

        <div className="panel-body">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <History size={32} />
              <strong>{t.noEvents}</strong>
              <p>{t.noActivitiesMatch}</p>
            </div>
          ) : (
            <div className="timeline-stream">
              {filtered.map((evt) => (
                <div key={evt.id} className="timeline-item">
                  <div className="timeline-dot" />

                  <div className="timeline-content">
                    <div className="timeline-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="timeline-actor-chip">
                          {evt.actorRole}: {evt.actorId}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          [{evt.action}]
                        </span>
                        <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', color: '#64748b' }}>
                          {evt.entityType}: {evt.entityId}
                        </span>
                      </div>

                      <span className="timeline-time">{evt.timestamp}</span>
                    </div>

                    <p className="timeline-desc">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
