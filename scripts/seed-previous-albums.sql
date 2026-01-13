-- Seed script for testing "Previously Discussed Albums" with comments
-- Run this in Supabase SQL Editor AFTER running migrate-comment-likes-replies.sql

-- First, create test users for comments
INSERT INTO "User" (id, email, "displayName", "createdAt", "lastLoginAt")
VALUES 
  ('test-user-1', 'audiophile@example.com', 'VinylEnthusiast', NOW(), NOW()),
  ('test-user-2', 'hifi@example.com', 'LowtherLover', NOW(), NOW()),
  ('test-user-3', 'music@example.com', 'TubeAmpFan', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Delete existing test albums to refresh them
DELETE FROM "Album" WHERE id IN ('prev-album-1', 'prev-album-2');

-- Create a previously discussed album (Kind of Blue by Miles Davis)
-- Real MusicBrainz release group ID
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
  '4e4e5de2-5c4f-35b2-b2f2-2b5f0b183f5e',
  'Kind of Blue',
  'Miles Davis',
  1959,
  'https://coverartarchive.org/release-group/4e4e5de2-5c4f-35b2-b2f2-2b5f0b183f5e/front-250',
  12,
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '21 days',
  NOW()
);

-- Create another previously discussed album (Rumours by Fleetwood Mac)
-- Real MusicBrainz release group ID
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
  '95a0fb6a-dd63-347e-a0f3-63f13a4de448',
  'Rumours',
  'Fleetwood Mac',
  1977,
  'https://coverartarchive.org/release-group/95a0fb6a-dd63-347e-a0f3-63f13a4de448/front-250',
  8,
  NOW() - INTERVAL '21 days',
  NOW() - INTERVAL '28 days',
  NOW()
);

-- Delete existing test comments to refresh them
DELETE FROM "Comment" WHERE id LIKE 'comment-%';

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
  );

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
  );

-- Add a reply to demonstrate threading
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
  );

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
