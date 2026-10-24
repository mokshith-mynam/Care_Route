import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from './apiClient';
import { AddFollowUpModal, AddPatientModal, AddReferralModal, type NewPatientFormData } from './components/CreateModals';
import { DashboardView } from './components/DashboardView';
import { ExportModal } from './components/ExportModal';
import { FollowUpsView } from './components/FollowUpsView';
import { NeedsAttentionView } from './components/NeedsAttentionView';
import { PatientDetailModal } from './components/PatientDetailModal';
import { PatientsView } from './components/PatientsView';
import { ReferralsView } from './components/ReferralsView';
import { RulesConfigView } from './components/RulesConfigView';
import { Sidebar, type MainTab } from './components/Sidebar';
import { StorageInfoModal } from './components/StorageInfoModal';
import { SupervisorAnalyticsView } from './components/SupervisorAnalyticsView';
import { TimelineView } from './components/TimelineView';
import { TopBar } from './components/TopBar';
import {
  defaultRules,
  demoAuditEvents,
  demoFollowUps,
  demoObservations,
  demoPatients,
  demoReferrals,
} from './demoData';
import { translations, type Language } from './i18n';
import { generateCoordinationInsights, isFollowUpOverdue, isReferralUnconfirmed } from './rules';
import type {
  AnalyticsSummary,
  AuditEvent,
  CaregiverConsent,
  FollowUp,
  FollowUpStatus,
  Patient,
  Referral,
  ReferralStatus,
  RuleConfig,
  ScreeningObservation,
  UserRole,
} from './types';

const TODAY = '2026-10-23'; // Fixed reproducible demo date

