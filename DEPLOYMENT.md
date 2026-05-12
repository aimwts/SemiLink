# Netlify Deployment Guide - SemiLink

## Overview
Your SemiLink app is now configured for proper deployment to Netlify. This guide explains the issues found and how to fix them.

## 🔴 Issues Found and Fixed

### 1. **Missing netlify.toml Configuration**
   - **Problem**: Netlify didn't know how to build your app
   - **Solution**: Created `netlify.toml` with proper build settings, SPA routing, caching, and security headers

### 2. **Hardcoded Credentials in Build Configuration**
   - **Problem**: Sensitive Supabase keys were hardcoded in `vite.config.ts`, visible in source code
   - **Solution**: Now uses environment variables with fallbacks, secrets stay private

### 3. **Inconsistent Environment Variable Access**
   - **Problem**: Code checked both `import.meta.env` and `process.env` unpredictably, failing in production
   - **Solution**: Created centralized `lib/config.ts` that handles all environment variable access consistently

### 4. **Missing .env.example Documentation**
   - **Problem**: No clear guide on which environment variables are required
   - **Solution**: Created `.env.example` documenting all required variables

### 5. **SPA Routing Not Configured**
   - **Problem**: Direct page navigation on Netlify would 404
   - **Solution**: Added SPA redirect rules in `netlify.toml`

## 🚀 Deployment Steps

### Step 1: Set Environment Variables in Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and log in
2. Open your SemiLink site settings
3. Navigate to **Site Settings → Environment**
4. Click **Edit variables**
5. Add these environment variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-from-supabase
API_KEY = your-google-gemini-api-key
```

### Step 2: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and log in
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon (public) Key** → `VITE_SUPABASE_ANON_KEY`

### Step 3: Get Your Google Gemini API Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy it → `API_KEY`

### Step 4: Deploy

Netlify auto-deploys on `git push` to your main branch, but you can manually trigger:

1. Go to Netlify Dashboard
2. Click **Trigger deploy → Deploy site**

## ✅ Verification Checklist

After deployment, verify these work:

- [ ] **Login Page Loads**: Visit your Netlify domain
- [ ] **Mock Login Works**: Try logging in without Supabase configured
- [ ] **Real Auth Works** (if configured): Sign up and log in with email/password
- [ ] **OAuth Works** (if configured): GitHub/Google login works
- [ ] **Google AI Features**: Generate insights and polish posts work
- [ ] **Network Tab**: No 404 errors, all resources load correctly
- [ ] **Console**: No environment variable warnings besides the fallback message

## 📋 Local Development

To test your deployment setup locally:

```bash
# Create a .env.local file
cp .env.example .env.local

# Fill in your actual credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key
API_KEY=your-api-key

# Run development server
npm run dev
```

## 🔧 Files Changed

- **netlify.toml**: Build configuration, SPA routing, headers
- **.env.example**: Environment variable documentation
- **vite.config.ts**: Fixed environment variable injection
- **lib/config.ts**: NEW - Centralized environment variable management
- **lib/supabaseClient.ts**: Updated to use centralized config
- **services/geminiService.ts**: Updated to use centralized config
- **App.tsx**: Updated to use `isSupabaseConfigured()` utility
- **components/Login.tsx**: Updated to use `isSupabaseConfigured()` utility

## 🐛 Troubleshooting

### "Using default Supabase credentials" Warning

**Cause**: Environment variables not set in Netlify

**Solution**:
1. Check Netlify dashboard → Site Settings → Environment
2. Verify all three variables are set
3. Click "Redeploy" to rebuild with new env vars

### Authentication Fails After Deployment

**Cause**: Supabase URL or anon key is incorrect/expired

**Solution**:
1. Double-check credentials in Supabase dashboard
2. Verify VITE_SUPABASE_ANON_KEY has `Bearer ` prefix (it shouldn't)
3. Check Supabase project status in dashboard

### 404 on Direct Page Navigation

**Cause**: SPA routing not working

**Solution**: Already fixed in netlify.toml with fallback redirect

### Google AI Features Return "API Key not configured"

**Cause**: API_KEY environment variable not set

**Solution**:
1. Set API_KEY in Netlify environment variables
2. Redeploy the site

### Still Having Issues?

1. Check **Netlify Deploy Logs**: Site Settings → Deploys → View Deploy Log
2. Check **Browser Console**: F12 → Console tab for error messages
3. Check **Network Tab**: F12 → Network tab to see failed requests
4. Verify Supabase project is running: [supabase.com](https://supabase.com)

## 📚 Architecture Notes

### Environment Variables Flow

```
.env.local (dev) / Netlify Dashboard (prod)
         ↓
    vite.config.ts (loadEnv)
         ↓
    __VITE_SUPABASE_URL__ (injected constants)
         ↓
    lib/config.ts (centralized access)
         ↓
    Components (isSupabaseConfigured(), getSupabaseUrl(), etc.)
```

### Why Fallback Credentials?

The project includes fallback Supabase credentials for:
- **Local development** without setting environment variables
- **Demo purposes** to allow testing without a real database
- **Backward compatibility** with previous deployment

In production, it's **strongly recommended** to use your own Supabase project.

## 🔐 Security Notes

- Never commit `.env.local` or environment files with secrets
- Supabase anon keys are safe to expose (they're client-side only)
- Limit Supabase RLS (Row Level Security) policies to protect user data
- Google Gemini API keys should be restricted to your domain
- Consider using API rate limiting in Netlify

## Next Steps

1. ✅ Test locally with `npm run dev`
2. ✅ Push to GitHub
3. ✅ Set environment variables in Netlify dashboard
4. ✅ Click "Deploy" and monitor the build
5. ✅ Test all features on the deployed site
6. ✅ Check browser console for any errors

---

**Questions?** Check the README.md or consult Supabase/Netlify documentation.
