# Abandoned Cart Email - Cron Job Limitations

## Vercel Plan Limits

### Hobby Plan
- **Cron Jobs**: Not supported (or unreliable timing)
- **Current Solution**: Client-side tracking that sends emails when users return to site

### Pro Plan
- **Cron Jobs**: 40 invocations per month
- **Timing**: More reliable than Hobby plan, but still has some variance

## Calculation for Pro Plan

If we want to use server-side cron jobs on Pro plan:

- **Every hour**: 24/day × 30 days = **720 invocations/month** ❌ (exceeds 40 limit)
- **Every 12 hours**: 2/day × 30 days = **60 invocations/month** ❌ (exceeds 40 limit)
- **Once per day**: 1/day × 30 days = **30 invocations/month** ✅ (within 40 limit)
- **Every 2 days**: ~15 invocations/month ✅ (well within limit)

## Recommendation

**Option 1: Stay on Hobby Plan (Current)**
- Use client-side tracking only
- Emails send when users return to site after 1 hour
- No additional cost
- Works reliably for users who return

**Option 2: Upgrade to Pro Plan**
- Run cron job **once per day** (e.g., at 2 AM)
- Sends all abandoned cart emails from the past 24 hours
- More reliable for users who don't return
- Cost: Pro plan subscription

**Option 3: Hybrid Approach (Pro Plan)**
- Keep client-side tracking (sends immediately when user returns)
- Add daily cron job as backup (catches users who don't return)
- Best of both worlds

## Current Implementation

The current code supports both:
- ✅ Client-side tracking (works on Hobby plan)
- ✅ Server-side cron endpoint (ready for Pro plan, just needs cron config)

To enable cron job on Pro plan, add to `vercel.json`:
```json
"crons": [
  {
    "path": "/api/cron/abandoned-carts",
    "schedule": "0 2 * * *"  // Once per day at 2 AM (30 invocations/month)
  }
]
```

## Notes

- 40 invocations/month = ~1.3 per day maximum
- Once per day is the most practical schedule
- Daily cron would send emails for carts abandoned in the past 24 hours
- Client-side tracking still works and sends immediately when users return

