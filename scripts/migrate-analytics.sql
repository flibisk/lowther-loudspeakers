-- Migration: Add Analytics Event Tracking
-- Run this in Supabase SQL Editor

-- Create EventType enum
DO $$ BEGIN
    CREATE TYPE "EventType" AS ENUM (
        'PAGE_VIEW',
        'CTA_CLICK',
        'VIDEO_PLAY',
        'DOWNLOAD_BROCHURE',
        'FORM_SUBMIT',
        'PRODUCT_VIEW',
        'ADD_TO_CART',
        'BEGIN_CHECKOUT',
        'TRUST_YOUR_EARS_VOTE',
        'ENQUIRY_START',
        'ENQUIRY_SUBMIT',
        'PRODUCT_REVISIT',
        'BLOG_DEEP_READ'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create UserEvent table
CREATE TABLE IF NOT EXISTS "UserEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "eventData" JSONB,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("id")
);

-- Create indexes for efficient querying
DROP INDEX IF EXISTS "UserEvent_userId_idx";
CREATE INDEX "UserEvent_userId_idx" ON "UserEvent"("userId");

DROP INDEX IF EXISTS "UserEvent_sessionId_idx";
CREATE INDEX "UserEvent_sessionId_idx" ON "UserEvent"("sessionId");

DROP INDEX IF EXISTS "UserEvent_eventType_idx";
CREATE INDEX "UserEvent_eventType_idx" ON "UserEvent"("eventType");

DROP INDEX IF EXISTS "UserEvent_timestamp_idx";
CREATE INDEX "UserEvent_timestamp_idx" ON "UserEvent"("timestamp");

DROP INDEX IF EXISTS "UserEvent_path_idx";
CREATE INDEX "UserEvent_path_idx" ON "UserEvent"("path");

-- Add foreign key to User (SET NULL on delete so we keep analytics even if user deleted)
ALTER TABLE "UserEvent" DROP CONSTRAINT IF EXISTS "UserEvent_userId_fkey";
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Set admin role for specified email addresses
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" IN (
    'social@lowtherloudspeakers.com',
    'hello@lowtherloudspeakers.com'
);

-- Add DOWNLOAD_PLAN to EventType enum if it doesn't exist
DO $$ BEGIN
    ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DOWNLOAD_PLAN';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify the changes
SELECT 'UserEvent table created' AS status;
SELECT COUNT(*) AS admin_count FROM "User" WHERE "role" = 'ADMIN';
