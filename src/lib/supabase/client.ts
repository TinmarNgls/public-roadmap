
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Try to get environment variables, otherwise use development fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// For development, if no credentials are available, use a mock client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Log a helpful message in development instead of error
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Using placeholder Supabase credentials. For real data, configure your .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}
