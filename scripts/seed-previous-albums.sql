-- Seed script for testing "Previously Discussed Albums" with comments
-- Run this in Supabase SQL Editor to see what past discussions look like

-- First, create test users for comments
INSERT INTO "User" (id, email, "displayName", "createdAt", "lastLoginAt")
VALUES 
  ('test-user-1', 'audiophile@example.com', 'VinylEnthusiast', NOW(), NOW()),
  ('test-user-2', 'hifi@example.com', 'LowtherLover', NOW(), NOW()),
  ('test-user-3', 'music@example.com', 'TubeAmpFan', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create a previously discussed album (Kind of Blue by Miles Davis)
-- Using actual MusicBrainz release group ID
INSERT INTO "Album" (
  id, 
  "musicBrainzReleaseGroupId", 
  title, 
  artist, 
  year, 
  "coverUrl", 
  "votesCount", 
  "featuredAt",
  "createdAt",
  "updatedAt"
)
VALUES (
  'prev-album-1',
  'f6e76eb0-8f74-3a47-9f34-5b90b8d8f4c5',
  'Kind of Blue',
  'Miles Davis',
  1959,
  'https://coverartarchive.org/release-group/f6e76eb0-8f74-3a47-9f34-5b90b8d8f4c5/front-250',
  12,
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '21 days',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET 
  "featuredAt" = NOW() - INTERVAL '14 days',
  "coverUrl" = 'https://coverartarchive.org/release-group/f6e76eb0-8f74-3a47-9f34-5b90b8d8f4c5/front-250';

-- Create another previously discussed album (Rumours by Fleetwood Mac)
INSERT INTO "Album" (
  id, 
  "musicBrainzReleaseGroupId", 
  title, 
  artist, 
  year, 
  "coverUrl", 
  "votesCount", 
  "featuredAt",
  "createdAt",
  "updatedAt"
)
VALUES (
  'prev-album-2',
  '028bc6f1-3a2b-3487-a0bd-c1f9ae6b9fb1',
  'Rumours',
  'Fleetwood Mac',
  1977,
  'https://coverartarchive.org/release-group/028bc6f1-3a2b-3487-a0bd-c1f9ae6b9fb1/front-250',
  8,
  NOW() - INTERVAL '21 days',
  NOW() - INTERVAL '28 days',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET 
  "featuredAt" = NOW() - INTERVAL '21 days',
  "coverUrl" = 'https://coverartarchive.org/release-group/028bc6f1-3a2b-3487-a0bd-c1f9ae6b9fb1/front-250';

-- Add likesCount column if it doesn't exist (for new comment likes feature)
ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "likesCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "parentId" TEXT;

-- Add comments to "Kind of Blue"
INSERT INTO "Comment" (id, content, "albumId", "userId", "likesCount", "createdAt", "updatedAt")
VALUES 
  (
    'comment-1',
    'The spatial separation on a Lowther horn is incredible with this recording. You can hear exactly where each musician is positioned in the studio. Rudy Van Gelder knew what he was doing.',
    'prev-album-1',
    'test-user-1',
    5,
    NOW() - INTERVAL '13 days',
    NOW() - INTERVAL '13 days'
  ),
  (
    'comment-2',
    'This is one of those albums that truly reveals what full-range drivers can do. The texture of Paul Chambers'' bass is so natural - no crossover coloration muddying things up.',
    'prev-album-1',
    'test-user-2',
    8,
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days'
  ),
  (
    'comment-3',
    'Been listening to this on my Medallions all week. The Columbia 6-eye pressing is remarkable for its dynamic range. Modern "remastered" versions compress everything.',
    'prev-album-1',
    'test-user-3',
    3,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    'comment-4',
    'Agreed on the original pressing. This album was recorded at 30 IPS which gives it that incredible transient response. Perfect match for horn efficiency.',
    'prev-album-1',
    'test-user-1',
    2,
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Add comments to "Rumours"
INSERT INTO "Comment" (id, content, "albumId", "userId", "likesCount", "createdAt", "updatedAt")
VALUES 
  (
    'comment-5',
    'The harmonies on this album are stunning through Lowthers. You can hear each voice distinctly yet they blend perfectly. The midrange clarity is essential for this.',
    'prev-album-2',
    'test-user-2',
    7,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'comment-6',
    'Lindsay Buckingham''s guitar work on "Never Going Back Again" is a great test track. The fingerpicking should sound effortless, not etched or harsh.',
    'prev-album-2',
    'test-user-1',
    4,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  ),
  (
    'comment-7',
    'Production on this is remarkably natural for a 70s rock album. Ken Caillat and Richard Dashut deserve credit for keeping it dynamic.',
    'prev-album-2',
    'test-user-3',
    2,
    NOW() - INTERVAL '16 days',
    NOW() - INTERVAL '16 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Add a reply to demonstrate threading (comment-1-reply is a reply to comment-1)
INSERT INTO "Comment" (id, content, "albumId", "userId", "parentId", "likesCount", "createdAt", "updatedAt")
VALUES 
  (
    'comment-1-reply-1',
    'Completely agree about Van Gelder. His studio techniques were ahead of their time.',
    'prev-album-1',
    'test-user-2',
    'comment-1',
    1,
    NOW() - INTERVAL '12 days 6 hours',
    NOW() - INTERVAL '12 days 6 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the data
SELECT 
  a.title,
  a.artist,
  a."coverUrl",
  a."featuredAt",
  COUNT(c.id) as comment_count
FROM "Album" a
LEFT JOIN "Comment" c ON a.id = c."albumId"
WHERE a."featuredAt" IS NOT NULL
GROUP BY a.id
ORDER BY a."featuredAt" DESC;
