-- Trust Your Ears Database Schema
-- Run this in Supabase SQL Editor to create the tables

-- Create Album table
CREATE TABLE IF NOT EXISTS "Album" (
    "id" TEXT NOT NULL,
    "musicBrainzReleaseGroupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" INTEGER,
    "coverUrl" TEXT,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

-- Create unique constraint on musicBrainzReleaseGroupId
CREATE UNIQUE INDEX IF NOT EXISTS "Album_musicBrainzReleaseGroupId_key" ON "Album"("musicBrainzReleaseGroupId");

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Album_votesCount_idx" ON "Album"("votesCount");
CREATE INDEX IF NOT EXISTS "Album_musicBrainzReleaseGroupId_idx" ON "Album"("musicBrainzReleaseGroupId");
CREATE INDEX IF NOT EXISTS "Vote_albumId_idx" ON "Vote"("albumId");
CREATE INDEX IF NOT EXISTS "Vote_voterHash_idx" ON "Vote"("voterHash");

-- Create unique constraint on albumId + voterHash (prevents duplicate votes)
CREATE UNIQUE INDEX IF NOT EXISTS "Vote_albumId_voterHash_key" ON "Vote"("albumId", "voterHash");

-- Create foreign key with cascade delete
ALTER TABLE "Vote" 
ADD CONSTRAINT "Vote_albumId_fkey" 
FOREIGN KEY ("albumId") 
REFERENCES "Album"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updatedAt
DROP TRIGGER IF EXISTS update_album_updated_at ON "Album";
CREATE TRIGGER update_album_updated_at
    BEFORE UPDATE ON "Album"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
