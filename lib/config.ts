/**
 * Configuration utility to check if optional services are properly configured
 */

// Get injected environment variables
declare const __VITE_SUPABASE_URL__: string | undefined;
declare const __VITE_SUPABASE_ANON_KEY__: string | undefined;
declare const __API_KEY__: string | undefined;

// Check if custom Supabase configuration is provided (beyond fallback)
export const isSupabaseConfigured = (): boolean => {
  return !!(
    (typeof __VITE_SUPABASE_URL__ !== 'undefined' && __VITE_SUPABASE_URL__) &&
    (typeof __VITE_SUPABASE_ANON_KEY__ !== 'undefined' && __VITE_SUPABASE_ANON_KEY__)
  );
};

// Check if Gemini API is configured
export const isGeminiConfigured = (): boolean => {
  return !!(typeof __API_KEY__ !== 'undefined' && __API_KEY__);
};

// Get Supabase URL (with fallback)
export const getSupabaseUrl = (): string => {
  const fallback = 'https://qftpsrjchhcmrvkfawgw.supabase.co';
  return (typeof __VITE_SUPABASE_URL__ !== 'undefined' && __VITE_SUPABASE_URL__) ? __VITE_SUPABASE_URL__ : fallback;
};

// Get Supabase Anon Key (with fallback)
export const getSupabaseKey = (): string => {
  const fallback = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdHBzcmpjaGhjbXJ2a2Zhd2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDI2OTAsImV4cCI6MjA4MDg3ODY5MH0.10uZ9xmg_LENCtoharB8BJ-ZvmSV0-JWmVsllDwMTJY';
  return (typeof __VITE_SUPABASE_ANON_KEY__ !== 'undefined' && __VITE_SUPABASE_ANON_KEY__) ? __VITE_SUPABASE_ANON_KEY__ : fallback;
};

// Get API Key
export const getApiKey = (): string => {
  return typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : '';
};
