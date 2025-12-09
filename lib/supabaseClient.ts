/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Safely retrieve environment variables to prevent crashes if import.meta.env is undefined
const getEnvVar = (key: string, fallback: string) => {
  try {
    // Try import.meta.env first (Vite standard)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    // Try process.env (injected via vite.config.ts define)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    console.warn(`Error accessing env var ${key}`, e);
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://qftpsrjchhcmrvkfawgw.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdHBzcmpjaGhjbXJ2a2Zhd2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDI2OTAsImV4cCI6MjA4MDg3ODY5MH0.10uZ9xmg_LENCtoharB8BJ-ZvmSV0-JWmVsllDwMTJY');

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);