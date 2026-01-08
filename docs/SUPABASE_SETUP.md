# Supabase Database Setup for Trust Your Ears

## Environment Variables for Vercel

Add these to your Vercel project environment variables:

### Required for Prisma/Database
```bash
DATABASE_URL="postgres://postgres.miwdktwuufjkdwvgzdgq:oCzo0tRd6JPb2o9S@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
```

**Important:** Use `POSTGRES_PRISMA_URL` as your `DATABASE_URL` in Vercel. This is the connection pooling URL that Prisma needs.

### Optional (for future Supabase client features)
```bash
NEXT_PUBLIC_SUPABASE_URL="https://miwdktwuufjkdwvgzdgq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pd2RrdHd1dWZqa2R3dmd6ZGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODQyODMsImV4cCI6MjA4MzQ2MDI4M30.qNjDwVsMdoC-KeuUxoa2kfpnGAjJPU4a3JjPTD59O7M"
```

## Setting Up the Database Tables

### Option 1: Via Vercel CLI (Recommended)

1. Install Vercel CLI if you haven't:
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

### Option 2: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run this SQL (or use Prisma migrations):

```sql
-- Create Album table
CREATE TABLE IF NOT EXISTS "Album" (
    "id" TEXT NOT NULL,
    "spotifyAlbumId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" INTEGER,
    "coverUrl" TEXT NOT NULL,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- Create Vote table
CREATE TABLE IF NOT EXISTS "Vote" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "voterHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on spotifyAlbumId
CREATE UNIQUE INDEX IF NOT EXISTS "Album_spotifyAlbumId_key" ON "Album"("spotifyAlbumId");

-- Create indexes
CREATE INDEX IF NOT EXISTS "Album_votesCount_idx" ON "Album"("votesCount");
CREATE INDEX IF NOT EXISTS "Album_spotifyAlbumId_idx" ON "Album"("spotifyAlbumId");
CREATE INDEX IF NOT EXISTS "Vote_albumId_idx" ON "Vote"("albumId");
CREATE INDEX IF NOT EXISTS "Vote_voterHash_idx" ON "Vote"("voterHash");

-- Create unique constraint on albumId + voterHash
CREATE UNIQUE INDEX IF NOT EXISTS "Vote_albumId_voterHash_key" ON "Vote"("albumId", "voterHash");

-- Create foreign key
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Option 3: Local Setup (for testing)

1. Create `.env.local` file:
   ```bash
   DATABASE_URL="postgres://postgres.miwdktwuufjkdwvgzdgq:oCzo0tRd6JPb2o9S@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
   ```

2. Push schema:
   ```bash
   npm run db:push
   ```

3. (Optional) Seed with example data:
   ```bash
   npm run db:seed
   ```

## Verifying Setup

After setting up, you can verify the tables exist:

1. Go to Supabase Dashboard → Table Editor
2. You should see `Album` and `Vote` tables
3. Or use Prisma Studio:
   ```bash
   npm run db:studio
   ```

## Connection Pooling

Supabase provides connection pooling via PgBouncer. The `POSTGRES_PRISMA_URL` uses port `6543` which is the pooled connection. This is recommended for serverless environments like Vercel.

For migrations or schema changes, you might need to use the non-pooling URL (`POSTGRES_URL_NON_POOLING`) temporarily.

## Troubleshooting

### "Connection timeout"
- Check that `DATABASE_URL` is set correctly in Vercel
- Verify the connection string uses port `6543` (pooled) or `5432` (direct)

### "Table does not exist"
- Run `npm run db:push` to create tables
- Or run the SQL script above in Supabase SQL Editor

### "Unique constraint violation"
- This is expected for duplicate votes (feature, not bug)
- Check that indexes are created correctly
