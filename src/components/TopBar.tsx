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
}: TopBarProps) {
  const supabaseConfig = getSupabaseConfig();
  const isSupabaseActive = supabaseConfig.isConfigured && supabaseConfig.activeBackend === 'supabase';

  return (
    <>
      {/* Top Banner: Synthetic Data & Connection Indicator */}
      <div className="synthetic-banner">
        <div className="synthetic-banner-left">
          <strong>DEMO ENVIRONMENT:</strong>
          <span>Synthetic data only. Fictional patient records and facilities.</span>
        </div>

        <div className="synthetic-banner-right">
          {isOffline ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="offline-badge">
                <WifiOff size={13} /> Offline Mode ({pendingOfflineCount} queued)
              </span>
              <button
                type="button"
                className="sim-offline-btn"
                onClick={onSyncOffline}
                title="Sync queued changes with backend"
              >
                Sync Queue
              </button>
            </div>
          ) : isSupabaseActive ? (
            <span
              className="offline-badge connected"
              style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', cursor: onOpenStorageModal ? 'pointer' : 'default' }}
              onClick={onOpenStorageModal}
              title="Connected to Supabase Cloud. Click to view storage and database settings."
            >
              <Cloud size={13} /> Connected to Supabase Cloud
            </span>
          ) : (
            <span
              className="offline-badge connected"
              style={{ cursor: onOpenStorageModal ? 'pointer' : 'default' }}
              onClick={onOpenStorageModal}
              title="Connected to Local SQLite. Click to configure Supabase."
            >
              <Wifi size={13} /> Connected to Local SQLite
            </span>
          )}

          <button
            type="button"
            className="sim-offline-btn"
            onClick={onToggleOffline}
          >
            {isOffline ? 'Go Online' : 'Simulate Offline'}
          </button>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="topbar">
        <div className="breadcrumb">
          <span>CareRoute</span>
          <span>/</span>
          <strong>{currentTab}</strong>
          <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
          <span className="role-pill-badge">
            <Lock size={11} /> {activeRole}
          </span>
        </div>

        <div className="top-actions">
          <span className="today-label">
            Demo Date: <strong>{today}</strong>
          </span>

          <button
            type="button"
            className="action-chip-btn"
            onClick={onOpenExport}
            title="Export Minimum-Necessary Coordination Summary"
          >
            <Download size={14} /> Export Summary
          </button>

          <button
            type="button"
            className="icon-button"
            title="Notifications / Pending Alerts"
            onClick={onOpenNotifications}
            aria-label="View overdue alerts"
          >
            <Bell size={18} />
            {overdueCount > 0 && <i />}
          </button>
        </div>
      </header>
    </>
  );
}
