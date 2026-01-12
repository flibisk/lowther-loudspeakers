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

-- Create User table (for commenting system)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create VerificationCode table
CREATE TABLE IF NOT EXISTS "VerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- Create Comment table
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on musicBrainzReleaseGroupId
CREATE UNIQUE INDEX IF NOT EXISTS "Album_musicBrainzReleaseGroupId_key" ON "Album"("musicBrainzReleaseGroupId");

-- Create unique constraint on User email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Create indexes for Album
CREATE INDEX IF NOT EXISTS "Album_votesCount_idx" ON "Album"("votesCount");
CREATE INDEX IF NOT EXISTS "Album_musicBrainzReleaseGroupId_idx" ON "Album"("musicBrainzReleaseGroupId");

-- Create indexes for Vote
CREATE INDEX IF NOT EXISTS "Vote_albumId_idx" ON "Vote"("albumId");
CREATE INDEX IF NOT EXISTS "Vote_voterHash_idx" ON "Vote"("voterHash");
CREATE UNIQUE INDEX IF NOT EXISTS "Vote_albumId_voterHash_key" ON "Vote"("albumId", "voterHash");

-- Create indexes for User
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- Create indexes for VerificationCode
CREATE INDEX IF NOT EXISTS "VerificationCode_email_code_idx" ON "VerificationCode"("email", "code");
CREATE INDEX IF NOT EXISTS "VerificationCode_expiresAt_idx" ON "VerificationCode"("expiresAt");

-- Create indexes for Comment
CREATE INDEX IF NOT EXISTS "Comment_albumId_idx" ON "Comment"("albumId");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt");

-- Create foreign key for Vote -> Album
ALTER TABLE "Vote" 
ADD CONSTRAINT "Vote_albumId_fkey" 
FOREIGN KEY ("albumId") 
REFERENCES "Album"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create foreign key for Comment -> Album
ALTER TABLE "Comment" 
ADD CONSTRAINT "Comment_albumId_fkey" 
FOREIGN KEY ("albumId") 
REFERENCES "Album"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create foreign key for Comment -> User
ALTER TABLE "Comment" 
ADD CONSTRAINT "Comment_userId_fkey" 
FOREIGN KEY ("userId") 
REFERENCES "User"("id") 
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

-- Create trigger to auto-update updatedAt for Album
DROP TRIGGER IF EXISTS update_album_updated_at ON "Album";
CREATE TRIGGER update_album_updated_at
    BEFORE UPDATE ON "Album"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to auto-update updatedAt for Comment
DROP TRIGGER IF EXISTS update_comment_updated_at ON "Comment";
CREATE TRIGGER update_comment_updated_at
    BEFORE UPDATE ON "Comment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
