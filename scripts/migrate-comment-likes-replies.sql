-- Migration: Add comment likes and replies support
-- Run this in Supabase SQL Editor to update existing tables

-- Add new columns to Comment table
ALTER TABLE "Comment" 
ADD COLUMN IF NOT EXISTS "parentId" TEXT,
ADD COLUMN IF NOT EXISTS "likesCount" INTEGER NOT NULL DEFAULT 0;

-- Create CommentLike table
CREATE TABLE IF NOT EXISTS "CommentLike" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint (one like per user per comment)
CREATE UNIQUE INDEX IF NOT EXISTS "CommentLike_commentId_userId_key" ON "CommentLike"("commentId", "userId");

-- Create indexes for CommentLike
CREATE INDEX IF NOT EXISTS "CommentLike_commentId_idx" ON "CommentLike"("commentId");
CREATE INDEX IF NOT EXISTS "CommentLike_userId_idx" ON "CommentLike"("userId");

-- Create index for Comment parentId
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");

-- Create index for Comment likesCount
CREATE INDEX IF NOT EXISTS "Comment_likesCount_idx" ON "Comment"("likesCount");

-- Create foreign key for CommentLike -> Comment
ALTER TABLE "CommentLike" 
ADD CONSTRAINT "CommentLike_commentId_fkey" 
FOREIGN KEY ("commentId") 
REFERENCES "Comment"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create foreign key for CommentLike -> User
ALTER TABLE "CommentLike" 
ADD CONSTRAINT "CommentLike_userId_fkey" 
FOREIGN KEY ("userId") 
REFERENCES "User"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create self-referencing foreign key for Comment replies
ALTER TABLE "Comment" 
ADD CONSTRAINT "Comment_parentId_fkey" 
FOREIGN KEY ("parentId") 
REFERENCES "Comment"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Add featuredAt column to Album if not exists
ALTER TABLE "Album" 
ADD COLUMN IF NOT EXISTS "featuredAt" TIMESTAMP(3);

-- Create index for Album featuredAt
CREATE INDEX IF NOT EXISTS "Album_featuredAt_idx" ON "Album"("featuredAt");

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Comment' 
ORDER BY ordinal_position;
