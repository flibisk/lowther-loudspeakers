# Trust Your Ears - Feature Summary

## ✅ Implementation Complete

The "Trust Your Ears" feature has been fully implemented and is ready for setup.

## Quick Start

1. **Set Environment Variables** (`.env`):
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/lowther_db"
   SPOTIFY_CLIENT_ID="your_spotify_client_id"
   SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

2. **Setup Database**:
   ```bash
   npm run db:generate  # Generate Prisma Client
   npm run db:push      # Push schema to database
   npm run db:seed      # Seed with example data (optional)
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Visit**:
   - Main page: `http://localhost:3000/trust-your-ears`
   - Add album: `http://localhost:3000/trust-your-ears/add`

## Files Created

### Database & Schema
- `prisma/schema.prisma` - Database schema (Album, Vote models)
- `src/lib/db/prisma.ts` - Prisma client singleton
- `scripts/seed-trust-your-ears.ts` - Seed script with example albums

### Spotify Integration
- `src/lib/spotify/client.ts` - Spotify API client (search, get album)

### Voting System
- `src/lib/trust-your-ears/voting.ts` - Vote tracking utilities (cookie + IP hash)

### API Routes
- `src/app/api/spotify/search-albums/route.ts` - Search Spotify albums
- `src/app/api/trust-your-ears/vote/route.ts` - Submit vote/create album
- `src/app/api/trust-your-ears/albums/route.ts` - Get all albums
- `src/app/api/trust-your-ears/featured/route.ts` - Get featured album

### Pages
- `src/app/trust-your-ears/page.tsx` - Main page with featured album and list
- `src/app/trust-your-ears/add/page.tsx` - Add/vote on album page

### Components
- `src/components/trust-your-ears/featured-album.tsx` - Featured album display
- `src/components/trust-your-ears/album-list.tsx` - Community album grid
- `src/components/trust-your-ears/vote-button.tsx` - Vote button component

### Documentation
- `docs/TRUST_YOUR_EARS_SETUP.md` - Complete setup guide

## Key Features

✅ **Album Search** - Search Spotify for albums (metadata only, no branding)  
✅ **Voting System** - One vote per user per album (cookie + IP hash)  
✅ **Featured Album** - Automatically displays highest-voted album  
✅ **Duplicate Prevention** - Prevents multiple votes from same user  
✅ **Community List** - All albums sorted by vote count  
✅ **Error Handling** - Clear error messages for failed searches/votes  
✅ **Mobile Responsive** - Works on all screen sizes  

## Database Models

### Album
- `id` (UUID)
- `spotifyAlbumId` (unique)
- `title`, `artist`, `year`, `coverUrl`
- `votesCount` (default: 0)
- `createdAt`, `updatedAt`

### Vote
- `id` (UUID)
- `albumId` (FK to Album)
- `voterHash` (cookie + IP hash)
- `createdAt`
- Unique constraint on `[albumId, voterHash]`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/spotify/search-albums?q={query}` | Search Spotify albums |
| POST | `/api/trust-your-ears/vote` | Vote on/create album |
| GET | `/api/trust-your-ears/albums` | Get all albums |
| GET | `/api/trust-your-ears/featured` | Get featured album |

## Environment Variables Required

```bash
DATABASE_URL              # PostgreSQL connection string
SPOTIFY_CLIENT_ID         # Spotify API client ID
SPOTIFY_CLIENT_SECRET     # Spotify API client secret
NEXT_PUBLIC_SITE_URL      # Site URL for API calls
```

## Next Steps

1. **Get Spotify Credentials**:
   - Go to https://developer.spotify.com/dashboard
   - Create a new app
   - Copy Client ID and Secret

2. **Setup Database**:
   - Choose: Local PostgreSQL, Vercel Postgres, or Supabase
   - Add `DATABASE_URL` to `.env`
   - Run `npm run db:push`

3. **Test Locally**:
   - Run `npm run dev`
   - Visit `/trust-your-ears`
   - Try searching and voting on albums

4. **Deploy**:
   - Set environment variables in Vercel
   - Run `npm run db:push` to create tables
   - Deploy!

## Troubleshooting

See `docs/TRUST_YOUR_EARS_SETUP.md` for detailed troubleshooting guide.

## Design Notes

- Editorial, calm, typographic design
- No gamification language
- No star ratings or charts
- Mobile-first responsive layout
- Clear hierarchy: Current Listen → Community List
- Uses Lowther design system (HVMuse, Sarabun fonts)
