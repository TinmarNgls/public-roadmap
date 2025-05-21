
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use the Supabase project credentials
const supabaseUrl = "https://dhcgcgovgjxsgmtkimye.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2djZ292Z2p4c2dtdGtpbXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTYwODUsImV4cCI6MjA2MzMzMjA4NX0.ec8oTIO_9X4veDY8kLI2A-8Cnnhm3JtTWo8MKz4E4HU";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Log connection status in development
if (import.meta.env.DEV) {
  console.info('✅ Supabase client initialized with project credentials');
}
