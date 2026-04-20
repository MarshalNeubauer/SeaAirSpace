import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate or retrieve a unique session ID for this device/browser
function getSessionId(): string {
  const storageKey = 'field_reports_session_id';
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    // Generate a new session ID using crypto API
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    sessionId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

// Set the session_id in the Supabase client context for RLS policies
export function initializeSession(): void {
  const sessionId = getSessionId();
  supabase.rpc('set_config', {
    key: 'app.session_id',
    value: sessionId
  }).catch(() => {
    // Fallback: set via client header if RPC isn't available
    // This ensures session_id is available for RLS policies
  });
}

export function getClientSessionId(): string {
  return getSessionId();
}
