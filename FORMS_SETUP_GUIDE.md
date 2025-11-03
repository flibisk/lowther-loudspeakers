# Forms Integration Setup Guide

## Required Vercel Environment Variables

All of these should be set in your Vercel Project Settings → Environment Variables (available for Production, Preview, and Development):

### 1. Resend (Email Sending)

**RESEND_API_KEY**  
- Get from: [Resend Dashboard](https://resend.com/api-keys)
- Format: `re_xxxxxxxxxxxxx`

**RESEND_FROM_EMAIL**  
- Your verified sender email
- Example: `noreply@lowtherlisteningcircle.com`
- **Important**: This domain must be verified in Resend
- If not set, will default to `onboarding@resend.dev` (sandbox)

**CONTACT_EMAIL**  
- Where all form submissions should be sent TO
- Example: `peter@lowtherloudspeakers.com`

### 2. Beehiiv (Newsletter & CRM)

**BEEHIIV_API_KEY**  
- Get from: Beehiiv → Settings → API
- Format: Bearer token

**BEEHIIV_PUBLICATION_ID**  
- Get from: Beehiiv → Settings → Publication Details
- Format: UUID (e.g., `pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

## How Forms Work Now

### Commission Form (`/loudspeakers/[speaker]`)
When a user requests a commission:
1. **Email via Resend** → Sends formatted email to `CONTACT_EMAIL` (peter@lowtherloudspeakers.com)
2. **Beehiiv CRM** → Adds contact with custom fields:
   - Full Name
   - Phone
   - Speaker Interest (e.g., "Voigt Horn")
   - Lead Type: "Commission Request"
   - UTM Campaign: Speaker name

### Contact Form (`/contact`)
When a user contacts you:
1. **Email via Resend** → Sends formatted email to `CONTACT_EMAIL`
2. **Beehiiv CRM** → Adds contact with custom fields:
   - Full Name
   - Phone
   - Location
   - Lead Type: Form segment (e.g., "Contact Form")
   - UTM Campaign: Segment

### Newsletter Form (Footer)
When a user subscribes:
1. **Beehiiv** → Adds subscriber
2. **Welcome Email** → Sent by Beehiiv
3. UTM Source: "website_footer"

---

## Troubleshooting

### Forms Failing to Send

**Check Vercel Function Logs:**
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" → Latest deployment
3. Click "Functions" tab
4. Look for `/api/commission` or `/api/contact`
5. Check the logs for error messages

**Common Issues:**

1. **"Domain not verified"**
   - Go to [Resend Domains](https://resend.com/domains)
   - Add `lowtherlisteningcircle.com`
   - Add the DNS records they provide
   - Wait for verification (usually 5-10 minutes)
   - Set `RESEND_FROM_EMAIL=noreply@lowtherlisteningcircle.com`

2. **"API key invalid"**
   - Check `RESEND_API_KEY` is correct
   - Check `BEEHIIV_API_KEY` is correct
   - Make sure there are no extra spaces or quotes

3. **Emails not arriving**
   - Check spam folder
   - Verify `CONTACT_EMAIL` is set correctly
   - Check Resend Logs: [Resend Logs](https://resend.com/logs)

4. **Subscribers not appearing in Beehiiv**
   - Verify `BEEHIIV_PUBLICATION_ID` is correct
   - Check Beehiiv → Audience → Subscribers
   - Look for the email address
   - Check custom fields are populated

---

## Testing

After deploying, test all three forms:

1. **Commission Form** (any speaker page)
   - Fill out form
   - Check email arrives at `peter@lowtherloudspeakers.com`
   - Check subscriber appears in Beehiiv with custom fields

2. **Contact Form** (`/contact`)
   - Fill out form
   - Check email arrives
   - Check subscriber appears in Beehiiv

3. **Newsletter Form** (footer)
   - Enter email
   - Check subscriber appears in Beehiiv
   - Check welcome email is sent

---

## Current Configuration Summary

Based on your setup:

- **TO Address**: `peter@lowtherloudspeakers.com` (set via `CONTACT_EMAIL`)
- **FROM Address**: `noreply@lowtherlisteningcircle.com` (set via `RESEND_FROM_EMAIL`)
- **Beehiiv**: All form submissions add contacts to your subscriber list
- **Error Handling**: Forms will work even if Beehiiv fails (email is priority)

---

## Need Help?

If forms are still failing:
1. Check Vercel function logs (see Troubleshooting above)
2. Send me the error message
3. Verify all environment variables are set
4. Make sure domain is verified in Resend

