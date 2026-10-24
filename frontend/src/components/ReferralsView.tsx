import { useState } from 'react';
import {
  Check,
  GitBranch,
  Plus,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import { localizeStatus, type Translations } from '../i18n';
import type { Patient, Referral, ReferralStatus, RuleConfig } from '../types';
import { dayNumber, isReferralUnconfirmed, needsReferralReview, referralReason } from '../rules';

interface ReferralsViewProps {
  referrals: Referral[];
  patients: Patient[];
  rules: RuleConfig;
  today: string;
  onOpenNewReferral: () => void;
  onUpdateReferralStatus: (id: string, status: ReferralStatus, extra?: { outcome?: string; unableToConfirmReason?: string; note?: string }) => void;
  onSelectPatient: (patientId: string) => void;
  t: Translations;
}

export function ReferralsView({
  referrals,
  patients,
  rules,
  today,
  onOpenNewReferral,
  onUpdateReferralStatus,
  onSelectPatient,
  t,
}: ReferralsViewProps) {
  const [activeTab, setActiveTab] = useState<'loop-closure' | 'all'>('loop-closure');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Unable to Confirm Modal
  const [unableItem, setUnableItem] = useState<Referral | null>(null);
  const [unableReason, setUnableReason] = useState('Patient relocated out of coverage area');

  // Handoff Update Modal
  const [updateItem, setUpdateItem] = useState<Referral | null>(null);
  const [nextStatus, setNextStatus] = useState<ReferralStatus>('Received');
  const [handoffNote, setHandoffNote] = useState('');

  const patientMap = new Map(patients.map((p) => [p.id, p.displayName]));

  const unconfirmedList = referrals.filter(isReferralUnconfirmed);

  const displayedReferrals = (activeTab === 'loop-closure' ? unconfirmedList : referrals).filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    const pName = patientMap.get(r.patientId) || '';
    const searchable = `${r.id} ${r.patientId} ${pName} ${r.destination} ${r.receivingService} ${r.status}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  const handleConfirmUnable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unableItem) return;
    onUpdateReferralStatus(unableItem.id, 'Unable to Confirm', {
      unableToConfirmReason: unableReason,
    });
    setUnableItem(null);
  };

  const handleConfirmUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateItem) return;
    onUpdateReferralStatus(updateItem.id, nextStatus, {
      note: handoffNote.trim() || undefined,
    });
    setUpdateItem(null);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t.referralsEyebrow}</div>
          <h1>{t.navReferrals}</h1>
          <p>{t.referralsDescription}</p>
        </div>

        <button type="button" className="primary-button" onClick={onOpenNewReferral}>
          <Plus size={16} /> {t.newReferral}
        </button>
      </div>

      {/* Loop Closure Principle Banner */}
      <div className="non-diagnostic-box" style={{ marginBottom: '20px' }}>
        <ShieldAlert size={18} />
        <div>
          <strong>{t.loopIntegrity}</strong> {t.loopIntegrityBody}
        </div>
      </div>

      <section className="panel">
        {/* Subtabs: Loop Closure vs All */}
        <div className="subtabs">
          <button
            className={`subtab-btn ${activeTab === 'loop-closure' ? 'active' : ''}`}
            onClick={() => setActiveTab('loop-closure')}
          >
            {t.loopTracking} ({unconfirmedList.length})
          </button>
          <button
            className={`subtab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {t.allReferralRegistry} ({referrals.length})
          </button>
        </div>

        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-input-group">
            <Search size={16} color="#6b827e" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchReferrals}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600 }}>{t.statusLabel}:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">{t.allStatuses}</option>
              <option value="Draft">{t.referralDraft}</option>
              <option value="Sent">{t.referralSent}</option>
              <option value="Received">{t.referralReceived}</option>
              <option value="Appointment Pending">{t.referralAppointmentPending}</option>
              <option value="Review required">{t.referralReviewRequired}</option>
              <option value="Completed">{t.referralCompleted}</option>
              <option value="Unable to Confirm">{t.referralUnableToConfirm}</option>
            </select>

            <span style={{ fontSize: '13px', color: '#64748b' }}>
              <strong>{displayedReferrals.length}</strong> {t.openReferrals}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.referralId}</th>
                <th>{t.personLabel}</th>
                <th>{t.destinationService}</th>
                <th>{t.referralDate}</th>
                <th>{t.daysOpen}</th>
                <th>{t.handoffStatus}</th>
                <th>{t.nextFollowUp}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {displayedReferrals.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <GitBranch size={28} />
                      <strong>{t.noReferralsFound}</strong>
                      <p>
                        {activeTab === 'loop-closure' ? t.allReferralsRecorded : t.refineSearch}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedReferrals.map((r) => {
                  const daysOpen = Math.max(0, dayNumber(today) - dayNumber(r.referralDate));
                  const reviewNeeded = needsReferralReview(r, today, rules);
                  const reason = referralReason(r, today, rules);

                  return (
                    <tr key={r.id} className="mobile-card-row" style={{ background: reviewNeeded ? '#fffbf7' : 'inherit' }}>
                      <td data-label="Referral ID">
                        <strong style={{ color: '#0f766e' }}>{r.id}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{t.by} {r.lastUpdatedBy}</div>
                      </td>

                      <td data-label="Person Label">
                        <strong
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => onSelectPatient(r.patientId)}
                        >
                          {patientMap.get(r.patientId) || r.patientId}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{t.recordId}: {r.patientId}</div>
                      </td>

                      <td data-label="Destination & Service">
                        <strong style={{ fontSize: '13px' }}>{r.destination}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{r.receivingService}</div>
                      </td>

                      <td data-label="Referral Date">
                        <div>{r.referralDate}</div>
                        {r.appointmentDate && (
                          <span style={{ fontSize: '11px', color: '#4338ca' }}>
                            {t.appointmentShort} {r.appointmentDate}
                          </span>
                        )}
                      </td>

                      <td data-label="Days Open">
                        <span style={{ fontWeight: 600 }}>{daysOpen} {daysOpen === 1 ? t.day : t.days}</span>
                      </td>

                      <td data-label="Handoff Status">
                        <span className={`status-pill ${r.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {localizeStatus(r.status, t)}
                        </span>
                        {reviewNeeded && reason && (
                          <div className="task-explain" style={{ marginTop: '4px', maxWidth: '240px', whiteSpace: 'normal' }}>
                            {reason}
                          </div>
                        )}
                        {r.unableToConfirmReason && (
                          <div style={{ fontSize: '11px', color: '#991b1b', marginTop: '3px', whiteSpace: 'normal' }}>
                            <strong>{t.reasonLabel}</strong> {r.unableToConfirmReason}
                          </div>
                        )}
                        {r.outcome && (
                          <div style={{ fontSize: '11px', color: '#059669', marginTop: '3px', whiteSpace: 'normal' }}>
                            <strong>{t.outcomeLabel}</strong> {r.outcome}
                          </div>
                        )}
                      </td>

                      <td data-label="Next Follow-up">
                        {r.nextFollowUpDate ? (
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{r.nextFollowUpDate}</span>
                        ) : isReferralUnconfirmed(r) ? (
                          <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 600 }}>{t.notScheduled}</span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.none}</span>
                        )}
                      </td>

                      <td data-label="Actions">
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {r.status !== 'Completed' && r.status !== 'Cancelled' && r.status !== 'Unable to Confirm' ? (
                            <>
                              <button
                                type="button"
                                className="secondary-button"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => {
                                  setUpdateItem(r);
                                  setNextStatus(r.status === 'Sent' ? 'Received' : r.status === 'Received' ? 'Appointment Pending' : 'Completed');
                                }}
                                title={t.recordHandoffUpdate}
                              >
                                {t.updateStatus}
                              </button>

                              <button
                                type="button"
                                className="outline-button"
                                style={{ padding: '4px 8px', fontSize: '11px', color: '#b91c1c' }}
                                onClick={() => setUnableItem(r)}
                                title={t.markUnableToConfirm}
                              >
                                {t.referralUnableToConfirm}
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.loopClosed}</span>
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

      {/* Update Handoff Status Modal */}
      {updateItem && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setUpdateItem(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-label="Update Referral Handoff Status">
            <div className="modal-header">
              <h2>Record Referral Handoff: {updateItem.id}</h2>
              <button type="button" className="icon-button" onClick={() => setUpdateItem(null)} aria-label="Close dialog"><X size={18} /></button>
            </div>
            <form onSubmit={handleConfirmUpdate}>
              <div className="modal-body">
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                  Document a verified staff communication or confirmation regarding the referral to <strong>{updateItem.destination}</strong>.
                </p>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Next Verified Handoff Status</label>
                  <select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value as ReferralStatus)}
                  >
                    <option value="Sent">Sent (Awaiting receiving facility confirmation)</option>
                    <option value="Received">Received (Receiving clinic acknowledged referral)</option>
                    <option value="Appointment Pending">Appointment Pending (Patient scheduled for visit)</option>
                    <option value="Completed">Completed (Visit occurred / care handoff closed)</option>
                    <option value="Review required">Review Required (Escalate for coordinator check)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Staff Documentation / Coordination Note</label>
                  <textarea
                    rows={2}
                    value={handoffNote}
                    onChange={(e) => setHandoffNote(e.target.value)}
                    placeholder="e.g. Spoke with intake desk at Vision Center; confirmation code assigned..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="outline-button" onClick={() => setUpdateItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Check size={15} /> Save Verified Update
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Unable to Confirm Modal */}
      {unableItem && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setUnableItem(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-label="Mark Referral Unable to Confirm">
            <div className="modal-header">
              <h2>Mark Referral Unable to Confirm: {unableItem.id}</h2>
              <button type="button" className="icon-button" onClick={() => setUnableItem(null)} aria-label="Close dialog"><X size={18} /></button>
            </div>
            <form onSubmit={handleConfirmUnable}>
              <div className="modal-body">
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                  When referral handoff or appointment completion cannot be verified, record the explicit administrative reason below to close the loop transparently.
                </p>

                <div className="form-group">
                  <label>Administrative Reason (Required)</label>
                  <select
                    value={unableReason}
                    onChange={(e) => setUnableReason(e.target.value)}
                  >
                    <option>Patient relocated out of coverage area</option>
                    <option>Receiving clinic unreachable after 3 contact attempts</option>
                    <option>Patient declined scheduled specialist consultation</option>
                    <option>Care obtained at alternate independent provider</option>
                    <option>Unable to reach patient via phone or visit</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="outline-button" onClick={() => setUnableItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="danger-button">
                  Confirm Loop Closure
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
