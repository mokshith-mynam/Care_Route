import {
  AlertCircle,
  BarChart3,
  CalendarCheck,
  Database,
  GitBranch,
  HeartPulse,
  History,
  LayoutDashboard,
  Lock,
  Moon,
  Settings2,
  Shield,
  ShieldCheck,
  Sun,
  Users,
} from 'lucide-react';
import type { Language, Translations } from '../i18n';
import type { UserRole } from '../types';

export type MainTab =
  | 'Overview'
  | 'Patients'
  | 'Follow-ups'
  | 'Referrals'
  | 'Needs Attention'
  | 'Analytics'
  | 'Timeline'
  | 'Rules';

interface SidebarProps {
  currentTab: MainTab;
  setTab: (tab: MainTab) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  overdueCount: number;
  openReferralsCount: number;
  attentionCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleHighContrast: () => void;
  onOpenStorageModal: () => void;
  canViewAnalytics: boolean;
  t: Translations;
}

export function Sidebar({
  currentTab,
  setTab,
  activeRole,
  onRoleChange,
  overdueCount,
  openReferralsCount,
  attentionCount,
  language,
  onLanguageChange,
  darkMode,
  onToggleHighContrast,
  onOpenStorageModal,
  canViewAnalytics,
  t,
}: SidebarProps) {
  const roleLabel = activeRole === 'Health worker' ? t.roleWorker
    : activeRole === 'Supervisor' ? t.roleSupervisor
    : activeRole === 'Clinical reviewer' ? t.roleReviewer
    : t.administrator;
  const navItems: { label: MainTab; text: string; icon: typeof LayoutDashboard; count?: number; countClass?: string }[] = [
    { label: 'Overview', text: t.navOverview, icon: LayoutDashboard },
    { label: 'Patients', text: t.navPatients, icon: Users },
    { label: 'Follow-ups', text: t.navFollowUps, icon: CalendarCheck, count: overdueCount, countClass: 'alert' },
    { label: 'Referrals', text: t.navReferrals, icon: GitBranch, count: openReferralsCount, countClass: 'purple' },
    { label: 'Needs Attention', text: t.navNeedsAttention, icon: AlertCircle, count: attentionCount, countClass: 'alert' },
    ...(canViewAnalytics ? [{ label: 'Analytics' as const, text: t.navAnalytics, icon: BarChart3 }] : []),
    { label: 'Timeline', text: t.navTimeline, icon: History },
    ...(canViewAnalytics ? [{ label: 'Rules' as const, text: t.navRules, icon: Settings2 }] : []),
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand">
        <div className="brand-mark">
          <HeartPulse size={24} />
        </div>
        <div>
          <strong>{t.appName}</strong>
          <span>{t.appTagline}</span>
        </div>
      </div>

      {/* Role Switcher Box (Demonstration of Backend-Enforced RBAC) */}
      <div className="role-box">
        <div className="role-box-header">
          <Lock size={12} />
          <span>{t.roleSwitcher}</span>
        </div>
        <select
          aria-label={t.roleSwitcher}
          value={activeRole}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          className="role-selector"
        >
          <option value="Health worker">{t.roleWorker}</option>
          <option value="Supervisor">{t.roleSupervisor}</option>
          <option value="Clinical reviewer">{t.roleReviewer}</option>
          <option value="Administrator">{t.administrator}</option>
        </select>
        <div style={{ marginTop: '6px', fontSize: '10px', color: '#99f6e4', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={12} />
          <span>{t.backendValidatesPermissions}</span>
        </div>
      </div>

      <div className="nav-label">{t.coordinationWorkspace}</div>

      {/* Nav List */}
      <nav>
        {navItems.map(({ label, text, icon: Icon, count, countClass }) => (
          <button
            key={label}
            type="button"
            className={`nav-item ${currentTab === label ? 'active' : ''}`}
            onClick={() => setTab(label)}
            aria-current={currentTab === label ? 'page' : undefined}
          >
            <Icon size={18} />
            <span>{text}</span>
            {count !== undefined && count > 0 && (
              <span className={`nav-count ${countClass || ''}`}>{count}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="sidebar-bottom">
        <div className="privacy-card">
          <div className="privacy-card-icon">
            <Shield size={16} />
            <strong>{t.demoNotice}</strong>
          </div>
          <p>{t.nonDiagnosticDisclaimer}</p>
        </div>

        {/* Language and Contrast Toolbar */}
        <div className="lang-contrast-row">
          <select
            aria-label="Select interface language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="lang-select"
          >
            <option value="en">English (EN)</option>
            <option value="te">తెలుగు (TE)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="mr">मराठी (MR)</option>
            <option value="ta">தமிழ் (TA)</option>
          </select>

          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={onToggleHighContrast}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={onOpenStorageModal}
            title="Local SQLite & Privacy Info"
            aria-label="Storage info"
          >
            <Database size={14} />
          </button>
        </div>

        {/* Current Active Actor Avatar */}
        <div className="user-profile">
          <div className={`avatar ${activeRole === 'Supervisor' ? 'supervisor' : activeRole === 'Clinical reviewer' ? 'reviewer' : activeRole === 'Administrator' ? 'admin' : ''}`}>
            {activeRole === 'Supervisor' ? 'SUP' : activeRole === 'Clinical reviewer' ? 'CR' : activeRole === 'Administrator' ? 'ADM' : 'HW'}
          </div>
          <div className="user-profile-info">
            <strong>
              {activeRole === 'Supervisor'
                ? 'Marcus Vance (SUP-01)'
                : activeRole === 'Clinical reviewer'
                ? 'Dr. Rostova (CR-01)'
                : activeRole === 'Administrator'
                ? 'System Administrator (ADM-01)'
                : 'Priya Sharma (HW-01)'}
            </strong>
            <span>{roleLabel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
