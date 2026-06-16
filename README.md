# BloodConnect Platform

A production-ready, local-first blood donation platform built with Next.js, Tailwind CSS, and Supabase.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Actions
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth

## Getting Started

### 1. Database Setup
1. Create a free account and project at [Supabase](https://supabase.com/).
2. Go to the SQL Editor in your Supabase dashboard.
3. Copy the contents of `database.sql` and run it to create the `donors` table and RLS policies.

### 2. Environment Variables
Create a `.env.local` file in the root of the project:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. In the environment variables section, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Click **Deploy**. Vercel will automatically build and host your Next.js application.

## Scaling Up
- **PostGIS / Geolocation**: For advanced distance matching when you expand to a whole country, you can enable the `PostGIS` extension in Supabase and change latitude/longitude to a `GEOGRAPHY` column to run highly optimized `ST_DWithin` queries.
- **SMS Integration**: You can integrate Twilio or local SMS providers later for immediate notifications to donors when a match is found.
