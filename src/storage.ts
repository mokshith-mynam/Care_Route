import { demoFollowUps, demoPatients, demoReferrals, defaultRules } from './demoData';
import type { FollowUp, Patient, Referral, RuleConfig } from './types';

const KEYS = { patients: 'careroute.patients.v1', followUps: 'careroute.followups.v1', referrals: 'careroute.referrals.v1', rules: 'careroute.rules.v1' } as const;
function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; }
  catch { return fallback; }
}
function write<T>(key: string, value: T): void { localStorage.setItem(key, JSON.stringify(value)); }
export const store = {
  patients: (): Patient[] => read(KEYS.patients, demoPatients),
  followUps: (): FollowUp[] => read(KEYS.followUps, demoFollowUps),
  referrals: (): Referral[] => read(KEYS.referrals, demoReferrals),
  rules: (): RuleConfig => read(KEYS.rules, defaultRules),
  savePatients: (value: Patient[]) => write(KEYS.patients, value),
  saveFollowUps: (value: FollowUp[]) => write(KEYS.followUps, value),
  saveReferrals: (value: Referral[]) => write(KEYS.referrals, value),
  saveRules: (value: RuleConfig) => write(KEYS.rules, value),
  reset: () => Object.values(KEYS).forEach((key) => localStorage.removeItem(key)),
  clearSensitiveCache: () => {
    localStorage.removeItem(KEYS.patients);
    localStorage.removeItem(KEYS.followUps);
    localStorage.removeItem(KEYS.referrals);
    localStorage.removeItem('careroute.offline_queue.v1');
  },
};
