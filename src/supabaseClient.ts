import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'careroute.supabase_url';
const STORAGE_KEY_ANON = 'careroute.supabase_anon_key';
const STORAGE_KEY_MODE = 'careroute.backend_mode'; // 'supabase' | 'sqlite'

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  activeBackend: 'supabase' | 'sqlite';
}

function getStored(key: string, envFallback: string = ''): string {
  try {
    const val = localStorage.getItem(key);
    if (val && val.trim()) return val.trim();
  } catch {
    // Ignore localStorage access restrictions
  }
  return envFallback;
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envAnon = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const url = getStored(STORAGE_KEY_URL, envUrl);
  const anonKey = getStored(STORAGE_KEY_ANON, envAnon);
  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));

  let activeBackend: 'supabase' | 'sqlite' = isConfigured ? 'supabase' : 'sqlite';
  try {
    const storedMode = localStorage.getItem(STORAGE_KEY_MODE);
    if (storedMode === 'sqlite' || storedMode === 'supabase') {
      activeBackend = storedMode;
    }
  } catch {
    // Ignore
  }

  return {
    url,
    anonKey,
    isConfigured,
    activeBackend,
  };
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastAnon = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  if (!cachedClient || lastUrl !== config.url || lastAnon !== config.anonKey) {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUrl = config.url;
    lastAnon = config.anonKey;
  }

  return cachedClient;
}

export function saveSupabaseConfig(url: string, anonKey: string, setAsActive: boolean = true): void {
  try {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
    if (setAsActive) {
      localStorage.setItem(STORAGE_KEY_MODE, 'supabase');
    }
  } catch (err) {
    console.error('Failed to save Supabase config to localStorage:', err);
  }
  cachedClient = null;
}

export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
    localStorage.setItem(STORAGE_KEY_MODE, 'sqlite');
  } catch (err) {
    console.error('Failed to clear Supabase config from localStorage:', err);
  }
  cachedClient = null;
}

export function setBackendMode(mode: 'supabase' | 'sqlite'): void {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  } catch {
    // Ignore
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; details?: unknown }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase URL or Anon Key is missing or invalid.' };
  }

  try {
    const { data, error } = await client.from('facilities').select('id, name, code').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase project! Note: Tables are not yet initialized. Run supabase/migrations/202610230001_initial_schema.sql in your Supabase SQL editor.',
        };
      }
      return { success: false, message: `Supabase Error (${error.code}): ${error.message}` };
    }
    return {
      success: true,
      message: `Connected successfully! Found ${data ? data.length : 0} facility record(s).`,
      details: data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown connection error';
    return { success: false, message: `Connection failed: ${msg}` };
  }
}
