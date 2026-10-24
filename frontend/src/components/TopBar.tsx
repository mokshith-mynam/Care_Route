import {
  Bell,
  Cloud,
  Download,
  Lock,
  Wifi,
  WifiOff,
} from 'lucide-react';
import type { MainTab } from './Sidebar';
import type { UserRole } from '../types';
import type { Translations } from '../i18n';
import { getSupabaseConfig } from '../supabaseClient';

interface TopBarProps {
  currentTab: MainTab;
  activeRole: UserRole;
  today: string;
  isOffline: boolean;
  onToggleOffline: () => void;
  pendingOfflineCount: number;
  onSyncOffline: () => void;
  overdueCount: number;
  onOpenNotifications: () => void;
  onOpenExport: () => void;
  onOpenStorageModal?: () => void;
  t: Translations;
}

export function TopBar({
  currentTab,
  activeRole,
  today,
  isOffline,
  onToggleOffline,
  pendingOfflineCount,
  onSyncOffline,
  overdueCount,
  onOpenNotifications,
  onOpenExport,
  onOpenStorageModal,
  t,
}: TopBarProps) {
  const supabaseConfig = getSupabaseConfig();
  const isSupabaseActive = supabaseConfig.isConfigured && supabaseConfig.activeBackend === 'supabase';
  const tabLabels: Record<MainTab, string> = {
    Overview: t.navOverview, Patients: t.navPatients, 'Follow-ups': t.navFollowUps,
    Referrals: t.navReferrals, 'Needs Attention': t.navNeedsAttention, Analytics: t.navAnalytics,
    Timeline: t.navTimeline, Rules: t.navRules,
  };
  const roleLabels: Record<UserRole, string> = {
    'Health worker': t.roleWorker, Supervisor: t.roleSupervisor,
    'Clinical reviewer': t.roleReviewer, Administrator: t.administrator,
  };

  return (
    <>
      {/* Top Banner: Synthetic Data & Connection Indicator */}
      <div className="synthetic-banner">
        <div className="synthetic-banner-left">
          <strong>{t.demoEnvironment}</strong>
          <span>{t.syntheticOnly}</span>
        </div>

        <div className="synthetic-banner-right">
          {isOffline ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="offline-badge">
                <WifiOff size={13} /> {t.offlineMode} ({pendingOfflineCount})
              </span>
              <button
                type="button"
                className="sim-offline-btn"
                onClick={onSyncOffline}
                title={t.syncQueue}
              >
                {t.syncQueue}
              </button>
            </div>
          ) : isSupabaseActive ? (
            <span
              className="offline-badge connected"
              style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', cursor: onOpenStorageModal ? 'pointer' : 'default' }}
              onClick={onOpenStorageModal}
              title={`${t.connectedSupabase}. ${t.viewStorageSettings}`}
            >
              <Cloud size={13} /> {t.connectedSupabase}
            </span>
          ) : (
            <span
              className="offline-badge connected"
              style={{ cursor: onOpenStorageModal ? 'pointer' : 'default' }}
              onClick={onOpenStorageModal}
              title={`${t.connectedSQLite}. ${t.configureSupabase}`}
            >
              <Wifi size={13} /> {t.connectedSQLite}
            </span>
          )}

          <button
            type="button"
            className="sim-offline-btn"
            onClick={onToggleOffline}
          >
            {isOffline ? t.goOnline : t.simulateOffline}
          </button>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="topbar">
        <div className="breadcrumb">
          <span>CareRoute</span>
          <span>/</span>
          <strong>{tabLabels[currentTab]}</strong>
          <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
          <span className="role-pill-badge">
            <Lock size={11} /> {roleLabels[activeRole]}
          </span>
        </div>

        <div className="top-actions">
          <span className="today-label">
            {t.demoDate} <strong>{today}</strong>
          </span>

          <button
            type="button"
            className="action-chip-btn"
            onClick={onOpenExport}
            title={t.exportSummary}
          >
            <Download size={14} /> {t.exportSummary}
          </button>

          <button
            type="button"
            className="icon-button"
            title={t.viewOverdueAlerts}
            onClick={onOpenNotifications}
            aria-label={t.viewOverdueAlerts}
          >
            <Bell size={18} />
            {overdueCount > 0 && <i />}
          </button>
        </div>
      </header>
    </>
  );
}
