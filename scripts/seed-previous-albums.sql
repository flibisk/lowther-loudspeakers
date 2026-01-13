-- Seed script for testing "Previously Discussed Albums" with comments
-- Run this in Supabase SQL Editor to see what past discussions look like

-- First, create a test user for comments
INSERT INTO "User" (id, email, "displayName", "createdAt", "lastLoginAt")
VALUES 
  ('test-user-1', 'audiophile@example.com', 'VinylEnthusiast', NOW(), NOW()),
  ('test-user-2', 'hifi@example.com', 'LowtherLover', NOW(), NOW()),
  ('test-user-3', 'music@example.com', 'TubeAmpFan', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create a previously discussed album (Kind of Blue by Miles Davis)
-- Set featuredAt to 2 weeks ago so it shows as "previous"
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
  'f6f7e38c-cd64-3c7f-8c5c-d7e76c8e9f0d',
  'Kind of Blue',
  'Miles Davis',
  1959,
  'https://coverartarchive.org/release-group/f6f7e38c-cd64-3c7f-8c5c-d7e76c8e9f0d/front',
  12,
  NOW() - INTERVAL '14 days',  -- Featured 2 weeks ago (now in "previous")
  NOW() - INTERVAL '21 days',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET "featuredAt" = NOW() - INTERVAL '14 days';

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
  'db8b935e-e5f2-3c23-8a3d-0e0c4e3c9c5e',
  'Rumours',
  'Fleetwood Mac',
  1977,
  'https://coverartarchive.org/release-group/db8b935e-e5f2-3c23-8a3d-0e0c4e3c9c5e/front',
  8,
  NOW() - INTERVAL '21 days',  -- Featured 3 weeks ago
  NOW() - INTERVAL '28 days',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET "featuredAt" = NOW() - INTERVAL '21 days';

-- Add comments to "Kind of Blue"
INSERT INTO "Comment" (id, content, "albumId", "userId", "createdAt", "updatedAt")
VALUES 
  (
    'comment-1',
    'The spatial separation on a Lowther horn is incredible with this recording. You can hear exactly where each musician is positioned in the studio. Rudy Van Gelder knew what he was doing.',
    'prev-album-1',
    'test-user-1',
    NOW() - INTERVAL '13 days',
    NOW() - INTERVAL '13 days'
  ),
  (
    'comment-2',
    'This is one of those albums that truly reveals what full-range drivers can do. The texture of Paul Chambers'' bass is so natural - no crossover coloration muddying things up.',
    'prev-album-1',
    'test-user-2',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days'
  ),
  (
    'comment-3',
    'Been listening to this on my Medallions all week. The Columbia 6-eye pressing is remarkable for its dynamic range. Modern "remastered" versions compress everything.',
    'prev-album-1',
    'test-user-3',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    'comment-4',
    'Agreed on the original pressing. This album was recorded at 30 IPS which gives it that incredible transient response. Perfect match for horn efficiency.',
    'prev-album-1',
    'test-user-1',
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Add comments to "Rumours"
INSERT INTO "Comment" (id, content, "albumId", "userId", "createdAt", "updatedAt")
VALUES 
  (
    'comment-5',
    'The harmonies on this album are stunning through Lowthers. You can hear each voice distinctly yet they blend perfectly. The midrange clarity is essential for this.',
    'prev-album-2',
    'test-user-2',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'comment-6',
    'Lindsay Buckingham''s guitar work on "Never Going Back Again" is a great test track. The fingerpicking should sound effortless, not etched or harsh.',
    'prev-album-2',
    'test-user-1',
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  ),
  (
    'comment-7',
    'Production on this is remarkably natural for a 70s rock album. Ken Caillat and Richard Dashut deserve credit for keeping it dynamic.',
    'prev-album-2',
    'test-user-3',
    NOW() - INTERVAL '16 days',
    NOW() - INTERVAL '16 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the data
SELECT 
  a.title,
  a.artist,
  a."featuredAt",
  COUNT(c.id) as comment_count
FROM "Album" a
LEFT JOIN "Comment" c ON a.id = c."albumId"
WHERE a."featuredAt" IS NOT NULL
GROUP BY a.id
ORDER BY a."featuredAt" DESC;
