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
  const [contactPhone, setContactPhone] = useState('');
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
      <section className="modal form-modal person-form-modal" role="dialog" aria-modal="true" aria-label="Add Person">
        <div className="modal-header">
          <div className="modal-heading-copy">
            <h2>Add Person</h2>
            <p>Create a record in three clear steps. You can add coordination details later.</p>
          </div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="non-diagnostic-box" style={{ padding: '8px 12px', fontSize: '11px', marginBottom: '14px' }}>
              <ShieldAlert size={16} />
              <span>Synthetic data only. Do not input real names, government IDs, or sensitive medical histories.</span>
            </div>

            <div className="person-form-guide" aria-label="Form sections">
              <span><b>1</b> Person details</span><i /><span><b>2</b> Coordination notes</span><i /><span><b>3</b> Sharing</span>
            </div>
            <div className="form-layout person-form-layout">
              <section className="form-section" aria-labelledby="person-details-heading">
                <div className="form-section-header">
                  <span className="person-section-number">01</span><div><h3 id="person-details-heading">Person details</h3>
                  <p>Basic information used to identify and route this fictional record.</p>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="person-display-name">Display name or label <span className="required-mark">Required</span></label>
                    <input id="person-display-name" type="text" required maxLength={80} autoComplete="off" placeholder="e.g. Demo Person 13 (A. Kumar)" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="person-age-band">Age band <span className="required-mark">Required</span></label>
                    <select id="person-age-band" required value={ageBand} onChange={(e) => setAgeBand(e.target.value)}>
                      <option>20–29</option><option>30–39</option><option>40–49</option><option>50–59</option><option>60–69</option><option>70+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="person-facility">Primary facility <span className="required-mark">Required</span></label>
                    <select id="person-facility" required value={facility} onChange={(e) => setFacility(e.target.value)}>
                      <option>Community Clinic A</option><option>Community Clinic B</option><option>Community Clinic C</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="person-contact-phone">Demo contact phone <span className="optional-mark">Optional</span></label>
                    <input id="person-contact-phone" type="tel" inputMode="tel" autoComplete="off" placeholder="555-0130" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                    <span className="form-hint">Use fictional contact details only.</span>
                  </div>
                </div>
              </section>

              <section className="form-section" aria-labelledby="person-coordination-heading">
                <div className="form-section-header">
                  <span className="person-section-number">02</span><div><h3 id="person-coordination-heading">Coordination notes</h3>
                  <p>Keep notes factual and focused on scheduling or access needs.</p>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group full">
                    <label htmlFor="person-observation">Initial observation <span className="optional-mark">Optional</span></label>
                    <textarea id="person-observation" rows={3} maxLength={1000} placeholder="e.g. Routine questionnaire completed; asked about transportation assistance." value={observation} onChange={(e) => setObservation(e.target.value)} />
                    <span className="form-hint">No diagnoses, prescriptions, or clinical risk assessments.</span>
                  </div>
                  <div className="form-group full">
                    <label htmlFor="person-preferences">Contact or coordination preferences <span className="optional-mark">Optional</span></label>
                    <textarea id="person-preferences" rows={2} maxLength={500} placeholder="e.g. Prefers afternoon calls; interpreter not needed." value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="form-section consent-section" aria-labelledby="person-consent-heading">
                <div className="form-section-header">
                  <span className="person-section-number">03</span><div><h3 id="person-consent-heading">Caregiver sharing</h3>
                  <p>Optional. Leave off unless permission was explicitly provided.</p>
                  </div>
                </div>
                <label className="consent-choice" htmlFor="person-consent">
                  <input id="person-consent" type="checkbox" checked={grantConsent} onChange={(e) => setGrantConsent(e.target.checked)} />
                  <span><strong>Record caregiver-sharing consent</strong><small>Mark that permission was explicitly provided in this demo.</small></span>
                </label>
                {grantConsent && (
                  <div className="form-grid consent-fields">
                    <div className="form-group">
                      <label htmlFor="person-caregiver">Caregiver name and relationship <span className="required-mark">Required</span></label>
                      <input id="person-caregiver" type="text" required maxLength={100} autoComplete="off" placeholder="e.g. Ramesh K. (Spouse)" value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="person-consent-scope">Sharing scope <span className="required-mark">Required</span></label>
                      <select id="person-consent-scope" required value={consentScope} onChange={(e) => setConsentScope(e.target.value)}>
                        <option>Appointment and follow-up scheduling only</option>
                        <option>Transportation and access coordination only</option>
                        <option>Full coordination and caregiver updates</option>
                      </select>
                    </div>
                  </div>
                )}
              </section>
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
      <section className="modal form-modal" role="dialog" aria-modal="true" aria-label="Schedule Follow-Up Task">
        <div className="modal-header">
          <div className="modal-heading-copy">
            <h2>Schedule Follow-Up Task</h2>
            <p>Assign and plan a non-clinical coordination check.</p>
          </div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-layout">
              <section className="form-section" aria-labelledby="followup-person-heading">
                <div className="form-section-header">
                  <h3 id="followup-person-heading">Person</h3>
                  <p>Choose the record this task belongs to.</p>
                </div>
                {patients.length ? (
                  <div className="form-group">
                    <label htmlFor="followup-patient">Person or record <span className="required-mark">Required</span></label>
                    <select id="followup-patient" required value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                      {patients.map((p) => <option key={p.id} value={p.id}>{p.id} · {p.displayName} ({p.facility})</option>)}
                    </select>
                  </div>
                ) : <p className="form-empty-note">Create a person record before scheduling a follow-up.</p>}
              </section>

              <section className="form-section" aria-labelledby="followup-task-heading">
                <div className="form-section-header">
                  <h3 id="followup-task-heading">Task plan</h3>
                  <p>Set the task type, due date, and person responsible.</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="followup-type">Follow-up type <span className="required-mark">Required</span></label>
                    <select id="followup-type" required value={followUpType} onChange={(e) => setFollowUpType(e.target.value)}>
                      <option>Routine check-in</option><option>Appointment reminder</option><option>Screening review</option><option>Handoff confirmation</option><option>Transportation assistance check</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="followup-due-date">Due date <span className="required-mark">Required</span></label>
                    <input id="followup-due-date" type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    <span className="form-hint">Demo date: {today}</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="followup-worker">Assigned health worker <span className="optional-mark">Optional</span></label>
                    <select id="followup-worker" value={assignedWorker} onChange={(e) => setAssignedWorker(e.target.value)}>
                      <option value="HW-01">HW-01 (Priya)</option><option value="HW-02">HW-02 (David)</option><option value="HW-03">HW-03 (Fatima)</option><option value="Unassigned">Unassigned</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="followup-next-date">Next check date <span className="optional-mark">Optional</span></label>
                    <input id="followup-next-date" type="date" value={nextFollowUpDate} onChange={(e) => setNextFollowUpDate(e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="form-section" aria-labelledby="followup-reason-heading">
                <div className="form-section-header">
                  <h3 id="followup-reason-heading">Coordination note</h3>
                  <p>State what needs to be checked or arranged.</p>
                </div>
                <div className="form-group">
                  <label htmlFor="followup-reason">Reason for follow-up <span className="required-mark">Required</span></label>
                  <textarea id="followup-reason" required maxLength={500} rows={3} placeholder="e.g. Call to confirm transportation arrangements for the clinic visit." value={reason} onChange={(e) => setReason(e.target.value)} />
                  <span className="form-hint">Keep the note administrative. Do not enter diagnoses or treatment instructions.</span>
                </div>
              </section>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="outline-button" onClick={close}>Cancel</button>
            <button type="submit" className="primary-button" disabled={!patients.length}><Check size={16} /> Schedule Task</button>
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
      <section className="modal form-modal" role="dialog" aria-modal="true" aria-label="Create Referral Record">
        <div className="modal-header">
          <div className="modal-heading-copy">
            <h2>Create Referral Record</h2>
            <p>Record a referral handoff and schedule its next check.</p>
          </div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-layout">
              <section className="form-section" aria-labelledby="referral-person-heading">
                <div className="form-section-header">
                  <h3 id="referral-person-heading">Person</h3>
                  <p>Choose the record being referred.</p>
                </div>
                {patients.length ? (
                  <div className="form-group">
                    <label htmlFor="referral-patient">Person or record <span className="required-mark">Required</span></label>
                    <select id="referral-patient" required value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                      {patients.map((p) => <option key={p.id} value={p.id}>{p.id} · {p.displayName} ({p.facility})</option>)}
                    </select>
                  </div>
                ) : <p className="form-empty-note">Create a person record before creating a referral.</p>}
              </section>

              <section className="form-section" aria-labelledby="referral-destination-heading">
                <div className="form-section-header">
                  <h3 id="referral-destination-heading">Receiving destination</h3>
                  <p>Choose where the handoff is being sent and the service that will receive it.</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="referral-destination">Destination <span className="required-mark">Required</span></label>
                    <select id="referral-destination" required value={destination} onChange={(e) => setDestination(e.target.value)}>
                      <option>Primary Health Centre</option><option>District Health Centre</option><option>Community Clinic A</option><option>Community Clinic B</option><option>Community Clinic C</option><option>Vision Health Center</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="referral-service">Receiving service <span className="required-mark">Required</span></label>
                    <select id="referral-service" required value={receivingService} onChange={(e) => setReceivingService(e.target.value)}>
                      <option>Primary Care Clinic</option><option>Specialist Consultation</option><option>Vision Center</option><option>Maternal & Child Health</option><option>Nutrition & Metabolic Support</option><option>Physical Therapy & Rehab</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="form-section" aria-labelledby="referral-tracking-heading">
                <div className="form-section-header">
                  <h3 id="referral-tracking-heading">Dates and handoff tracking</h3>
                  <p>Use the next check date to keep an unconfirmed handoff visible.</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="referral-sent-date">Referral date <span className="required-mark">Required</span></label>
                    <input id="referral-sent-date" type="date" required value={referralDate} onChange={(e) => setReferralDate(e.target.value)} />
                    <span className="form-hint">Demo date: {today}</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="referral-status">Initial handoff status <span className="required-mark">Required</span></label>
                    <select id="referral-status" required value={status} onChange={(e) => setStatus(e.target.value as ReferralStatus)}>
                      <option value="Draft">Draft — prepared, not sent</option><option value="Sent">Sent — awaiting acknowledgment</option><option value="Received">Received — acknowledged by destination</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="referral-appointment-date">Appointment date <span className="optional-mark">If known</span></label>
                    <input id="referral-appointment-date" type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="referral-next-date">Next follow-up check <span className="optional-mark">Recommended</span></label>
                    <input id="referral-next-date" type="date" value={nextFollowUpDate} onChange={(e) => setNextFollowUpDate(e.target.value)} />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="outline-button" onClick={close}>Cancel</button>
            <button type="submit" className="primary-button" disabled={!patients.length}><Check size={16} /> Create Referral</button>
          </div>
        </form>
      </section>
    </div>
  );
}
