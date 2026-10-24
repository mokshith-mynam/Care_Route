import { useState } from 'react';
import { Download, Printer, ShieldAlert, X } from 'lucide-react';
import type { FollowUp, Patient, Referral } from '../types';

interface ExportModalProps {
  patients: Patient[];
  followUps: FollowUp[];
  referrals: Referral[];
  today: string;
  close: () => void;
}

export function ExportModal({ patients, followUps, referrals, today, close }: ExportModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  const patient = patients.find((p) => p.id === selectedPatientId);
  const patientFollowUps = followUps.filter((f) => f.patientId === selectedPatientId);
  const patientReferrals = referrals.filter((r) => r.patientId === selectedPatientId);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!patient) return;
    const content = `
================================================================================
CAREROUTE - COMMUNITY HEALTH COORDINATION SUMMARY
NOTICE: SYNTHETIC DEMO RECORD - NOT REAL PATIENT DATA
================================================================================
Generated Date: ${today}
Notice: Administrative coordination summary only. Contains minimum necessary
coordination information. Does not provide clinical diagnoses or prescriptions.

PATIENT COORDINATION RECORD:
--------------------------------------------------------------------------------
Record ID: ${patient.id}
Display Label: ${patient.displayName}
Age Band: ${patient.ageBand}
Primary Facility: ${patient.facility}
Contact Phone: ${patient.contactPhone}
Last Screening Date: ${patient.lastScreening}

CAREGIVER SHARING CONSENT:
--------------------------------------------------------------------------------
Status: ${patient.consent?.status || 'Not Provided'}
Caregiver: ${patient.consent?.caregiverName || 'None'}
Scope: ${patient.consent?.scope || 'None'}
Granted Date: ${patient.consent?.grantedDate || 'N/A'}

SCHEDULED FOLLOW-UPS:
--------------------------------------------------------------------------------
${
  patientFollowUps.length === 0
    ? 'No follow-up tasks recorded.'
    : patientFollowUps
        .map(
          (f) =>
            `- [${f.id}] Due: ${f.dueDate} | Status: ${f.status} | Assigned: ${f.assignedWorker}
  Reason: ${f.reason}
  ${f.outcome ? `Outcome: ${f.outcome}` : ''}`
        )
        .join('\n')
}

REFERRAL HANDOFFS:
--------------------------------------------------------------------------------
${
  patientReferrals.length === 0
    ? 'No referrals recorded.'
    : patientReferrals
        .map(
          (r) =>
            `- [${r.id}] Destination: ${r.destination} (${r.receivingService})
  Status: ${r.status} | Referral Date: ${r.referralDate} | Appt Date: ${r.appointmentDate || 'Pending'}
  ${r.outcome ? `Outcome: ${r.outcome}` : ''}
  ${r.unableToConfirmReason ? `Reason: ${r.unableToConfirmReason}` : ''}`
        )
        .join('\n')
}

================================================================================
END OF SUMMARY - CAREROUTE COORDINATION PROTOCOL
================================================================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareRoute_Summary_${patient.id}_${today}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="modal wide" role="dialog" aria-modal="true" aria-label="Export Coordination Summary">
        <div className="modal-header">
          <h2>Export Coordination Summary</h2>
          <button className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700 }}>Select Person:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="filter-select"
              style={{ minWidth: '240px' }}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} · {p.displayName} ({p.facility})
                </option>
              ))}
            </select>
          </div>

          {patient && (
            <div className="printable-report">
              <div className="printable-watermark">
                SYNTHETIC DEMO RECORD · NOT REAL PATIENT DATA
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>CareRoute Coordination Summary</h3>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Generated on {today}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '14px', color: '#0f766e' }}>ID: {patient.id}</strong>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{patient.facility}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f9fafb', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                <div><strong>Display Label:</strong> {patient.displayName}</div>
                <div><strong>Age Band:</strong> {patient.ageBand}</div>
                <div><strong>Contact:</strong> {patient.contactPhone}</div>
                <div><strong>Consent:</strong> {patient.consent?.status || 'Not Provided'}</div>
                <div><strong>Caregiver:</strong> {patient.consent?.caregiverName || 'None'}</div>
                <div><strong>Scope:</strong> {patient.consent?.scope || 'None'}</div>
              </div>

              <h4 style={{ margin: '16px 0 8px', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f3f4f6', paddingBottom: '4px' }}>
                Follow-up Coordination Tasks ({patientFollowUps.length})
              </h4>
              {patientFollowUps.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>No follow-up tasks scheduled.</p>
              ) : (
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '12px' }}>
                  {patientFollowUps.map((f) => (
                    <li key={f.id} style={{ marginBottom: '6px' }}>
                      <strong>{f.id}</strong> — Due: {f.dueDate} | Status: <em>{f.status}</em> | Assigned: {f.assignedWorker}
                      <div>{f.reason} {f.outcome ? `· Outcome: ${f.outcome}` : ''}</div>
                    </li>
                  ))}
                </ul>
              )}

              <h4 style={{ margin: '16px 0 8px', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f3f4f6', paddingBottom: '4px' }}>
                Referral Handoffs ({patientReferrals.length})
              </h4>
              {patientReferrals.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>No referrals recorded.</p>
              ) : (
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '12px' }}>
                  {patientReferrals.map((r) => (
                    <li key={r.id} style={{ marginBottom: '6px' }}>
                      <strong>{r.id}</strong> — Destination: {r.destination} ({r.receivingService}) | Status: <em>{r.status}</em>
                      <div>Sent: {r.referralDate} {r.appointmentDate ? `| Appt: ${r.appointmentDate}` : ''} {r.outcome ? `| ${r.outcome}` : ''}</div>
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', fontSize: '11px', color: '#6b7280' }}>
                <ShieldAlert size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#f59e0b' }} />
                Administrative coordination document. Does not constitute a clinical diagnosis, medical prescription, or medical records release.
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="outline-button" onClick={handleDownload}>
            <Download size={15} /> Download Text File
          </button>
          <button type="button" className="primary-button" onClick={handlePrint}>
            <Printer size={15} /> Print Document
          </button>
        </div>
      </section>
    </div>
  );
}
