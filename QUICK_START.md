# 🚀 Quick Start: Fix Posts on Netlify

## The Problem
Posts work locally but disappear on Netlify because they're only stored in browser localStorage (cleared on fresh deployment).

## The Solution
I've configured your app to save posts to Supabase database for cloud persistence. Follow these 4 steps:

---

## Step 1️⃣: Create Posts Table in Supabase

1. Go to [supabase.com](https://supabase.com) → Select your **SemiLink** project
2. Go to **SQL Editor** (left sidebar)
3. Open file: `CREATE_POSTS_TABLE.sql` from your project root
4. Copy ALL the SQL code
5. Paste it into Supabase SQL Editor
6. Click **Run** (blue button)

✅ This creates the `posts` table and security rules

---

## Step 2️⃣: Create Storage Buckets

In Supabase dashboard:

1. Go to **Storage** → **Buckets** (left sidebar)
2. Click **New Bucket**
   - Name: `post-images`
   - Visibility: **Public**
   - File types: jpg, jpeg, png, gif, webp
   - Click **Create**

3. Click **New Bucket** again
   - Name: `post-videos`
   - Visibility: **Public**
   - File types: mp4, webm, mov, avi
   - Click **Create**

✅ These buckets will store images/videos (for future enhancement)

---

## Step 3️⃣: Set Environment Variables in Netlify

⚠️ **THIS IS THE CRITICAL STEP!**

1. Go to [netlify.com](https://netlify.com) → Select your **SemiLink** site
2. Go to **Site Settings** (top menu) → **Environment**
3. Click **Edit variables**
4. Add these 3 variables (copy the exact names):

```
VITE_SUPABASE_URL = [your-project].supabase.co
VITE_SUPABASE_ANON_KEY = [your-anon-key]
API_KEY = [your-gemini-api-key]
```

**Where to get these values:**

- **VITE_SUPABASE_URL**: 
  - Supabase → Project Settings → API → Project URL
  - Example: `https://qftpsrjchhcmrvkfawgw.supabase.co`

- **VITE_SUPABASE_ANON_KEY**:
  - Supabase → Project Settings → API → `anon` public key
  - Starts with `sb_publishable_...`

- **API_KEY**:
  - [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
  - Your Google Gemini API key

5. Click **Save**

✅ These variables tell Netlify how to connect to your Supabase database

---

## Step 4️⃣: Deploy

```bash
cd /workspaces/SemiLink
git add .
git commit -m "Add Supabase post persistence - fixes posting on Netlify"
git push origin main
```

Netlify will auto-deploy. Check [Netlify Dashboard](https://netlify.com) → your site → **Deploys** to see progress.

---

## ✅ Test It Works

1. Visit your deployed Netlify site
2. Log in (create new account)
3. Go to **Home** feed
4. Try posting:
   - ✅ Text only
   - ✅ Text + Image
   - ✅ Text + Video
5. Refresh the page - posts should persist!

---

## 🔍 Troubleshooting

### Posts still empty after refresh?
- [ ] Check Netlify environment variables are set (Step 3)
- [ ] Verify variable names are EXACT (case-sensitive)
- [ ] Open browser Console (F12) and look for error messages
- [ ] Try a manual deploy: Netlify Dashboard → **Trigger deploy**

### Allow anonymous posting (optional, not recommended)
- If you want unauthenticated visitors to be able to create posts (only for testing), add a public INSERT policy in Supabase SQL Editor:

```
-- NOT RECOMMENDED: allows anyone to insert
CREATE POLICY "Public insert" ON posts
  FOR INSERT WITH CHECK (true);
```

Use this only for testing — prefer authenticated inserts via `auth.uid()`.

### "Using default Supabase credentials" warning?
- Means environment variables aren't being read
- This is OK for local dev
- On Netlify, should use your real Supabase credentials

### Images/Videos not showing?
- They're stored as base64 for now (embedded in posts)
- This works but may load slowly
- Future: we'll upload to Supabase Storage instead

---

## 📁 Files Changed

- `services/postsService.ts` (NEW) - Handles Supabase post operations
- `components/CreatePost.tsx` - Now saves posts to Supabase
- `App.tsx` - Tries to load posts from Supabase on login
- `CREATE_POSTS_TABLE.sql` (NEW) - Database schema
- `NETLIFY_POSTS_FIX.md` (NEW) - Full documentation

---

## 💡 How It Works

1. **User posts** → Saved to localStorage (instant) + Supabase (background)
2. **Page refreshes** → Try loading from Supabase, fallback to localStorage
3. **New browser/device** → Loads posts from Supabase cloud
4. **Netlify deployment** → Fresh browser gets cloud posts ✅

---

## ❓ Questions?

Check `NETLIFY_POSTS_FIX.md` for detailed documentation.

Good luck! 🎉
