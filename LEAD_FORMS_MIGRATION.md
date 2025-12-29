# Lead Forms Migration Summary

## Problem Statement

**Issue:** Commission and Contact forms were only sending emails to a single recipient (`CONTACT_EMAIL`), while Build-a-Lowther forms were successfully sending to both `social@lowtherloudspeakers.com` and `hello@lowtherloudspeakers.com`.

**Root Cause:** The `/api/commission` and `/api/contact` endpoints were using different email sending logic than the working forms, only sending to `process.env.CONTACT_EMAIL` instead of both notification inboxes.

## Solution

Created a **unified lead submission system** that:
1. **Centralizes** all email + Beehiiv logic in `/src/lib/leads/submitLead.ts`
2. **Standardizes** recipient handling via `FORM_NOTIFICATION_EMAILS` environment variable
3. **Ring-fences** lead capture so future features cannot break it
4. **Prioritizes** email delivery (Beehiiv failures don't break submissions)

## Changes Made

### A) Form Endpoints Audit

**Before:**
- `/api/form` → Used `contactEmail` + `secondaryEmail` ✅ (working)
- `/api/commission` → Used only `CONTACT_EMAIL` ❌ (broken)
- `/api/contact` → Used only `CONTACT_EMAIL` ❌ (broken)
- `/api/book-appointment` → Used `contactEmail` + `secondaryEmail` ✅ (working)
- `/api/submit-plan-request` → Used `contactEmail` + `secondaryEmail` ✅ (working)
- `/api/custom-order` → Used `contactEmail` + `secondaryEmail` ✅ (working)

**After:**
- **ALL** endpoints now use `/src/lib/leads/submitLead.ts` ✅
- **ALL** endpoints send to `FORM_NOTIFICATION_EMAILS` (comma-separated list) ✅
- **ALL** endpoints have consistent error handling ✅

### B) Shared Helper: `/src/lib/leads/submitLead.ts`

**Features:**
- Validates payload (name, email, segment required)
- Sends email via Resend to **all** emails in `FORM_NOTIFICATION_EMAILS`
- Adds to Beehiiv (non-fatal if it fails)
- Returns structured result: `{ ok, beehiivOk, emailOk, resendId, error }`
- Comprehensive logging (without exposing secrets)
- HTML + plain text email templates

**Email Priority:**
- If Resend fails → Returns error (email is critical)
- If Beehiiv fails → Still returns success (Beehiiv is optional)

### C) Environment Variables

**New Required:**
```env
FORM_NOTIFICATION_EMAILS=social@lowtherloudspeakers.com,hello@lowtherloudspeakers.com
```

**Existing (still used):**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@lowtherloudspeakers.com
BEEHIIV_API_KEY=...
BEEHIIV_PUBLICATION_ID=...
```

**Deprecated (no longer used for lead notifications):**
- `CONTACT_EMAIL` - Replaced by `FORM_NOTIFICATION_EMAILS`
- `RESEND_SECONDARY_EMAIL` - Replaced by `FORM_NOTIFICATION_EMAILS`

**Fallback Behavior:**
- If `FORM_NOTIFICATION_EMAILS` is not set, defaults to:
  - `social@lowtherloudspeakers.com`
  - `hello@lowtherloudspeakers.com`

### D) Updated API Routes

All routes now:
1. Import `submitLead` from `@/lib/leads/submitLead`
2. Map their payload to `LeadSubmissionPayload` format
3. Call `submitLead()` with appropriate `segment`
4. Return standardized response with `beehiivOk` status

**Segment Mapping:**
- `/api/commission` → `segment: "Commission Request"` + `speakerInterest`
- `/api/contact` → `segment: "Contact"` (or custom segment from form)
- `/api/book-appointment` → `segment: "Book Appointment"`
- `/api/form` → Uses `segment` from payload
- `/api/submit-plan-request` → `segment: "Build-a-Lowther Request"`
- `/api/custom-order` → `segment: "Custom Order"`

### E) Health Endpoint: `/api/leads/health`

**Endpoint:** `GET /api/leads/health`

**Response:**
```json
{
  "ok": true,
  "resendConfigured": true,
  "beehiivConfigured": true,
  "notificationEmailsCount": 2,
  "notificationEmailsConfigured": true,
  "fromEmailConfigured": true,
  "timestamp": "2025-01-21T12:00:00.000Z"
}
```

**Use Cases:**
- Verify configuration before deployment
- Monitor system health
- Debug email delivery issues

### F) Integration Test Script: `/scripts/test-lead-forms.mjs`

**Usage:**
```bash
# Test all endpoints
node scripts/test-lead-forms.mjs

# Test specific endpoint
node scripts/test-lead-forms.mjs --endpoint=commission

# Test against production (requires TEST_BASE_URL)
TEST_BASE_URL=https://lowtherloudspeakers.com node scripts/test-lead-forms.mjs
```

**What it tests:**
- All form endpoints accept valid payloads
- All endpoints return `success: true`
- Health endpoint reports correct configuration
- (In dev mode, can mock Resend to verify "to" field)

## Vercel Environment Variables

### Production Environment

```env
FORM_NOTIFICATION_EMAILS=social@lowtherloudspeakers.com,hello@lowtherloudspeakers.com
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@lowtherloudspeakers.com
BEEHIIV_API_KEY=...
BEEHIIV_PUBLICATION_ID=...
```

### Preview Environment

Same as Production.

### Development Environment

Same as Production (or use `.env.local` for local testing).

## Testing

### 1. Health Check
```bash
curl https://lowtherloudspeakers.com/api/leads/health
```

### 2. Test Script (Local)
```bash
# Start dev server first
npm run dev

# In another terminal
node scripts/test-lead-forms.mjs
```

### 3. Manual Form Testing
1. Submit a commission form
2. Submit a contact form
3. Submit a book appointment form
4. Verify emails arrive at **both** inboxes:
   - `social@lowtherloudspeakers.com`
   - `hello@lowtherloudspeakers.com`

## What Was Broken and Why

**The Problem:**
- `/api/commission` and `/api/contact` were restored to "original working code" (commit `3361f21`)
- That original code only sent to `process.env.CONTACT_EMAIL` (single recipient)
- The working forms (`/api/form`, `/api/book-appointment`, etc.) were using updated code that sent to both `contactEmail` and `secondaryEmail`

**The Fix:**
- Created unified `submitLead()` helper that **always** sends to `FORM_NOTIFICATION_EMAILS`
- Updated **all** endpoints to use this helper
- Removed inconsistent recipient logic
- Added health endpoint to verify configuration

## Ring-Fencing

**Protection Mechanisms:**
1. **Single Source of Truth:** All forms use `submitLead()` - cannot diverge
2. **Environment Variable:** `FORM_NOTIFICATION_EMAILS` is the only way to configure recipients
3. **Health Endpoint:** Can verify configuration before deployment
4. **Test Script:** Can validate all endpoints work correctly
5. **Email Priority:** Email failures return errors (Beehiiv failures don't break submissions)

**Future-Proofing:**
- New forms should use `submitLead()` directly
- Don't modify individual endpoint email logic
- Use `FORM_NOTIFICATION_EMAILS` for all recipient changes
- Run test script before deploying form changes

## Migration Checklist

- [x] Create `submitLead()` helper
- [x] Update `/api/commission` to use helper
- [x] Update `/api/contact` to use helper
- [x] Update `/api/book-appointment` to use helper
- [x] Update `/api/form` to use helper
- [x] Update `/api/submit-plan-request` to use helper
- [x] Update `/api/custom-order` to use helper
- [x] Create health endpoint
- [x] Create test script
- [ ] Set `FORM_NOTIFICATION_EMAILS` in Vercel (Production)
- [ ] Set `FORM_NOTIFICATION_EMAILS` in Vercel (Preview)
- [ ] Test all forms manually
- [ ] Verify emails arrive at both inboxes
- [ ] Monitor Resend dashboard for delivery

## Next Steps

1. **Set Environment Variable in Vercel:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `FORM_NOTIFICATION_EMAILS=social@lowtherloudspeakers.com,hello@lowtherloudspeakers.com`
   - Apply to Production, Preview, and Development

2. **Deploy and Test:**
   - Push code to main branch
   - Wait for Vercel deployment
   - Test each form type
   - Verify emails arrive at both inboxes

3. **Monitor:**
   - Check Resend dashboard for delivery status
   - Check health endpoint: `/api/leads/health`
   - Run test script periodically

4. **Cleanup (Optional):**
   - Remove deprecated `CONTACT_EMAIL` and `RESEND_SECONDARY_EMAIL` env vars after confirming everything works

