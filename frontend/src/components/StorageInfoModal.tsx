import { useState } from 'react';
import {
  CheckCircle2,
  Cloud,
  Database,
  KeyRound,
  Link2,
  Lock,
  RefreshCw,
  Server,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  clearSupabaseConfig,
  getSupabaseConfig,
  saveSupabaseConfig,
  setBackendMode,
  testSupabaseConnection,
} from '../supabaseClient';
import { supabaseService } from '../supabaseService';

interface StorageInfoModalProps {
  close: () => void;
  onReset: () => void;
  onPurge: () => void;
  onBackendChange?: () => void;
}

export function StorageInfoModal({ close, onReset, onPurge, onBackendChange }: StorageInfoModalProps) {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [inputUrl, setInputUrl] = useState(config.url || '');
  const [inputAnonKey, setInputAnonKey] = useState(config.anonKey || '');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const isSupabaseActive = config.isConfigured && config.activeBackend === 'supabase';

  const handleSaveAndConnect = async () => {
    if (!inputUrl.trim() || !inputAnonKey.trim()) {
      alert('Please provide both the Supabase Project URL and Anon Public Key.');
      return;
    }
    saveSupabaseConfig(inputUrl.trim(), inputAnonKey.trim(), true);
    const updated = getSupabaseConfig();
    setConfig(updated);
    if (onBackendChange) onBackendChange();
    handleTestConnection();
  };

  const handleSwitchToSqlite = () => {
    setBackendMode('sqlite');
    setConfig(getSupabaseConfig());
    if (onBackendChange) onBackendChange();
  };

  const handleSwitchToSupabase = () => {
    setBackendMode('supabase');
    setConfig(getSupabaseConfig());
    if (onBackendChange) onBackendChange();
  };

  const handleClearCredentials = () => {
    if (window.confirm('Remove saved Supabase credentials and switch to Local SQLite?')) {
      clearSupabaseConfig();
      setInputUrl('');
      setInputAnonKey('');
      setConfig(getSupabaseConfig());
      setTestResult(null);
      if (onBackendChange) onBackendChange();
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection test failed';
      setTestResult({ success: false, message: msg });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedSupabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await supabaseService.seedDemoDataToSupabase();
      setSeedResult(res.message);
      if (onBackendChange) onBackendChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to seed Supabase';
      setSeedResult(`Error: ${msg}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="modal wide" role="dialog" aria-modal="true" aria-label="Storage, Privacy & Database Architecture">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={20} color="#0f766e" />
            <h2 style={{ margin: 0 }}>Database & Storage Integration Architecture</h2>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Active Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isSupabaseActive ? '#f0fdf4' : '#f8fafc', border: `1px solid ${isSupabaseActive ? '#86efac' : '#cbd5e1'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                Active Storage Engine
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: isSupabaseActive ? '#15803d' : '#0f766e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isSupabaseActive ? <Cloud size={18} /> : <Database size={18} />}
                {isSupabaseActive ? 'Supabase Cloud (PostgreSQL with RLS Policies)' : 'Local SQLite (database/local/careroute.db via node:sqlite)'}
              </div>
            </div>

            {config.isConfigured && (
              <div>
                {isSupabaseActive ? (
                  <button type="button" className="outline-button" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleSwitchToSqlite}>
                    <Database size={14} /> Switch to Local SQLite
                  </button>
                ) : (
                  <button type="button" className="primary-button" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleSwitchToSupabase}>
                    <Cloud size={14} /> Switch to Supabase Cloud
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Section 1: Supabase Cloud Configuration */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Cloud size={18} color="#2563eb" />
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                Supabase Project Connection
              </h3>
            </div>

            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#475569' }}>
              Connect CareRoute to your Supabase project. Enter your project API credentials below or define <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <Link2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <KeyRound size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={inputAnonKey}
                  onChange={(e) => setInputAnonKey(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="primary-button"
                onClick={handleSaveAndConnect}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                <CheckCircle2 size={14} /> Connect to Supabase
              </button>

              {config.isConfigured && (
                <>
                  <button
                    type="button"
                    className="outline-button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    <RefreshCw size={14} className={isTesting ? 'spinning' : ''} />
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </button>

                  <button
                    type="button"
                    className="outline-button"
                    onClick={handleSeedSupabase}
                    disabled={isSeeding}
                    style={{ fontSize: '12px', padding: '6px 14px', color: '#0f766e', borderColor: '#0f766e' }}
                    title="Insert initial synthetic demo patients and tasks into Supabase"
                  >
                    <Sparkles size={14} />
                    {isSeeding ? 'Seeding...' : 'Seed Demo Records to Supabase'}
                  </button>

                  <button
                    type="button"
                    className="outline-button"
                    onClick={handleClearCredentials}
                    style={{ fontSize: '12px', padding: '6px 14px', color: '#b91c1c' }}
                  >
                    Clear Credentials
                  </button>
                </>
              )}
            </div>

            {testResult && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  background: testResult.success ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}`,
                  color: testResult.success ? '#166534' : '#991b1b',
                }}
              >
                <strong>{testResult.success ? '✓ Success: ' : '✗ Error: '}</strong>
                {testResult.message}
              </div>
            )}

            {seedResult && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                }}
              >
                <strong>✓ Seed Result: </strong>
                {seedResult}
              </div>
            )}

            <div style={{ marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
              <strong>SQL Schema File:</strong> Run <code>database/migrations/202610230001_initial_schema.sql</code> in your Supabase SQL Editor to establish tables, triggers, and Row-Level Security policies.
            </div>
          </div>

          {/* Section 2: Local SQLite Architecture */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f8faf9', border: '1px solid #e3ebe8', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f766e', fontWeight: 700, marginBottom: '6px' }}>
                <Database size={16} />
                <span>Local SQLite Engine</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                <li><strong>Storage:</strong> <code>database/local/careroute.db</code> (Node.js <code>DatabaseSync</code>).</li>
                <li><strong>WAL Mode:</strong> 5000ms concurrency timeout and crash resilience.</li>
                <li><strong>Zero External Config:</strong> Runs completely offline.</li>
              </ul>
            </div>

            <div style={{ background: '#f8faf9', border: '1px solid #e3ebe8', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f766e', fontWeight: 700, marginBottom: '6px' }}>
                <Lock size={16} />
                <span>Security & RBAC Enforcement</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                <li><strong>Cryptographic Sessions:</strong> HMAC-SHA256 Bearer tokens.</li>
                <li><strong>Audit Immutability:</strong> Updates/deletions on audit logs rejected.</li>
                <li><strong>CORS & Rate Limiting:</strong> Enforced against unauthorized origins.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: SQLite Controls */}
          <h3 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px', color: '#334155' }}>
            Local Database Controls
          </h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="outline-button"
              onClick={() => {
                if (window.confirm('Reset local SQLite database to the original 12 fictional records?')) {
                  onReset();
                  close();
                }
              }}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <RefreshCw size={14} /> Restore Initial Synthetic Dataset
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={() => {
                if (window.confirm('WARNING: Purge all local database records? This action cannot be undone.')) {
                  onPurge();
                  close();
                }
              }}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <Trash2 size={14} /> Purge All Local Database Records
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-button" onClick={close}>Done</button>
        </div>
      </section>
    </div>
  );
}
