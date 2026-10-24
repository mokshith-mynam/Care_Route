import type {
  AnalyticsSummary,
  AuditEvent,
  CaregiverConsent,
  FollowUp,
  NewPatientFormData,
  Patient,
  Referral,
  RuleConfig,
  ScreeningObservation,
  UserRole,
} from './types';
import { getSupabaseConfig } from './supabaseClient';
import { supabaseService } from './supabaseService';

const OFFLINE_QUEUE_KEY = 'careroute.offline_queue.v1';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface OfflineAction {
  id: string;
  endpoint: string;
  method: string;
  body: unknown;
  timestamp: string;
  description: string;
}

class ApiClient {
  private currentRole: UserRole = 'Health worker';
  private currentUserId: string = 'HW-01';
  private sessionToken: string | null = null;
  private isOfflineSimulated: boolean = false;

  setRole(role: UserRole) {
    this.currentRole = role;
    if (role === 'Supervisor') this.currentUserId = 'SUP-01';
    else if (role === 'Clinical reviewer') this.currentUserId = 'CR-01';
    else if (role === 'Administrator') this.currentUserId = 'ADM-01';
    else this.currentUserId = 'HW-01';
    this.sessionToken = null;
  }

  getRole(): UserRole {
    return this.currentRole;
  }

  getUserId(): string {
    return this.currentUserId;
  }

  setOfflineSimulation(enabled: boolean) {
    this.isOfflineSimulated = enabled;
  }

  getOfflineSimulation(): boolean {
    return this.isOfflineSimulated;
  }

