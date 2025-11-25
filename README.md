# Littlestown Area Senior Center Website

> Next.js + Tailwind + Supabase + Vercel (all free-tier)

## Overview
A modern, accessible website for the Littlestown Area Senior Center, built as part of our capstone project.
Features include event listings, photo gallery, resource library, RSVP form, and admin dashboard.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS  
- **Backend:** Supabase (DB + Auth + Storage)  
- **Hosting:** Vercel (free tier)  
- **Version Control:** GitHub Project Board + PR workflow  

## Local Setup
```bash
git clone git@github.com:1232145/LASC-Website.git
cd LASC-Website
npm install
cp .env.example .env.local
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000).

## Branch Workflow
- `main` → production  
- `feat/*` → feature branches  
- `fix/*` → bug fixes  
- `docs/*` → documentation  

When finished:
```bash
git add .
git commit -m "feat(fe-01): implement global layout"
git push origin feat/fe-01-global-layout
# open PR and link issue
```

## Environment Variables
Copy from `.env.example` to `.env.local` and fill with real Supabase keys and email account information:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations in API routes)
- `EMAIL_USER` - Your Gmail address for sending emails
- `EMAIL_APP_PASSWORD` - Your Gmail app password (not your regular password)

**Optional:**
- `NEXT_PUBLIC_SITE_URL` - Your site URL (defaults to `http://localhost:3000`). Used for password reset links.

**Getting Supabase Keys:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

**Setting up Gmail App Password:**
1. Enable 2-factor authentication on your Google account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Use this password (not your regular Gmail password) for `EMAIL_APP_PASSWORD`

## Deployment
Automatic via Vercel (when connected to GitHub).
Preview URLs on each PR.  
Production URL → https://lasc.vercel.app (TBD)

## Team
- Ha
- Huy  
- William 