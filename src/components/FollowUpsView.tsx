import { useState } from 'react';
import {
  CalendarCheck,
  Check,
  CircleAlert,
  Plus,
  Search,
  X,
} from 'lucide-react';
import type { Translations } from '../i18n';
import type { FollowUp, FollowUpStatus, Patient, RuleConfig } from '../types';
import { followUpReason, isFollowUpDueToday, isFollowUpOverdue } from '../rules';

interface FollowUpsViewProps {
  followUps: FollowUp[];
  patients: Patient[];
  rules: RuleConfig;
  today: string;
  onOpenNewFollowUp: () => void;
  onUpdateStatus: (id: string, status: FollowUpStatus, outcome?: string) => void;
  onReschedule: (id: string, newDate: string, reason: string) => void;
  onCloseTask: (id: string, reason: string) => void;
  onReassign: (id: string, worker: string) => void;
  onSelectPatient: (patientId: string) => void;
  t: Translations;
}

export function FollowUpsView({
  followUps,
  patients,
  rules,
  today,
  onOpenNewFollowUp,
  onUpdateStatus,
  onReschedule,
  onCloseTask,
  onReassign,
  onSelectPatient,
  t,
}: FollowUpsViewProps) {
  const [filterTab, setFilterTab] = useState<'All' | 'Due Today' | 'Overdue' | 'Contact Pending' | 'Rescheduled' | 'Completed'>('All');
  const [query, setQuery] = useState('');
  const [workerFilter, setWorkerFilter] = useState('All');

  // Reschedule Modal State
  const [rescheduleItem, setRescheduleItem] = useState<FollowUp | null>(null);
  const [newDueDate, setNewDueDate] = useState(today);
  const [rescheduleReason, setRescheduleReason] = useState('Patient requested alternate date');

  // Close Task Modal State
  const [closeItem, setCloseItem] = useState<FollowUp | null>(null);
  const [closeReason, setCloseReason] = useState('Resolved administratively');

  // Complete Outcome Modal State
  const [completeItem, setCompleteItem] = useState<FollowUp | null>(null);
  const [completeOutcome, setCompleteOutcome] = useState('Visit completed as scheduled');

  const patientMap = new Map(patients.map((p) => [p.id, p.displayName]));

  const filtered = followUps.filter((item) => {
    // 1. Tab filter
    if (filterTab === 'Due Today' && !isFollowUpDueToday(item, today)) return false;
    if (filterTab === 'Overdue' && !isFollowUpOverdue(item, today, rules)) return false;
    if (filterTab === 'Contact Pending' && item.status !== 'Contact attempt pending') return false;
    if (filterTab === 'Rescheduled' && item.status !== 'Rescheduled') return false;
    if (filterTab === 'Completed' && item.status !== 'Completed' && item.status !== 'Closed') return false;

    // 2. Worker filter
    if (workerFilter !== 'All') {
      if (workerFilter === 'Unassigned' && item.assignedWorker && item.assignedWorker !== 'Unassigned') return false;
      if (workerFilter !== 'Unassigned' && item.assignedWorker !== workerFilter) return false;
    }

    // 3. Search query
    const patientName = patientMap.get(item.patientId) || '';
    const searchable = `${item.id} ${item.patientId} ${patientName} ${item.reason} ${item.assignedWorker} ${item.status}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleItem) return;
    onReschedule(rescheduleItem.id, newDueDate, rescheduleReason);
    setRescheduleItem(null);
  };

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeItem) return;
    onCloseTask(closeItem.id, closeReason);
    setCloseItem(null);
  };

  const handleConfirmComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeItem) return;
    onUpdateStatus(completeItem.id, 'Completed', completeOutcome);
    setCompleteItem(null);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TASK WORKFLOW</div>
          <h1>{t.navFollowUps}</h1>
          <p>Schedule, complete, reschedule, and track routine follow-up tasks with transparent status reasons.</p>
        </div>

        <button type="button" className="primary-button" onClick={onOpenNewFollowUp}>
          <Plus size={16} /> {t.newFollowUp}
        </button>
      </div>

      {/* Transparent Rule Explainer Banner */}
      <div className="inline-alert" style={{ marginBottom: '20px' }}>
        <CircleAlert size={18} />
        <div>
          <strong>Transparent Overdue Rule:</strong> A follow-up task is flagged overdue only when it remains unresolved and its scheduled due date exceeds the configured grace period of <strong>{rules.overdueGraceDays} day(s)</strong> (evaluated against current date <strong>{today}</strong>). Completed or closed tasks are never flagged overdue.
        </div>
      </div>

      <section className="panel">
        {/* Subtabs for Status Filtering */}
        <div className="subtabs">
          {(['All', 'Due Today', 'Overdue', 'Contact Pending', 'Rescheduled', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              className={`subtab-btn ${filterTab === tab ? 'active' : ''}`}
              onClick={() => setFilterTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-input-group">
            <Search size={16} color="#6b827e" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, person name, worker, reason..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600 }}>Worker:</label>
            <select
              value={workerFilter}
              onChange={(e) => setWorkerFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Workers</option>
              <option value="HW-01">HW-01 (Priya)</option>
              <option value="HW-02">HW-02 (David)</option>
              <option value="HW-03">HW-03 (Fatima)</option>
              <option value="Unassigned">Unassigned</option>
            </select>

            <span style={{ fontSize: '13px', color: '#64748b' }}>
              <strong>{filtered.length}</strong> tasks
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task ID & Type</th>
                <th>Person Label</th>
                <th>Due Date</th>
                <th>Assigned Worker</th>
                <th>Status</th>
                <th>Coordination Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <CalendarCheck size={28} />
                      <strong>No follow-up tasks match criteria</strong>
                      <p>Adjust your tab or worker filter to see more scheduled tasks.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((f) => {
                  const overdue = isFollowUpOverdue(f, today, rules);
                  const reasonText = followUpReason(f, today, rules);

                  return (
                    <tr key={f.id} style={{ background: overdue ? '#fffbf7' : 'inherit' }}>
                      <td>
                        <strong style={{ color: '#0f766e' }}>{f.id}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{f.followUpType}</div>
                      </td>

                      <td>
                        <strong
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => onSelectPatient(f.patientId)}
                        >
                          {patientMap.get(f.patientId) || f.patientId}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {f.patientId}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: overdue ? 700 : 500, color: overdue ? '#b45309' : 'inherit' }}>
                          {f.dueDate}
                        </div>
                        {overdue && (
                          <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700 }}>
                            Overdue (&gt;{rules.overdueGraceDays}d)
                          </span>
                        )}
                      </td>

                      <td>
                        <select
                          value={f.assignedWorker}
                          onChange={(e) => onReassign(f.id, e.target.value)}
                          className="filter-select"
                          style={{ padding: '4px 6px', fontSize: '11px' }}
                        >
                          <option value="HW-01">HW-01</option>
                          <option value="HW-02">HW-02</option>
                          <option value="HW-03">HW-03</option>
                          <option value="Unassigned">Unassigned</option>
                        </select>
                      </td>

                      <td>
                        <span className={`status-pill ${f.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {f.status}
                        </span>
                      </td>

                      <td style={{ maxWidth: '280px', whiteSpace: 'normal' }}>
                        <div style={{ fontSize: '12px' }}>{f.reason}</div>
                        {f.outcome && (
                          <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>
                            <strong>Outcome:</strong> {f.outcome}
                          </div>
                        )}
                        {f.rescheduleReason && (
                          <div style={{ fontSize: '11px', color: '#7c3aed', marginTop: '2px' }}>
                            <strong>Rescheduled:</strong> {f.rescheduleReason}
                          </div>
                        )}
                        {f.closeReason && (
                          <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '2px' }}>
                            <strong>Closed:</strong> {f.closeReason}
                          </div>
                        )}
                        {overdue && reasonText && (
                          <div className="task-explain" style={{ marginTop: '4px' }}>
                            {reasonText}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {f.status !== 'Completed' && f.status !== 'Closed' && (
                            <>
                              <button
                                type="button"
                                className="secondary-button"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => setCompleteItem(f)}
                                title="Mark task completed with outcome"
                              >
                                <Check size={12} /> Complete
                              </button>
                              <button
                                type="button"
                                className="outline-button"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => {
                                  setRescheduleItem(f);
                                  setNewDueDate(f.dueDate);
                                }}
                                title="Reschedule to new date with reason"
                              >
                                Reschedule
                              </button>
                              <button
                                type="button"
                                className="outline-button"
                                style={{ padding: '4px 8px', fontSize: '11px', color: '#64748b' }}
                                onClick={() => setCloseItem(f)}
                                title="Close/cancel task with reason"
                              >
                                Close
                              </button>
                            </>
                          )}
                          {(f.status === 'Completed' || f.status === 'Closed') && (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Archived</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reschedule Modal */}
      {rescheduleItem && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setRescheduleItem(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-label="Reschedule Follow-Up">
            <div className="modal-header">
              <h2>Reschedule Task {rescheduleItem.id}</h2>
              <button type="button" className="icon-button" onClick={() => setRescheduleItem(null)} aria-label="Close dialog"><X size={18} /></button>
            </div>
            <form onSubmit={handleConfirmReschedule}>
              <div className="modal-body">
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                  Rescheduling updates the due date and records the administrative reason in the audit history.
                </p>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>New Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Reason for Rescheduling (Required)</label>
                  <select
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                  >
                    <option>Patient requested alternate date</option>
                    <option>Worker unavailable on original date</option>
                    <option>Clinic closure or holiday</option>
                    <option>Transportation assistance pending</option>
                    <option>Other administrative scheduling adjustment</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="outline-button" onClick={() => setRescheduleItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Close Task Modal */}
      {closeItem && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setCloseItem(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-label="Close Coordination Task">
            <div className="modal-header">
              <h2>Close Task {closeItem.id}</h2>
              <button type="button" className="icon-button" onClick={() => setCloseItem(null)} aria-label="Close dialog"><X size={18} /></button>
            </div>
            <form onSubmit={handleConfirmClose}>
              <div className="modal-body">
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                  Closing a task removes it from active queues. Record the administrative reason below.
                </p>

                <div className="form-group">
                  <label>Reason for Closure (Required)</label>
                  <select
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                  >
                    <option>Resolved administratively</option>
                    <option>Patient moved out of service area</option>
                    <option>Unable to reach after multiple attempts</option>
                    <option>Duplicate task entry</option>
                    <option>Care provided at external facility</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="outline-button" onClick={() => setCloseItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="danger-button">
                  Confirm Closure
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Complete Task Modal */}
      {completeItem && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setCompleteItem(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-label="Complete Coordination Task">
            <div className="modal-header">
              <h2>Complete Task {completeItem.id}</h2>
              <button type="button" className="icon-button" onClick={() => setCompleteItem(null)} aria-label="Close dialog"><X size={18} /></button>
            </div>
            <form onSubmit={handleConfirmComplete}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Coordination Outcome Note</label>
                  <input
                    type="text"
                    required
                    value={completeOutcome}
                    onChange={(e) => setCompleteOutcome(e.target.value)}
                    placeholder="e.g. Visit attended, transportation confirmed, or check-in completed..."
                  />
                  <span className="form-hint">
                    Do not record clinical diagnosis or medical prescriptions.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="outline-button" onClick={() => setCompleteItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Check size={15} /> Confirm Completion
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