  async authenticateSession(): Promise<string> {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: this.currentRole, userId: this.currentUserId }),
      });
      if (res.ok) {
        const data = (await res.json()) as { token: string };
        this.sessionToken = data.token;
        return data.token;
      }
    } catch {
      // Offline fallback
    }
    return '';
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-CareRoute-Role': this.currentRole,
      'X-CareRoute-User': this.currentUserId,
    };
    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const method = (options.method || 'GET').toUpperCase();

    // Check if offline mode is simulated or active
    if (this.isOfflineSimulated && method !== 'GET') {
      const offlineAction: OfflineAction = {
        id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        endpoint,
        method,
        body: options.body ? JSON.parse(options.body as string) : null,
        timestamp: new Date().toISOString(),
        description: `${method} ${endpoint}`,
      };
      this.enqueueOfflineAction(offlineAction);
      return {
        _isOfflineQueued: true,
        message: 'Action saved to offline queue. Will sync when reconnected.',
      } as unknown as T;
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {}),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = typeof data.error === 'string' ? data.error : `HTTP ${response.status}: Request failed`;
        throw new ApiError(errorMsg, response.status, data);
      }

      return data as T;
    } catch (err: unknown) {
      if (method !== 'GET' && !this.isOfflineSimulated) {
        // Network failure, queue offline action
        const offlineAction: OfflineAction = {
          id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          endpoint,
          method,
          body: options.body ? JSON.parse(options.body as string) : null,
          timestamp: new Date().toISOString(),
          description: `${method} ${endpoint} (queued after connection failure)`,
        };
        this.enqueueOfflineAction(offlineAction);
      }
      throw err;
    }
  }

  // ----------------- Offline Queue Management -----------------
  getOfflineQueue(): OfflineAction[] {
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return raw ? (JSON.parse(raw) as OfflineAction[]) : [];
    } catch {
      return [];
    }
  }

  private enqueueOfflineAction(action: OfflineAction) {
    const queue = this.getOfflineQueue();
    queue.push(action);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  }

  async syncOfflineQueue(): Promise<{ syncedCount: number; errors: Array<{ action: OfflineAction; error: string }> }> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return { syncedCount: 0, errors: [] };

    const errors: Array<{ action: OfflineAction; error: string }> = [];
    let syncedCount = 0;
    const remaining: OfflineAction[] = [];

    for (const action of queue) {
      try {
        const res = await fetch(action.endpoint, {
          method: action.method,
          headers: this.getHeaders(),
          body: action.body ? JSON.stringify(action.body) : undefined,
        });
        if (res.ok) {
          syncedCount++;
        } else {
          const data = await res.json().catch(() => ({}));
          const errMsg = typeof data.error === 'string' ? data.error : `Status ${res.status}`;
          errors.push({ action, error: errMsg });
          remaining.push(action);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown network failure';
        errors.push({ action, error: msg });
        remaining.push(action);
      }
    }

    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    return { syncedCount, errors };
  }

  clearOfflineQueue() {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  }

  isSupabaseActive(): boolean {
    const config = getSupabaseConfig();
    return config.isConfigured && config.activeBackend === 'supabase';
  }

  // ----------------- API Methods -----------------
  async getHealth() {
    if (this.isSupabaseActive()) {
      const config = getSupabaseConfig();
      return {
        status: 'ok',
        engine: 'Supabase Cloud (PostgreSQL with Row-Level Security)',
        storagePath: config.url,
        records: { patients: 0, followUps: 0, referrals: 0 },
        safetyNotice: 'Administrative coordination prototype. Synthetic data only. Powered by Supabase Cloud.',
        activeActor: { role: this.currentRole, userId: this.currentUserId },
      };
    }
    return this.request<{
      status: string;
      engine: string;
      storagePath: string;
      records: { patients: number; followUps: number; referrals: number };
      safetyNotice: string;
      activeActor: { role: string; userId: string };
    }>('/api/health');
  }

  async getPatients(query: string = '', facility: string = ''): Promise<Patient[]> {
    if (this.isSupabaseActive()) {
      try {
        const spData = await supabaseService.getPatients();
        let filtered = spData;
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter((p) => `${p.id} ${p.displayName} ${p.facility}`.toLowerCase().includes(q));
        }
        if (facility) {
          filtered = filtered.filter((p) => p.facility === facility);
        }
        return filtered;
      } catch (err) {
        console.warn('Supabase getPatients failed:', err);
        throw err;
      }
    }

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (facility) params.set('facility', facility);
    const qs = params.toString();
    return this.request<Patient[]>(`/api/patients${qs ? `?${qs}` : ''}`);
  }

  async getPatientById(id: string): Promise<Patient & { observations: ScreeningObservation[]; followUps: FollowUp[]; referrals: Referral[]; auditEvents: AuditEvent[] }> {
    return this.request(`/api/patients/${encodeURIComponent(id)}`);
  }

  async createPatient(patient: Partial<Patient> | NewPatientFormData): Promise<Patient> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.createPatient(patient, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase createPatient failed:', err);
        throw err;
      }
    }
    return this.request<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async addObservation(patientId: string, data: { screeningType: string; observationNotes: string }): Promise<ScreeningObservation> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.addObservation(patientId, data, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase addObservation failed:', err);
        throw err;
      }
    }
    return this.request<ScreeningObservation>(`/api/patients/${encodeURIComponent(patientId)}/observations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConsent(patientId: string, consent: Partial<CaregiverConsent>): Promise<CaregiverConsent> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.updateConsent(patientId, consent, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase updateConsent failed:', err);
        throw err;
      }
    }
    return this.request<CaregiverConsent>(`/api/patients/${encodeURIComponent(patientId)}/consent`, {
      method: 'POST',
      body: JSON.stringify(consent),
    });
  }

  async getFollowUps(status?: string, worker?: string): Promise<FollowUp[]> {
    if (this.isSupabaseActive()) {
      try {
        const spData = await supabaseService.getFollowUps();
        let filtered = spData;
        if (status) filtered = filtered.filter((f) => f.status === status);
        if (worker) filtered = filtered.filter((f) => f.assignedWorker === worker);
        return filtered;
      } catch (err) {
        console.warn('Supabase getFollowUps failed:', err);
        throw err;
      }
    }
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (worker) params.set('worker', worker);
    const qs = params.toString();
    return this.request<FollowUp[]>(`/api/follow-ups${qs ? `?${qs}` : ''}`);
  }

  async createFollowUp(followUp: Partial<FollowUp>): Promise<FollowUp> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.createFollowUp(followUp, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase createFollowUp failed:', err);
        throw err;
      }
    }
    return this.request<FollowUp>('/api/follow-ups', {
      method: 'POST',
      body: JSON.stringify(followUp),
    });
  }

  async updateFollowUp(id: string, updates: Partial<FollowUp>): Promise<FollowUp> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.updateFollowUp(id, updates, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase updateFollowUp failed:', err);
        throw err;
      }
    }
    return this.request<FollowUp>(`/api/follow-ups/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getReferrals(status?: string): Promise<Referral[]> {
    if (this.isSupabaseActive()) {
      try {
        const spData = await supabaseService.getReferrals();
        let filtered = spData;
        if (status) filtered = filtered.filter((r) => r.status === status);
        return filtered;
      } catch (err) {
        console.warn('Supabase getReferrals failed:', err);
        throw err;
      }
    }
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    const qs = params.toString();
    return this.request<Referral[]>(`/api/referrals${qs ? `?${qs}` : ''}`);
  }

  async createReferral(referral: Partial<Referral>): Promise<Referral> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.createReferral(referral, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase createReferral failed:', err);
        throw err;
      }
    }
    return this.request<Referral>('/api/referrals', {
      method: 'POST',
      body: JSON.stringify(referral),
    });
  }

  async updateReferral(id: string, updates: Partial<Referral> & { note?: string }): Promise<Referral> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.updateReferral(id, updates, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase updateReferral failed:', err);
        throw err;
      }
    }
    return this.request<Referral>(`/api/referrals/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getRules(): Promise<RuleConfig> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.getRules();
      } catch (err) {
        console.warn('Supabase getRules failed:', err);
        throw err;
      }
    }
    return this.request<RuleConfig>('/api/rules');
  }

  async updateRules(rules: Partial<RuleConfig>): Promise<RuleConfig> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.updateRules(rules, { role: this.currentRole, userId: this.currentUserId });
      } catch (err) {
        console.warn('Supabase updateRules failed:', err);
        throw err;
      }
    }
    return this.request<RuleConfig>('/api/rules', {
      method: 'PUT',
      body: JSON.stringify(rules),
    });
  }

  async getAnalytics(today: string = '2026-10-23'): Promise<AnalyticsSummary> {
    return this.request<AnalyticsSummary>(`/api/analytics?today=${encodeURIComponent(today)}`);
  }

  async getTimeline(limit: number = 100): Promise<AuditEvent[]> {
    if (this.isSupabaseActive()) {
      try {
        return await supabaseService.getTimeline(limit);
      } catch (err) {
        console.warn('Supabase getTimeline failed:', err);
        throw err;
      }
    }
    return this.request<AuditEvent[]>(`/api/timeline?limit=${limit}`);
  }

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/reset', {
      method: 'POST',
    });
  }

  async purgeDatabase(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/delete-data', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
