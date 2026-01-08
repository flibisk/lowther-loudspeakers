# Trust Your Ears - Setup Guide

## Overview

"Trust Your Ears" is a community-driven album listening page where users can recommend albums and vote on community favorites. The most-voted album is automatically featured at the top of the page.

## Features

- **Album Search**: Search MusicBrainz for albums (metadata only, no external branding)
- **Cover Art**: Automatically fetches album artwork from Cover Art Archive
- **Voting System**: One vote per user per album (tracked via cookie + IP hash)
- **Featured Album**: Automatically displays the album with the highest vote count
- **Community List**: Shows all albums sorted by vote count
- **Duplicate Prevention**: Prevents users from voting multiple times for the same album

## Tech Stack

- **Database**: PostgreSQL with Prisma ORM
- **Search**: MusicBrainz API (no authentication required)
- **Cover Art**: Cover Art Archive API
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS with Lowther design system

## Environment Variables

Add these to your `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lowther_db?schema=public"

# Site URL (for API calls)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # or your production URL
```

### No API Keys Required!

MusicBrainz and Cover Art Archive are free, open-source services that don't require authentication. However, MusicBrainz requires a proper User-Agent header (already configured in the code).

## Database Setup

### 1. Initialize Prisma

```bash
npm run db:generate
```

### 2. Create Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb lowther_db

# Push schema
npm run db:push
```

**Option B: Vercel Postgres**
1. Go to Vercel Dashboard → Your Project → Storage
2. Create a Postgres database
3. Copy the `DATABASE_URL` from the connection string
4. Add it to your `.env` file
5. Run `npm run db:push`

**Option C: Supabase**
1. Create a new Supabase project
2. Copy the connection string from Settings → Database
3. Add it to your `.env` file
4. Run `npm run db:push`

### 3. Seed Database (Optional)

```bash
npm run db:seed
```

This will add example albums and votes for testing.

## Database Schema

### Album Model
```prisma
model Album {
  id                        String   @id @default(uuid())
  musicBrainzReleaseGroupId String   @unique
  title                     String
  artist                    String
  year                      Int?
  coverUrl                  String?
  votesCount                Int      @default(0)
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
  votes                     Vote[]
}
```

### Vote Model
```prisma
model Vote {
  id        String   @id @default(uuid())
  albumId   String
  voterHash String   // Hash of cookie ID + IP address
  createdAt DateTime @default(now())
  album     Album    @relation(...)
  
  @@unique([albumId, voterHash])
}
```

## API Routes

### `GET /api/musicbrainz/search-albums?q={query}`
Searches MusicBrainz for albums matching the query.

**Response:**
```json
{
  "albums": [
    {
      "musicBrainzReleaseGroupId": "e8c24e3e-7b83-3d6a-9c83-3d6a9c83e8c2",
      "title": "Kind of Blue",
      "artist": "Miles Davis",
      "year": 1959,
      "coverUrl": "https://coverartarchive.org/..." // or placeholder URL
    }
  ]
}
```

### `POST /api/trust-your-ears/vote`
Submits a vote for an album. If the album doesn't exist, it creates it first.

**Request:**
```json
{
  "musicBrainzReleaseGroupId": "e8c24e3e-7b83-3d6a-9c83-3d6a9c83e8c2",
  "cookieId": "optional-client-cookie-id"
}
```

**Response:**
```json
{
  "success": true,
  "album": { ... },
  "message": "Vote recorded!"
}
```

### `GET /api/trust-your-ears/albums`
Gets all albums sorted by vote count.

**Response:**
```json
{
  "albums": [ ... ]
}
```

### `GET /api/trust-your-ears/featured`
Gets the featured album (highest vote count).

**Response:**
```json
{
  "album": { ... } // or null if no albums exist
}
```

## Pages

### `/trust-your-ears`
Main page displaying:
- Featured album section (current community listen)
- "Recommend an Album" button
- Community album list (sorted by votes)

### `/trust-your-ears/add`
Album search and selection page:
- Search input for Spotify albums
- Grid of search results
- Click to select/vote on an album

## Voting Logic

1. **User Identification**: 
   - Server generates a cookie ID (`trust-your-ears-voter-id`)
   - Client IP address is captured
   - Voter hash = SHA256(cookieId + IP address)

2. **Duplicate Prevention**:
   - Unique constraint on `[albumId, voterHash]`
   - Prevents same user from voting twice for the same album

3. **Rate Limiting**:
   - Basic rate limiting via cookie + IP tracking
   - Can be enhanced with Redis or similar for production

## Featured Album Logic

- Featured album = album with highest `votesCount`
- If there's a tie, the album that reached that count first wins (earliest `createdAt`)
- Updates automatically on page refresh (no manual curation)

## Development

### Run Prisma Studio
```bash
npm run db:studio
```

Opens a GUI to view and edit database records.

### Create Migration
```bash
npm run db:migrate
```

Creates a new migration file for schema changes.

### Generate Prisma Client
```bash
npm run db:generate
```

Regenerates Prisma Client after schema changes.

## Production Deployment

### Vercel

1. **Set Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

2. **Database Migrations**:
   ```bash
   # Run migrations before deploying
   npm run db:push
   ```

3. **Build**:
   ```bash
   npm run build
   ```

### Database Connection Pooling

For production, consider using:
- **Prisma Accelerate** (recommended for Vercel)
- **PgBouncer** (connection pooling)
- **Supabase Connection Pooler**

## Troubleshooting

### "Spotify token request failed"
- Check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set correctly
- Verify Spotify app is active in Spotify Developer Dashboard

### "Failed to connect to database"
- Verify `DATABASE_URL` is correct
- Check database is accessible from your network
- For Vercel Postgres, ensure IP allowlist includes Vercel IPs

### "You have already voted for this album"
- This is expected behavior (duplicate prevention)
- Clear cookies/localStorage to test voting again
- In production, this prevents vote manipulation

### Featured album not updating
- Check database for albums with `votesCount > 0`
- Verify `/api/trust-your-ears/featured` returns correct data
- Clear Next.js cache if using ISR

## Future Enhancements

- User accounts (replace anonymous voting)
- Comments on albums
- Album nomination notes
- Pressing details (vinyl, CD, etc.)
- Advanced filtering and sorting
- Album recommendations based on votes

## Support

For issues or questions, check:
- Prisma docs: https://www.prisma.io/docs
- Spotify Web API: https://developer.spotify.com/documentation/web-api
- Next.js docs: https://nextjs.org/docs
