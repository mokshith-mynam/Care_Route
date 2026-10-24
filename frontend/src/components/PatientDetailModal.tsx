import { useState } from 'react';
import {
  Check,
  ClipboardList,
  HeartHandshake,
  Plus,
  ShieldAlert,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import type {
  CaregiverConsent,
  FollowUp,
  FollowUpStatus,
  Patient,
  Referral,
  ReferralStatus,
  ScreeningObservation,
} from '../types';

interface PatientDetailModalProps {
  patient: Patient;
  observations: ScreeningObservation[];
  followUps: FollowUp[];
  referrals: Referral[];
  today?: string;
  close: () => void;
  onAddObservation: (patientId: string, type: string, notes: string) => Promise<void>;
  onUpdateConsent: (patientId: string, consent: Partial<CaregiverConsent>) => Promise<void>;
  onStatusFollowUp: (id: string, status: FollowUpStatus) => void;
  onStatusReferral?: (id: string, status: ReferralStatus) => void;
}

export function PatientDetailModal({
  patient,
  observations,
  followUps,
  referrals,
  close,
  onAddObservation,
  onUpdateConsent,
  onStatusFollowUp,
}: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'observations' | 'consent' | 'tasks'>('profile');
  const [showObsForm, setShowObsForm] = useState(false);
  const [obsType, setObsType] = useState('Routine Community Screening');
  const [obsNotes, setObsNotes] = useState('');
  const [isSubmittingObs, setIsSubmittingObs] = useState(false);

  // Consent editing state
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [caregiverName, setCaregiverName] = useState(patient.consent?.caregiverName || '');
  const [consentScope, setConsentScope] = useState(patient.consent?.scope || 'Appointment and follow-up scheduling only');

  const patientFollowUps = followUps.filter((f) => f.patientId === patient.id);
  const patientReferrals = referrals.filter((r) => r.patientId === patient.id);
  const patientObservations = observations.filter((o) => o.patientId === patient.id);

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsNotes.trim()) return;
    setIsSubmittingObs(true);
    try {
      await onAddObservation(patient.id, obsType, obsNotes.trim());
      setObsNotes('');
      setShowObsForm(false);
    } finally {
      setIsSubmittingObs(false);
    }
  };

  const handleSaveConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateConsent(patient.id, {
      status: 'Active',
      scope: consentScope,
      caregiverName: caregiverName.trim() || 'Designated Family Caregiver',
    });
    setShowConsentForm(false);
  };

  const handleRevokeConsent = async () => {
    if (window.confirm(`Revoke caregiver sharing consent for ${patient.displayName}?`)) {
      await onUpdateConsent(patient.id, {
        status: 'Revoked',
      });
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="modal wide" role="dialog" aria-modal="true" aria-label={`Patient Profile: ${patient.displayName}`}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="avatar">{patient.id.slice(-2)}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>{patient.displayName}</h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                ID: <strong>{patient.id}</strong> · {patient.facility} · Age Band: {patient.ageBand}
              </span>
            </div>
          </div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        {/* Tab Navigation */}
        <div className="subtabs">
          <button
            className={`subtab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Coordination Summary
          </button>
          <button
            className={`subtab-btn ${activeTab === 'observations' ? 'active' : ''}`}
            onClick={() => setActiveTab('observations')}
          >
            Screening Observations ({patientObservations.length})
          </button>
          <button
            className={`subtab-btn ${activeTab === 'consent' ? 'active' : ''}`}
            onClick={() => setActiveTab('consent')}
          >
            Caregiver Consent ({patient.consent?.status || 'Not Given'})
          </button>
          <button
            className={`subtab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Follow-Ups & Referrals ({patientFollowUps.length + patientReferrals.length})
          </button>
        </div>

        <div className="modal-body">
          {/* TAB 1: Profile Summary */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: '#f8faf9', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Primary Facility</span>
                  <strong style={{ fontSize: '13px' }}>{patient.facility}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Contact Phone</span>
                  <strong style={{ fontSize: '13px' }}>{patient.contactPhone}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Last Screening Date</span>
                  <strong style={{ fontSize: '13px' }}>{patient.lastScreening}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Registration Date</span>
                  <strong style={{ fontSize: '13px' }}>{patient.createdAt}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Caregiver Consent</span>
                  <strong style={{ fontSize: '13px', color: patient.consent?.status === 'Active' ? '#059669' : '#dc2626' }}>
                    {patient.consent?.status || 'Not Provided'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Active Tasks</span>
                  <strong style={{ fontSize: '13px' }}>
                    {patientFollowUps.filter((f) => f.status !== 'Completed' && f.status !== 'Closed').length} open
                  </strong>
                </div>
              </div>

              {patient.notes && (
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px', color: '#92400e' }}>
                  <strong>Administrative Coordination Note:</strong> {patient.notes}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="secondary-button" onClick={() => setActiveTab('observations')}>
                  <Plus size={15} /> Add Screening Observation
                </button>
                <button type="button" className="outline-button" onClick={() => setActiveTab('consent')}>
                  <HeartHandshake size={15} /> Manage Caregiver Consent
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Observations */}
          {activeTab === 'observations' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Recorded Screening Observations</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                    Neutral non-diagnostic notes recorded during community screenings.
                  </p>
                </div>
                {!showObsForm && (
                  <button type="button" className="primary-button" onClick={() => setShowObsForm(true)}>
                    <Plus size={15} /> Record Observation
                  </button>
                )}
              </div>

              {showObsForm && (
                <form
                  onSubmit={handleAddObservation}
                  style={{ background: '#f8faf9', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}
                >
                  <div className="non-diagnostic-box" style={{ padding: '8px 12px', fontSize: '11px', marginBottom: '12px' }}>
                    <ShieldAlert size={16} />
                    <span>Reminder: Do not enter diagnoses, prescriptions, or clinical risk scores. Record only routine screening responses.</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Screening Type</label>
                    <select value={obsType} onChange={(e) => setObsType(e.target.value)}>
                      <option>Routine Community Screening</option>
                      <option>Vitals & General Health Check</option>
                      <option>Nutrition & Growth Follow-up</option>
                      <option>Vision & Hearing Check</option>
                      <option>Transportation & Access Check</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Neutral Observation Notes</label>
                    <textarea
                      required
                      rows={3}
                      value={obsNotes}
                      onChange={(e) => setObsNotes(e.target.value)}
                      placeholder="e.g. Completed routine questionnaire. Patient requested reminder for upcoming clinic visit..."
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="outline-button" onClick={() => setShowObsForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="primary-button" disabled={isSubmittingObs}>
                      {isSubmittingObs ? 'Saving...' : 'Save Observation'}
                    </button>
                  </div>
                </form>
              )}

              {patientObservations.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={24} />
                  <strong>No observations recorded</strong>
                  <p>Click "Record Observation" above to log a neutral screening observation.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {patientObservations.map((obs) => (
                    <div
                      key={obs.id}
                      style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#ffffff' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#0f766e' }}>{obs.screeningType}</span>
                        <span style={{ color: '#64748b' }}>
                          Recorded by <strong>{obs.recordedBy}</strong> on {obs.recordedAt}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', lineHeight: 1.5 }}>
                        {obs.observationNotes}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Caregiver Consent */}
          {activeTab === 'consent' && (
            <div>
              <div className="non-diagnostic-box" style={{ marginBottom: '16px' }}>
                <HeartHandshake size={20} />
                <div>
                  <strong>Demonstration Consent Protocol:</strong> CareRoute allows staff to track explicit caregiver-sharing scope and visible revocation. This demonstration does not replace comprehensive legal or clinical consent documentation.
                </div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: '#f8faf9', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {patient.consent?.status === 'Active' ? (
                      <span className="status-pill complete"><UserCheck size={14} /> Consent Active</span>
                    ) : patient.consent?.status === 'Revoked' ? (
                      <span className="status-pill overdue"><UserX size={14} /> Consent Revoked</span>
                    ) : (
                      <span className="status-pill neutral">No Consent Recorded</span>
                    )}
                  </div>
                  {patient.consent?.status === 'Active' && (
                    <button type="button" className="danger-button" onClick={handleRevokeConsent}>
                      <UserX size={14} /> Revoke Consent
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Designated Caregiver</span>
                    <strong>{patient.consent?.caregiverName || 'None assigned'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Authorized Scope</span>
                    <strong>{patient.consent?.scope || 'None specified'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Granted Date</span>
                    <span>{patient.consent?.grantedDate || 'N/A'}</span>
                  </div>
                  {patient.consent?.revokedDate && (
                    <div>
                      <span style={{ fontSize: '11px', color: '#dc2626', display: 'block' }}>Revocation Date</span>
                      <strong style={{ color: '#dc2626' }}>{patient.consent.revokedDate}</strong>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Recorded By</span>
                    <span>{patient.consent?.recordedBy || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {(!patient.consent || patient.consent.status !== 'Active' || showConsentForm) && (
                <form
                  onSubmit={handleSaveConsent}
                  style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', background: '#ffffff' }}
                >
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700 }}>
                    {patient.consent?.status === 'Active' ? 'Update Consent Scope' : 'Record Explicit Caregiver Consent'}
                  </h4>

                  <div className="form-grid" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label>Designated Caregiver Name & Relation</label>
                      <input
                        required
                        value={caregiverName}
                        onChange={(e) => setCaregiverName(e.target.value)}
                        placeholder="e.g. Maria S. (Adult Daughter)"
                      />
                    </div>

                    <div className="form-group">
                      <label>Permitted Sharing Scope</label>
                      <select value={consentScope} onChange={(e) => setConsentScope(e.target.value)}>
                        <option>Appointment and follow-up scheduling only</option>
                        <option>Transportation and access coordination only</option>
                        <option>Full coordination and caregiver updates</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {showConsentForm && (
                      <button type="button" className="outline-button" onClick={() => setShowConsentForm(false)}>
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="primary-button">
                      <Check size={15} /> Grant & Record Consent
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: Tasks & Referrals */}
          {activeTab === 'tasks' && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px' }}>
                Follow-Up Tasks ({patientFollowUps.length})
              </h3>
              {patientFollowUps.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>No follow-up tasks recorded.</p>
              ) : (
                <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
                  {patientFollowUps.map((f) => (
                    <div
                      key={f.id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff' }}
                    >
                      <div>
                        <strong>{f.id}</strong> — Due: {f.dueDate} | Assigned: {f.assignedWorker}
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{f.reason}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`status-pill ${f.status.toLowerCase().replace(/\s+/g, '-')}`}>{f.status}</span>
                        {f.status !== 'Completed' && f.status !== 'Closed' && (
                          <button
                            type="button"
                            className="secondary-button"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => onStatusFollowUp(f.id, 'Completed')}
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px' }}>
                Referral Handoffs ({patientReferrals.length})
              </h3>
              {patientReferrals.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>No referrals recorded.</p>
              ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {patientReferrals.map((r) => (
                    <div
                      key={r.id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff' }}
                    >
                      <div>
                        <strong>{r.id}</strong> — Destination: {r.destination} ({r.receivingService})
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Sent: {r.referralDate} {r.appointmentDate ? `| Appt: ${r.appointmentDate}` : ''}
                        </div>
                      </div>
                      <span className={`status-pill ${r.status.toLowerCase().replace(/\s+/g, '-')}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-button" onClick={close}>Done</button>
        </div>
      </section>
    </div>
  );
}
