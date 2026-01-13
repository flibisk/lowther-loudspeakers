-- Migration: Add comment likes and replies support
-- Run this in Supabase SQL Editor to update existing tables
-- This script is idempotent - safe to run multiple times

-- Add new columns to Comment table (IF NOT EXISTS handles reruns)
ALTER TABLE "Comment" 
ADD COLUMN IF NOT EXISTS "parentId" TEXT,
ADD COLUMN IF NOT EXISTS "likesCount" INTEGER NOT NULL DEFAULT 0;

-- Create CommentLike table if it doesn't exist
CREATE TABLE IF NOT EXISTS "CommentLike" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- Create indexes (IF NOT EXISTS handles reruns)
CREATE UNIQUE INDEX IF NOT EXISTS "CommentLike_commentId_userId_key" ON "CommentLike"("commentId", "userId");
CREATE INDEX IF NOT EXISTS "CommentLike_commentId_idx" ON "CommentLike"("commentId");
CREATE INDEX IF NOT EXISTS "CommentLike_userId_idx" ON "CommentLike"("userId");
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");
CREATE INDEX IF NOT EXISTS "Comment_likesCount_idx" ON "Comment"("likesCount");

-- Add featuredAt column to Album if not exists
ALTER TABLE "Album" 
ADD COLUMN IF NOT EXISTS "featuredAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Album_featuredAt_idx" ON "Album"("featuredAt");

-- Drop existing constraints first (ignore errors if they don't exist)
DO $$ 
BEGIN
    -- Drop CommentLike -> Comment FK if exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'CommentLike_commentId_fkey') THEN
        ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";
    END IF;
    
    -- Drop CommentLike -> User FK if exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'CommentLike_userId_fkey') THEN
        ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_userId_fkey";
    END IF;
    
    -- Drop Comment self-reference FK if exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'Comment_parentId_fkey') THEN
        ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";
    END IF;
END $$;

-- Now create the foreign keys fresh
ALTER TABLE "CommentLike" 
ADD CONSTRAINT "CommentLike_commentId_fkey" 
FOREIGN KEY ("commentId") 
REFERENCES "Comment"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

ALTER TABLE "CommentLike" 
ADD CONSTRAINT "CommentLike_userId_fkey" 
FOREIGN KEY ("userId") 
REFERENCES "User"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

ALTER TABLE "Comment" 
ADD CONSTRAINT "Comment_parentId_fkey" 
FOREIGN KEY ("parentId") 
REFERENCES "Comment"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Add unique constraint on displayName for usernames
CREATE UNIQUE INDEX IF NOT EXISTS "User_displayName_key" ON "User"("displayName") WHERE "displayName" IS NOT NULL;

-- Add index on displayName for faster lookups
CREATE INDEX IF NOT EXISTS "User_displayName_idx" ON "User"("displayName");

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Comment' 
ORDER BY ordinal_position;
