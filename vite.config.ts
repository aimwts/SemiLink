import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Inject Supabase keys provided by user as defaults if env vars are missing
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || 'https://qftpsrjchhcmrvkfawgw.supabase.co'),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdHBzcmpjaGhjbXJ2a2Zhd2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDI2OTAsImV4cCI6MjA4MDg3ODY5MH0.10uZ9xmg_LENCtoharB8BJ-ZvmSV0-JWmVsllDwMTJY'),
    },
    server: {
      port: 3000,
    },
  };
});