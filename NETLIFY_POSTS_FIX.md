# Fix: Posts Not Persisting on Netlify Deployment

## Problem
After login on Netlify, users can't see or create posts. This works locally because posts are stored in browser localStorage, which is cleared on a new deployment.

## Root Cause
- Posts are stored ONLY in browser localStorage
- No persistence to Supabase database
- Images/videos are base64 data URLs (not uploaded to storage)
- Fresh browser session on Netlify = empty localStorage

## Solution Overview
We've added Supabase database persistence for posts. Follow these steps:

## Step 1: Create Posts Table in Supabase

### Option A: Via Supabase Dashboard (Recommended)
1. Go to [supabase.com](https://supabase.com) and log in
2. Select your **SemiLink** project
3. Go to **SQL Editor**
4. Copy-paste the SQL from `CREATE_POSTS_TABLE.sql` in your project root
5. Click **Run**

### Option B: Via CLI
```bash
supabase db push
```

## Step 2: Create Storage Buckets

In your Supabase dashboard:

1. Go to **Storage → Buckets**
2. Click **New Bucket**
3. Create bucket named: `post-images`
   - Visibility: Public
   - Allowed file types: jpg, jpeg, png, gif, webp
4. Click **New Bucket** again
5. Create bucket named: `post-videos`
   - Visibility: Public
   - Allowed file types: mp4, webm, mov, avi

## Step 3: Set Environment Variables in Netlify

⚠️ **CRITICAL**: Your environment variables must be set in Netlify dashboard!

1. Go to [netlify.com](https://netlify.com) and log in
2. Select your **SemiLink** site
3. Go to **Site Settings → Environment**
4. Click **Edit variables**
5. Add these 3 environment variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
API_KEY = your-gemini-api-key
```

**Get your credentials:**
- **VITE_SUPABASE_URL**: Supabase → Project Settings → API → Project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase → Project Settings → API → anon public key
- **API_KEY**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## Step 4: Deploy

Once environment variables are set:

```bash
git add .
git commit -m "Add Supabase post persistence"
git push origin main
```

Netlify will auto-deploy. You can also manually trigger:
1. Netlify Dashboard → **Trigger deploy → Deploy site**

## Step 5: Test

1. Visit your deployed site
2. Log in (create new account or use existing)
3. Complete profile setup (if prompted)
4. Go to **Home** feed
5. Try posting:
   - ✅ Text post
   - ✅ Text + Image
   - ✅ Text + Video

## How It Works Now

### Locally (Development)
- Posts saved to **localStorage** (browser storage)
- Posts also saved to **Supabase database** if configured
- Fallback: if Supabase fails, localStorage keeps working

### On Netlify (Production)
- User logs in → fetches profile from Supabase
- Posts are loaded from **Supabase database**
- New posts saved to **Supabase database**
- Works across browsers/devices because it's in the cloud

## Troubleshooting

### Posts still disappearing after refresh
- [ ] Check Netlify environment variables are set
- [ ] Go to Netlify → Site Settings → Environment → verify 3 variables present
- [ ] Trigger a new deploy after setting variables
- [ ] Check browser Console (F12) for Supabase errors

### "Using default Supabase credentials" warning
- This means your env variables aren't being read
- Verify variables in Netlify dashboard
- Check that variable names are EXACT (case-sensitive):
  - `VITE_SUPABASE_URL` ✓
  - `VITE_SUPABASE_ANON_KEY` ✓
  - `API_KEY` ✓

### Images/Videos not appearing
- For now, they're embedded as base64 in the database
- They'll appear but may load slowly
- For production: upload images to Supabase Storage instead

## Files Changed

1. **`services/postsService.ts`** (NEW)
   - `savePost()` - Save post to Supabase
   - `uploadPostImage()` - Upload image to storage
   - `uploadPostVideo()` - Upload video to storage

2. **`components/CreatePost.tsx`**
   - Updated to call `savePost()` when creating posts
   - Posts now save to Supabase if configured

3. **`CREATE_POSTS_TABLE.sql`** (NEW)
   - SQL to create posts table and storage buckets

## What's Next (Optional Improvements)

- [ ] Upload images/videos separately to Supabase Storage (instead of base64)
- [ ] Sync old localStorage posts to Supabase
- [ ] Add offline support with service workers
- [ ] Implement post editing/deletion from Supabase
- [ ] Add real-time post updates with Supabase subscriptions
