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
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EMAIL_USER=
EMAIL_APP_PASSWORD=
```

For email account to work: set up 2-factor authentication, go to mangage passwords, generate app pasword.

## Deployment
Automatic via Vercel (when connected to GitHub).
Preview URLs on each PR.  
Production URL → https://lasc.vercel.app (TBD)

## Team
- Ha
- Huy  
- William 