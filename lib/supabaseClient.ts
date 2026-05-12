import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseKey, isSupabaseConfigured } from './config';

// Get Supabase credentials
const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseKey();

// Log warning if using fallback credentials
if (!isSupabaseConfigured()) {
  console.warn('⚠️ Using default Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);