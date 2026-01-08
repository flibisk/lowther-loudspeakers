# Trust Your Ears - Feature Summary

## ✅ Implementation Complete

The "Trust Your Ears" feature has been fully implemented and is ready for setup.

## Quick Start

1. **Set Environment Variables** (`.env`):
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/lowther_db"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
   
   **Note:** No API keys needed! MusicBrainz and Cover Art Archive are free and don't require authentication.

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

### MusicBrainz Integration
- `src/lib/musicbrainz/client.ts` - MusicBrainz API client (search, get album)
- `src/lib/cover-art-archive/client.ts` - Cover Art Archive client (fetch artwork)

### Voting System
- `src/lib/trust-your-ears/voting.ts` - Vote tracking utilities (cookie + IP hash)

### API Routes
- `src/app/api/musicbrainz/search-albums/route.ts` - Search MusicBrainz albums
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

✅ **Album Search** - Search MusicBrainz for albums (metadata only, no branding)  
✅ **Voting System** - One vote per user per album (cookie + IP hash)  
✅ **Featured Album** - Automatically displays highest-voted album  
✅ **Duplicate Prevention** - Prevents multiple votes from same user  
✅ **Community List** - All albums sorted by vote count  
✅ **Error Handling** - Clear error messages for failed searches/votes  
✅ **Mobile Responsive** - Works on all screen sizes  

## Database Models

### Album
- `id` (UUID)
- `musicBrainzReleaseGroupId` (unique)
- `title`, `artist`, `year`, `coverUrl` (nullable)
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
| GET | `/api/musicbrainz/search-albums?q={query}` | Search MusicBrainz albums |
| POST | `/api/trust-your-ears/vote` | Vote on/create album |
| GET | `/api/trust-your-ears/albums` | Get all albums |
| GET | `/api/trust-your-ears/featured` | Get featured album |

## Environment Variables Required

```bash
DATABASE_URL              # PostgreSQL connection string
NEXT_PUBLIC_SITE_URL      # Site URL for API calls
```

**Note:** No API keys required! MusicBrainz and Cover Art Archive are free services.

## Next Steps

1. **Setup Database**:
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
