-- Migration: Expand User model for unified account system
-- Run this in Supabase SQL Editor

-- Create UserLevel enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "UserLevel" AS ENUM ('ENTHUSIAST', 'ADVOCATE', 'AMBASSADOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create UserRole enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "fullName" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;

-- Add level column with default
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "level" "UserLevel" DEFAULT 'ENTHUSIAST';

-- Add role column with default
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "UserRole" DEFAULT 'USER';

-- Create index on level
DROP INDEX IF EXISTS "User_level_idx";
CREATE INDEX "User_level_idx" ON "User"("level");

-- Create Equipment table for "My Lowther Collection"
CREATE TABLE IF NOT EXISTS "Equipment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromOrder" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- Create index on Equipment userId
DROP INDEX IF EXISTS "Equipment_userId_idx";
CREATE INDEX "Equipment_userId_idx" ON "Equipment"("userId");

-- Add foreign key constraint
ALTER TABLE "Equipment" DROP CONSTRAINT IF EXISTS "Equipment_userId_fkey";
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'User' 
ORDER BY ordinal_position;