export default function App() {
  const [currentTab, setTab] = useState<MainTab>('Overview');
  const [activeRole, setActiveRole] = useState<UserRole>('Health worker');
  const [language, setLanguage] = useState<Language>('en');
  const [highContrast, setHighContrast] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingOfflineCount, setPendingOfflineCount] = useState(0);

  // Domain data state
  const [patients, setPatients] = useState<Patient[]>(demoPatients);
  const [followUps, setFollowUps] = useState<FollowUp[]>(demoFollowUps);
  const [referrals, setReferrals] = useState<Referral[]>(demoReferrals);
  const [observations, setObservations] = useState<ScreeningObservation[]>(demoObservations);
  const [events, setEvents] = useState<AuditEvent[]>(demoAuditEvents);
  const [rules, setRules] = useState<RuleConfig>(defaultRules);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Modals state
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddFollowUpModal, setShowAddFollowUpModal] = useState(false);
  const [showAddReferralModal, setShowAddReferralModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'error' | 'success' } | null>(null);

  const t = translations[language];

  const showToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3800);
  };

  // Initial load from backend API
  const refreshData = async () => {
    try {
      const [pts, fus, refs, rls, anl, evts] = await Promise.all([
        api.getPatients(),
        api.getFollowUps(),
        api.getReferrals(),
        api.getRules(),
        api.getAnalytics(TODAY),
        api.getTimeline(),
      ]);

      setPatients(pts);
      setFollowUps(fus);
      setReferrals(refs);
      setRules(rls);
      setAnalytics(anl);
      setEvents(evts);
    } catch (err) {
      console.warn('Backend API connection note (using local cache):', err);
    }
  };

  useEffect(() => {
    refreshData();
    updateOfflineQueueCount();
  }, []);

  useEffect(() => {
    const hasOpenDialog = Boolean(selectedPatientId || showAddPatientModal || showAddFollowUpModal || showAddReferralModal || showExportModal || showStorageModal);
    if (!hasOpenDialog) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (showStorageModal) setShowStorageModal(false);
      else if (showExportModal) setShowExportModal(false);
      else if (showAddReferralModal) setShowAddReferralModal(false);
      else if (showAddFollowUpModal) setShowAddFollowUpModal(false);
      else if (showAddPatientModal) setShowAddPatientModal(false);
      else setSelectedPatientId(null);
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [selectedPatientId, showAddPatientModal, showAddFollowUpModal, showAddReferralModal, showExportModal, showStorageModal]);

  const updateOfflineQueueCount = () => {
    const queue = api.getOfflineQueue();
    setPendingOfflineCount(queue.length);
  };

  // Role switching
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    api.setRole(role);
    if (role !== 'Supervisor' && role !== 'Administrator' && currentTab === 'Analytics') {
      setTab('Overview');
    }
    showToast(`Switched active demo role to ${role}`, 'info');
  };

  const canManageCoordination = activeRole !== 'Clinical reviewer';
  const canViewAnalytics = activeRole === 'Supervisor' || activeRole === 'Administrator';
  const guardedAction = (allowed: boolean, action: () => void, message: string) => {
    if (!allowed) {
      showToast(message, 'error');
      return;
    }
    action();
  };

  // Offline simulation toggle
  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    api.setOfflineSimulation(next);
    showToast(next ? 'Offline simulation active: actions will queue locally.' : 'Back online: reconnected to local SQLite.', next ? 'info' : 'success');
    updateOfflineQueueCount();
  };

  // Sync offline queue
  const handleSyncOffline = async () => {
    try {
      const res = await api.syncOfflineQueue();
      showToast(`Synced ${res.syncedCount} queued action(s) with local SQLite database!`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync error';
      showToast(`Sync error: ${msg}`, 'error');
    }
  };

  // High contrast mode toggle
  const handleToggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  // Patient Actions
  const handleCreatePatient = async (data: NewPatientFormData) => {
    try {
      const created = await api.createPatient(data);
      setPatients((prev) => [created, ...prev]);
      showToast(`Created synthetic record: ${created.id} (${created.displayName})`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating patient';
      showToast(msg, 'error');
    }
  };

  const handleAddObservation = async (patientId: string, type: string, notes: string) => {
    try {
      const obs = await api.addObservation(patientId, { screeningType: type, observationNotes: notes });
      setObservations((prev) => [obs, ...prev]);
      showToast(`Recorded screening observation for ${patientId}`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding observation';
      showToast(msg, 'error');
    }
  };

  const handleUpdateConsent = async (patientId: string, consent: Partial<CaregiverConsent>) => {
    try {
      const updated = await api.updateConsent(patientId, consent);
      setPatients((prev) =>
        prev.map((p) => (p.id === patientId ? { ...p, consent: updated } : p))
      );
      showToast(`Updated caregiver-sharing consent for ${patientId}: ${updated.status}`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating consent';
      showToast(msg, 'error');
    }
  };

  // Follow-Up Actions
  const handleCreateFollowUp = async (data: Partial<FollowUp>) => {
    try {
      const created = await api.createFollowUp(data);
      setFollowUps((prev) => [created, ...prev]);
      showToast(`Scheduled follow-up ${created.id} (Due: ${created.dueDate})`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating follow-up';
      showToast(msg, 'error');
    }
  };

  const handleUpdateFollowUpStatus = async (id: string, status: FollowUpStatus, outcome?: string) => {
    try {
      const updated = await api.updateFollowUp(id, { status, outcome });
      setFollowUps((prev) => prev.map((f) => (f.id === id ? updated : f)));
      showToast(`Updated follow-up ${id} to ${status}`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating task';
      showToast(msg, 'error');
    }
  };

  const handleRescheduleFollowUp = async (id: string, newDate: string, reason: string) => {
    try {
      const updated = await api.updateFollowUp(id, {
        dueDate: newDate,
        status: 'Rescheduled',
        rescheduleReason: reason,
      });
      setFollowUps((prev) => prev.map((f) => (f.id === id ? updated : f)));
      showToast(`Rescheduled task ${id} to ${newDate}`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error rescheduling task';
      showToast(msg, 'error');
    }
  };

  const handleCloseFollowUp = async (id: string, reason: string) => {
    try {
      const updated = await api.updateFollowUp(id, {
        status: 'Closed',
        closeReason: reason,
      });
      setFollowUps((prev) => prev.map((f) => (f.id === id ? updated : f)));
      showToast(`Closed follow-up task ${id}`, 'info');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error closing task';
      showToast(msg, 'error');
    }
  };

  const handleReassignFollowUp = async (id: string, worker: string) => {
    try {
      const updated = await api.updateFollowUp(id, { assignedWorker: worker });
      setFollowUps((prev) => prev.map((f) => (f.id === id ? updated : f)));
      showToast(`Reassigned ${id} to ${worker}`, 'info');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reassigning worker';
      showToast(msg, 'error');
    }
  };

  // Referral Actions
  const handleCreateReferral = async (data: Partial<Referral>) => {
    try {
      const created = await api.createReferral(data);
      setReferrals((prev) => [created, ...prev]);
      showToast(`Created referral ${created.id} to ${created.destination}`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating referral';
      showToast(msg, 'error');
    }
  };

  const handleUpdateReferralStatus = async (
    id: string,
    status: ReferralStatus,
    extra?: { outcome?: string; unableToConfirmReason?: string; note?: string }
  ) => {
    try {
      const updated = await api.updateReferral(id, { status, ...extra });
      setReferrals((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast(`Updated referral ${id} status: ${status}`, 'success');
      updateOfflineQueueCount();
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating referral';
      showToast(msg, 'error');
    }
  };

  // Rules Configuration (Demonstrates Backend RBAC Enforcement)
  const handleSaveRules = async (newRules: RuleConfig): Promise<{ success: boolean; error?: string }> => {
    try {
      const updated = await api.updateRules(newRules);
      setRules(updated);
      showToast('Administrative routing rules saved to local SQLite!', 'success');
      await refreshData();
      return { success: true };
    } catch (err: unknown) {
      let msg = 'Permission denied: Backend authorization failed.';
      if (err instanceof ApiError && typeof (err.data as Record<string, unknown>)?.error === 'string') {
        msg = (err.data as Record<string, unknown>).error as string;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Database Reset and Purge
  const handleResetDatabase = async () => {
    try {
      await api.resetDatabase();
      showToast('Restored original synthetic demo dataset in local SQLite database.', 'success');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resetting database';
      showToast(msg, 'error');
    }
  };

  const handlePurgeDatabase = async () => {
    try {
      await api.purgeDatabase();
      showToast('Local database records purged.', 'info');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error purging database';
      showToast(msg, 'error');
    }
  };

  // Derived counts
  const overdueCount = useMemo(
    () => followUps.filter((f) => isFollowUpOverdue(f, TODAY, rules)).length,
    [followUps, rules]
  );
  const openReferralsCount = useMemo(
    () => referrals.filter((r) => isReferralUnconfirmed(r)).length,
    [referrals]
  );
  const insights = useMemo(
    () => generateCoordinationInsights(patients, followUps, referrals, TODAY, rules),
    [patients, followUps, referrals, rules]
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'error' : ''}`} role="status">
          {toast.message}
        </div>
      )}

      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        overdueCount={overdueCount}
        openReferralsCount={openReferralsCount}
        attentionCount={insights.length}
        language={language}
        onLanguageChange={setLanguage}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
        onOpenStorageModal={() => setShowStorageModal(true)}
        canViewAnalytics={canViewAnalytics}
        t={t}
      />

      {/* Main Workspace Area */}
      <main className="main-area">
        <TopBar
          currentTab={currentTab}
          activeRole={activeRole}
          today={TODAY}
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
          pendingOfflineCount={pendingOfflineCount}
          onSyncOffline={handleSyncOffline}
          overdueCount={overdueCount}
          onOpenNotifications={() => setTab('Needs Attention')}
          onOpenExport={() => setShowExportModal(true)}
          onOpenStorageModal={() => setShowStorageModal(true)}
        />

        <div className="content">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'Overview' && (
            <DashboardView
              patients={patients}
              followUps={followUps}
              referrals={referrals}
              rules={rules}
              today={TODAY}
              onOpenNewFollowUp={() => guardedAction(canManageCoordination, () => setShowAddFollowUpModal(true), 'Clinical reviewers have read-only coordination access.')}
              onOpenNewReferral={() => guardedAction(canManageCoordination, () => setShowAddReferralModal(true), 'Clinical reviewers cannot create referrals.')}
              onOpenNewPatient={() => guardedAction(canManageCoordination, () => setShowAddPatientModal(true), 'Clinical reviewers cannot create person records.')}
              onNavigateTab={(tab) => setTab(tab)}
              onCompleteFollowUp={(id) => guardedAction(canManageCoordination, () => handleUpdateFollowUpStatus(id, 'Completed'), 'Clinical reviewers cannot update follow-up status.')}
              onRescheduleFollowUp={() => {
                setTab('Follow-ups');
              }}
              onCloseFollowUp={(id) => handleCloseFollowUp(id, 'Resolved')}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              t={t}
            />
          )}

          {/* TAB 2: PATIENTS */}
          {currentTab === 'Patients' && (
            <PatientsView
              patients={patients}
              followUps={followUps}
              referrals={referrals}
              onOpenNewPatient={() => guardedAction(canManageCoordination, () => setShowAddPatientModal(true), 'Clinical reviewers cannot create person records.')}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              t={t}
            />
          )}

          {/* TAB 3: FOLLOW-UPS */}
          {currentTab === 'Follow-ups' && (
            <FollowUpsView
              followUps={followUps}
              patients={patients}
              rules={rules}
              today={TODAY}
              onOpenNewFollowUp={() => guardedAction(canManageCoordination, () => setShowAddFollowUpModal(true), 'Clinical reviewers have read-only coordination access.')}
              onUpdateStatus={(id, status, outcome) => guardedAction(canManageCoordination, () => handleUpdateFollowUpStatus(id, status, outcome), 'Clinical reviewers cannot update follow-up status.')}
              onReschedule={(id, date, reason) => guardedAction(canManageCoordination, () => handleRescheduleFollowUp(id, date, reason), 'Clinical reviewers cannot reschedule follow-ups.')}
              onCloseTask={(id, reason) => guardedAction(canManageCoordination, () => handleCloseFollowUp(id, reason), 'Clinical reviewers cannot close follow-ups.')}
              onReassign={(id, worker) => guardedAction(activeRole === 'Supervisor' || activeRole === 'Administrator', () => handleReassignFollowUp(id, worker), 'Only supervisors or administrators can reassign follow-ups.')}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              t={t}
            />
          )}

          {/* TAB 4: REFERRALS & LOOP CLOSURE */}
          {currentTab === 'Referrals' && (
            <ReferralsView
              referrals={referrals}
              patients={patients}
              rules={rules}
              today={TODAY}
              onOpenNewReferral={() => guardedAction(canManageCoordination, () => setShowAddReferralModal(true), 'Clinical reviewers cannot create referrals.')}
              onUpdateReferralStatus={handleUpdateReferralStatus}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              t={t}
            />
          )}

          {/* TAB 5: NEEDS ATTENTION (EXPLAINABLE INSIGHTS) */}
          {currentTab === 'Needs Attention' && (
            <NeedsAttentionView
              patients={patients}
              followUps={followUps}
              referrals={referrals}
              rules={rules}
              today={TODAY}
              onNavigateTab={(tab) => setTab(tab)}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              t={t}
            />
          )}

          {/* TAB 6: SUPERVISOR ANALYTICS */}
          {currentTab === 'Analytics' && (
            <SupervisorAnalyticsView
              analytics={
                analytics || {
                  totalPatients: patients.length,
                  totalFollowUps: followUps.length,
                  dueTodayCount: followUps.filter((f) => f.dueDate === TODAY && f.status !== 'Completed').length,
                  overdueCount,
                  completedFollowUps: followUps.filter((f) => f.status === 'Completed').length,
                  unassignedFollowUps: followUps.filter((f) => !f.assignedWorker || f.assignedWorker === 'Unassigned').length,
                  totalReferrals: referrals.length,
                  openReferrals: openReferralsCount,
                  unconfirmedReferrals: openReferralsCount,
                  completedReferrals: referrals.filter((r) => r.status === 'Completed').length,
                  unableToConfirmReferrals: referrals.filter((r) => r.status === 'Unable to Confirm').length,
                  workloadByWorker: [],
                  serviceBottlenecks: [],
                  dailyTrends: [],
                }
              }
              today={TODAY}
              t={t}
            />
          )}

          {/* TAB 7: TIMELINE */}
          {currentTab === 'Timeline' && <TimelineView events={events} t={t} />}

          {/* TAB 8: ROUTING RULES CONFIGURATION */}
          {currentTab === 'Rules' && (
            <RulesConfigView
              rules={rules}
              onSaveRules={handleSaveRules}
              activeRole={activeRole}
              onSwitchRole={handleRoleChange}
              followUps={followUps}
              referrals={referrals}
              patients={patients}
              today={TODAY}
              t={t}
            />
          )}
        </div>

        <footer style={{ borderTop: '1px solid #e3ebe8', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
          <span>Demo Environment · Synthetic Data Only · SQLite Database: <code>data/careroute.db</code></span>
          <span>CareRoute Community Health Follow-Up Coordination MVP</span>
        </footer>
      </main>

      {/* Patient Detail Profile Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          observations={observations}
          followUps={followUps}
          referrals={referrals}
          today={TODAY}
          close={() => setSelectedPatientId(null)}
          onAddObservation={handleAddObservation}
          onUpdateConsent={handleUpdateConsent}
          onStatusFollowUp={handleUpdateFollowUpStatus}
          onStatusReferral={handleUpdateReferralStatus}
        />
      )}

      {/* Creation Modals */}
      {showAddPatientModal && (
        <AddPatientModal
          close={() => setShowAddPatientModal(false)}
          onSubmit={handleCreatePatient}
          today={TODAY}
        />
      )}

      {showAddFollowUpModal && (
        <AddFollowUpModal
          patients={patients}
          close={() => setShowAddFollowUpModal(false)}
          onSubmit={handleCreateFollowUp}
          today={TODAY}
          initialPatientId={selectedPatientId || undefined}
        />
      )}

      {showAddReferralModal && (
        <AddReferralModal
          patients={patients}
          close={() => setShowAddReferralModal(false)}
          onSubmit={handleCreateReferral}
          today={TODAY}
          initialPatientId={selectedPatientId || undefined}
        />
      )}

      {/* Coordination Summary Export Modal */}
      {showExportModal && (
        <ExportModal
          patients={patients}
          followUps={followUps}
          referrals={referrals}
          today={TODAY}
          close={() => setShowExportModal(false)}
        />
      )}

      {/* Local Storage & Privacy Modal */}
      {showStorageModal && (
        <StorageInfoModal
          close={() => setShowStorageModal(false)}
          onReset={handleResetDatabase}
          onPurge={handlePurgeDatabase}
          onBackendChange={refreshData}
        />
      )}
    </div>
  );
}
