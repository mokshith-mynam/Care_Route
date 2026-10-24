import { useState } from 'react';
import {
  Check,
  ShieldAlert,
  X,
} from 'lucide-react';
import type { NewPatientFormData, Patient, ReferralStatus } from '../types';

export type { NewPatientFormData };

interface AddPatientModalProps {
  close: () => void;
  onSubmit: (data: NewPatientFormData) => void;
  today?: string;
}

export function AddPatientModal({ close, onSubmit }: AddPatientModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [ageBand, setAgeBand] = useState('30–39');
  const [facility, setFacility] = useState('Community Clinic A');
  const [contactPhone, setContactPhone] = useState('555-01');
  const [observation, setObservation] = useState('');
  const [notes, setNotes] = useState('');
  const [grantConsent, setGrantConsent] = useState(false);
  const [caregiverName, setCaregiverName] = useState('');
  const [consentScope, setConsentScope] = useState('Appointment and follow-up scheduling only');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    onSubmit({
      displayName: displayName.trim(),
      ageBand,
      facility,
      contactPhone: contactPhone.trim() || '555-0199',
      observation: observation.trim() || 'Routine community registration completed.',
      notes: notes.trim(),
      consent: grantConsent
        ? {
            status: 'Active',
            scope: consentScope,
            caregiverName: caregiverName.trim() || 'Designated Family Caregiver',
          }
        : undefined,
    });
    close();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-label="Add Synthetic Person Record">
        <div className="modal-header">
          <h2>Add Synthetic Person Record</h2>
          <button type="button" className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="non-diagnostic-box" style={{ padding: '8px 12px', fontSize: '11px', marginBottom: '14px' }}>
              <ShieldAlert size={16} />
              <span>Synthetic data only. Do not input real names, government IDs, or sensitive medical histories.</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Display Name / Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Demo Patient 13 (A. Kumar)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Age Band *</label>
                <select value={ageBand} onChange={(e) => setAgeBand(e.target.value)}>
                  <option>20–29</option>
                  <option>30–39</option>
                  <option>40–49</option>
                  <option>50–59</option>
                  <option>60–69</option>
                  <option>70+</option>
                </select>
              </div>

              <div className="form-group">
                <label>Primary Care Facility *</label>
                <select value={facility} onChange={(e) => setFacility(e.target.value)}>
                  <option>Community Clinic A</option>
                  <option>Community Clinic B</option>
                  <option>Community Clinic C</option>
                </select>
              </div>

              <div className="form-group">
                <label>Synthetic Contact Phone</label>
                <input
                  type="text"
                  placeholder="555-0130"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Initial Screening Observation (Non-Diagnostic)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Completed routine questionnaire. Noted transportation assistance inquiry..."
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
                <span className="form-hint">
                  Do not enter clinical diagnosis or prescriptions. Record only neutral coordination details.
                </span>
              </div>

              <div className="form-group full">
                <label>Coordination Preference Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Prefers afternoon phone calls; no translation required"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Caregiver Sharing Consent Toggle */}
              <div className="form-group full" style={{ background: '#f8faf9', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={grantConsent}
                    onChange={(e) => setGrantConsent(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <span>Record explicit demo caregiver-sharing consent now</span>
                </label>

                {grantConsent && (
                  <div style={{ marginTop: '10px', display: 'grid', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px' }}>Designated Caregiver Name & Relationship</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh K. (Spouse)"
                        value={caregiverName}
                        onChange={(e) => setCaregiverName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px' }}>Permitted Scope</label>
                      <select value={consentScope} onChange={(e) => setConsentScope(e.target.value)}>
                        <option>Appointment and follow-up scheduling only</option>
                        <option>Transportation and access coordination only</option>
                        <option>Full coordination and caregiver updates</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="outline-button" onClick={close}>Cancel</button>
            <button type="submit" className="primary-button"><Check size={16} /> Create Record</button>
          </div>
        </form>
      </section>
    </div>
  );
}

interface AddFollowUpModalProps {
  patients: Patient[];
  close: () => void;
  onSubmit: (data: {
    patientId: string;
    followUpType: string;
    dueDate: string;
    assignedWorker: string;
    reason: string;
    nextFollowUpDate?: string;
  }) => void;
  today: string;
  initialPatientId?: string;
}

export function AddFollowUpModal({
  patients,
  close,
  onSubmit,
  today,
  initialPatientId,
}: AddFollowUpModalProps) {
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.id || '');
  const [followUpType, setFollowUpType] = useState('Routine check-in');
  const [dueDate, setDueDate] = useState(today);
  const [assignedWorker, setAssignedWorker] = useState('HW-01');
  const [reason, setReason] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    onSubmit({
      patientId,
      followUpType,
      dueDate,
      assignedWorker,
      reason: reason.trim(),
      nextFollowUpDate: nextFollowUpDate || undefined,
    });
    close();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-label="Schedule Follow-Up Task">
        <div className="modal-header">
          <h2>Schedule Follow-Up Task</h2>
          <button type="button" className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full">
                <label>Person / Record *</label>
                <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} · {p.displayName} ({p.facility})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Follow-Up Type *</label>
                <select value={followUpType} onChange={(e) => setFollowUpType(e.target.value)}>
                  <option>Routine check-in</option>
                  <option>Appointment reminder</option>
                  <option>Screening review</option>
                  <option>Handoff confirmation</option>
                  <option>Transportation assistance check</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Assigned Health Worker</label>
                <select value={assignedWorker} onChange={(e) => setAssignedWorker(e.target.value)}>
                  <option value="HW-01">HW-01 (Priya)</option>
                  <option value="HW-02">HW-02 (David)</option>
                  <option value="HW-03">HW-03 (Fatima)</option>
                  <option value="Unassigned">Unassigned (Queue flag demo)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Next Check Date (Optional)</label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Coordination Reason *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phone check-in for routine screening follow-up"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <span className="form-hint">
                  Keep coordination notes administrative. Do not record clinical diagnoses or prescriptions.
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="outline-button" onClick={close}>Cancel</button>
            <button type="submit" className="primary-button"><Check size={16} /> Schedule Task</button>
          </div>
        </form>
      </section>
    </div>
  );
}

interface AddReferralModalProps {
  patients: Patient[];
  close: () => void;
  onSubmit: (data: {
    patientId: string;
    destination: string;
    receivingService: string;
    referralDate: string;
    appointmentDate?: string;
    nextFollowUpDate?: string;
    status: ReferralStatus;
  }) => void;
  today: string;
  initialPatientId?: string;
}

export function AddReferralModal({
  patients,
  close,
  onSubmit,
  today,
  initialPatientId,
}: AddReferralModalProps) {
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.id || '');
  const [destination, setDestination] = useState('Primary Health Centre');
  const [receivingService, setReceivingService] = useState('Primary Care Clinic');
  const [referralDate, setReferralDate] = useState(today);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [status, setStatus] = useState<ReferralStatus>('Sent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      patientId,
      destination,
      receivingService,
      referralDate,
      appointmentDate: appointmentDate || undefined,
      nextFollowUpDate: nextFollowUpDate || undefined,
      status,
    });
    close();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-label="Create Referral Record">
        <div className="modal-header">
          <h2>Create Referral Record</h2>
          <button type="button" className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full">
                <label>Person / Record *</label>
                <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} · {p.displayName} ({p.facility})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Receiving Destination *</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option>Primary Health Centre</option>
                  <option>District Health Centre</option>
                  <option>Community Clinic A</option>
                  <option>Community Clinic B</option>
                  <option>Community Clinic C</option>
                  <option>Vision Health Center</option>
                </select>
              </div>

              <div className="form-group">
                <label>Receiving Service Type *</label>
                <select value={receivingService} onChange={(e) => setReceivingService(e.target.value)}>
                  <option>Primary Care Clinic</option>
                  <option>Specialist Consultation</option>
                  <option>Vision Center</option>
                  <option>Maternal & Child Health</option>
                  <option>Nutrition & Metabolic Support</option>
                  <option>Physical Therapy & Rehab</option>
                </select>
              </div>

              <div className="form-group">
                <label>Referral Sent Date *</label>
                <input
                  type="date"
                  required
                  value={referralDate}
                  onChange={(e) => setReferralDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Initial Handoff Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as ReferralStatus)}>
                  <option value="Draft">Draft (Prepared, not yet sent)</option>
                  <option value="Sent">Sent (Awaiting receiving facility acknowledgment)</option>
                  <option value="Received">Received (Receiving facility acknowledged)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Appointment Date (If Known)</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Next Follow-Up Check Date</label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="outline-button" onClick={close}>Cancel</button>
            <button type="submit" className="primary-button"><Check size={16} /> Create Referral</button>
          </div>
        </form>
      </section>
    </div>
  );
}
