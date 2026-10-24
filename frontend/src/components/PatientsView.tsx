import { useState } from 'react';
import { Search, UserCheck, UserPlus, Users, UserX } from 'lucide-react';
import type { Translations } from '../i18n';
import type { FollowUp, Patient, Referral } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  followUps: FollowUp[];
  referrals: Referral[];
  onOpenNewPatient: () => void;
  onSelectPatient: (patientId: string) => void;
  t: Translations;
}

export function PatientsView({
  patients,
  followUps,
  referrals,
  onOpenNewPatient,
  onSelectPatient,
  t,
}: PatientsViewProps) {
  const [query, setQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('All');

  const facilities = ['All', 'Community Clinic A', 'Community Clinic B', 'Community Clinic C'];

  const filtered = patients.filter((p) => {
    const matchesQuery = `${p.id} ${p.displayName} ${p.facility} ${p.observation}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFacility = facilityFilter === 'All' || p.facility === facilityFilter;
    return matchesQuery && matchesFacility;
  });

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t.directoryEyebrow}</div>
          <h1>{t.navPatients}</h1>
          <p>{t.patientsDescription}</p>
        </div>

        <button type="button" className="primary-button" onClick={onOpenNewPatient}>
          <UserPlus size={16} /> {t.addPatient}
        </button>
      </div>

      <section className="panel">
        <div className="table-toolbar">
          <div className="search-input-group">
            <Search size={16} color="#6b827e" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPatients}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="filter-select"
            >
              {facilities.map((fac) => (
                <option key={fac} value={fac}>{fac === 'All' ? t.allFacilities : fac}</option>
              ))}
            </select>

            <span style={{ fontSize: '13px', color: '#64748b' }}>
              <strong>{filtered.length}</strong> / {patients.length} {t.records}
            </span>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.recordId}</th>
                <th>{t.personLabel}</th>
                <th>{t.ageBand}</th>
                <th>{t.primaryFacility}</th>
                <th>{t.caregiverConsent}</th>
                <th>{t.lastScreening}</th>
                <th>{t.activeWork}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Users size={28} />
                      <strong>{t.noMatchingRecords}</strong>
                      <p>{t.refineSearch}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const openTasks = followUps.filter(
                    (f) => f.patientId === p.id && f.status !== 'Completed' && f.status !== 'Closed'
                  ).length;
                  const openRefs = referrals.filter(
                    (r) => r.patientId === p.id && !['Completed', 'Cancelled', 'Unable to Confirm'].includes(r.status)
                  ).length;

                  return (
                    <tr key={p.id} className="mobile-card-row">
                      <td data-label="Record ID">
                        <strong style={{ color: '#0f766e', cursor: 'pointer' }} onClick={() => onSelectPatient(p.id)}>
                          {p.id}
                        </strong>
                      </td>
                      <td data-label="Person Label">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                            {p.id.slice(-2)}
                          </span>
                          <div>
                            <strong
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                              onClick={() => onSelectPatient(p.id)}
                            >
                              {p.displayName}
                            </strong>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{p.contactPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Age Band">{p.ageBand}</td>
                      <td data-label="Primary Facility">{p.facility}</td>
                      <td data-label="Caregiver Consent">
                        {p.consent?.status === 'Active' ? (
                          <span className="status-pill complete">
                            <UserCheck size={12} /> {t.active}
                          </span>
                        ) : p.consent?.status === 'Revoked' ? (
                          <span className="status-pill overdue">
                            <UserX size={12} /> {t.revoked}
                          </span>
                        ) : (
                          <span className="status-pill neutral">{t.notProvided}</span>
                        )}
                      </td>
                      <td data-label="Last Screening">{p.lastScreening}</td>
                      <td data-label="Active Work">
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span className="count-chip" style={{ background: '#ecfdf5', color: '#065f46' }}>
                            {openTasks} {openTasks === 1 ? t.task : t.tasks}
                          </span>
                          {openRefs > 0 && (
                            <span className="count-chip" style={{ background: '#f3e8ff', color: '#6b21a8' }}>
                            {openRefs} {t.ref}
                            </span>
                          )}
                        </div>
                      </td>
                      <td data-label="Actions">
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ padding: '6px 10px', fontSize: '11px' }}
                          onClick={() => onSelectPatient(p.id)}
                        >
                          {t.viewProfile}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
