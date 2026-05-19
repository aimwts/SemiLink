import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  const rawEnv = loadEnv(mode, '.', '');
  const apiKey = rawEnv.API_KEY || env.VITE_API_KEY || '';
  
  return {
    plugins: [react()],
    define: {
      // Only define if env vars are explicitly provided
      // Fallbacks to empty strings - supabaseClient.ts handles defaults
      __VITE_SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL || ''),
      __VITE_SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      __API_KEY__: JSON.stringify(apiKey),
    },
    server: {
      port: 3000,
    },
  };
});