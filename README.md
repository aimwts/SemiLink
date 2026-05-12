<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SemiLink - Professional Semiconductor Network

A LinkedIn-like platform designed for the semiconductor industry, featuring project collaboration, networking, and AI-powered content generation.

## Quick Start

### Prerequisites
- Node.js 18+
- Netlify account (for deployment)
- Supabase account (for database)
- Google Gemini API key (for AI features)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `API_KEY`: Your Google Gemini API key

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### 🚀 Deploy to Netlify

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.**

Quick summary:
1. Push to GitHub
2. Connect your repo to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

Key environment variables needed:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `API_KEY`

## Features

- 👥 **Professional Networking**: Connect with semiconductor engineers and professionals
- 💼 **Job Board**: Browse and apply for semiconductor industry jobs
- 📝 **Social Feed**: Share posts, insights, and industry updates
- 💬 **Messaging**: Direct messaging with connections
- 🤖 **AI Integration**: Generate industry insights with Google Gemini
- 🔔 **Notifications**: Stay updated with network activity
- 👤 **User Profiles**: Showcase experience and connections

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Deployment**: Netlify

## Project Structure

```
/components     - React components (Login, Feed, Profile, etc.)
/lib            - Utilities (Supabase client, config)
/services       - External services (Gemini API)
/public         - Static assets
```

## Troubleshooting

### App works locally but not on Netlify

This is usually due to missing environment variables. See [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting).

### CORS or authentication errors

Make sure your Supabase URL and anon key are correct in your environment variables.

### Google AI features not working

Verify `API_KEY` is set in your environment variables.
