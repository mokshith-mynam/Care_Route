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
          <div className="eyebrow">AUDIT & TRACEABILITY</div>
          <h1>{t.navTimeline}</h1>
          <p>
            Chronological audit stream of coordination events, status updates, rescheduling actions, and configuration changes.
          </p>
        </div>

        <div className="rule-badge">
          <History size={16} /> Immutable Audit History
        </div>
      </div>

      <div className="non-diagnostic-box" style={{ marginBottom: '20px' }}>
        <Shield size={18} />
        <div>
          <strong>Factual Audit History:</strong> This event timeline tracks administrative actions (who recorded, scheduled, or updated a record and when). It does not represent clinical chart notes, electronic medical records, or diagnostic assessments.
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
              placeholder="Filter timeline by record ID, worker, or description..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600 }}>Entity Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Activities</option>
              <option value="patient">Patients</option>
              <option value="observation">Screening Observations</option>
              <option value="follow_up">Follow-ups</option>
              <option value="referral">Referrals</option>
              <option value="consent">Caregiver Consent</option>
              <option value="rules">Routing Rules</option>
            </select>

            <span style={{ fontSize: '13px', color: '#64748b' }}>
              <strong>{filtered.length}</strong> events
            </span>
          </div>
        </div>

        <div className="panel-body">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <History size={32} />
              <strong>No events found</strong>
              <p>No recorded activities match your selected filter.</p>
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
