import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate or retrieve a unique session ID for this device/browser
export function getSessionId(): string {
  const storageKey = 'field_reports_session_id';
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    sessionId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}
