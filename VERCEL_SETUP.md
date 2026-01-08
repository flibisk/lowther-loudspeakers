# Vercel Setup for Trust Your Ears

## Step 1: Add Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

### Required Variables:

1. **DATABASE_URL** (for Prisma)
   ```
   postgres://postgres.miwdktwuufjkdwvgzdgq:oCzo0tRd6JPb2o9S@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
   ```

2. **NEXT_PUBLIC_SITE_URL** (your production URL)
   ```
   https://www.lowtherloudspeakers.com
   ```

**Important:** Set these for **Production**, **Preview**, and **Development** environments.

**Note:** No Spotify API keys needed! MusicBrainz and Cover Art Archive are free and don't require authentication.

## Step 2: Create Database Tables

After deploying with the DATABASE_URL set, you have two options:

### Option A: Use Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Push database schema:
   ```bash
   npm run db:push
   ```

### Option B: Use Supabase SQL Editor

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL script from `docs/SUPABASE_SETUP.md`

## Step 3: Verify Setup

After deployment:
1. Visit `/trust-your-ears` - should load (may show empty state)
2. Visit `/trust-your-ears/add` - should allow searching
3. Try adding an album - should work if tables exist

## Note: We Don't Need Supabase Client

We're using **Prisma** to connect directly to PostgreSQL. You don't need to:
- Install `@supabase/supabase-js`
- Create Supabase client utilities
- Use Supabase client methods

Prisma handles all database operations directly.
