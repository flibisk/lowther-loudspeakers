# Environment Variables Setup

This file contains instructions for setting up the required environment variables for the Lowther Loudspeakers website.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# ===================================
# RESEND EMAIL API CONFIGURATION
# ===================================
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# The email address where form submissions will be sent
CONTACT_EMAIL=info@lowtherloudspeakers.com

# Secondary email address for notifications (optional)
RESEND_SECONDARY_EMAIL=hello@lowtherloudspeakers.com

# From email address (must be verified with Resend)
RESEND_FROM_EMAIL=noreply@lowtherloudspeakers.com

# Wishlist notifications (set to 'false' to disable)
# When enabled, sends email to CONTACT_EMAIL when users add items to wishlist
WISHLIST_NOTIFICATIONS_ENABLED=true

# ===================================
# BEEHIIV NEWSLETTER CONFIGURATION
# ===================================
# Get your credentials from: https://www.beehiiv.com/developers
# API Dashboard: https://app.beehiiv.com/settings/integrations/api
BEEHIIV_API_KEY=your_beehiiv_api_key_here
BEEHIIV_PUBLICATION_ID=your_publication_id_here

# Beehiiv Blog Publication ID (for fetching blog posts)
BEEHIIV_BLOG_PUBLICATION_ID=your_blog_publication_id_here

# ===================================
# GOOGLE SHEETS API (for reviews)
# ===================================
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here

# ===================================
# NEXT.JS CONFIGURATION
# ===================================
NEXT_PUBLIC_SITE_URL=https://lowtherloudspeakers.com
```

## Setup Instructions

### 1. Resend Email Service

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain at https://resend.com/domains
3. Create an API key at https://resend.com/api-keys
4. Add the API key to `RESEND_API_KEY`
5. Set `CONTACT_EMAIL` to your preferred email address

**Note:** For the "from" email to work properly, you need to verify your domain with Resend. Until then, emails will be sent from a Resend sandbox domain.

### 2. Beehiiv Newsletter

1. Log into your Beehiiv account at [beehiiv.com](https://beehiiv.com)
2. Go to Settings → Integrations → API
3. Create an API key
4. Find your Publication ID in the API settings
5. Add both values to the environment variables

### 3. Google Sheets (Reviews)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Make sure your Google Sheet is publicly readable
6. Add the API key and spreadsheet ID

### 4. Vercel Deployment

When deploying to Vercel, add all environment variables in your project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable above
4. Redeploy your application

## Form Endpoints

The following form endpoints are available:

- **Contact Form:** `/api/contact` - Sends emails via Resend
- **Commission Form:** `/api/commission` - Sends commission requests via Resend
- **Newsletter:** `/api/newsletter` - Subscribes users to Beehiiv
- **Wishlist Notifications:** `/api/wishlist-notification` - Sends email when users add items to wishlist (controlled by `WISHLIST_NOTIFICATIONS_ENABLED`)

## Testing Locally

1. Create `.env.local` file in the root directory
2. Add all required environment variables
3. Restart your development server: `npm run dev`
4. Test the forms on your local site

## Production Checklist

- [ ] Verify domain with Resend
- [ ] Add all environment variables to Vercel
- [ ] Test contact form submission
- [ ] Test commission form submission
- [ ] Test newsletter subscription
- [ ] Verify emails are being received
- [ ] Check Beehiiv subscriber list

## Troubleshooting

### Emails not sending
- Check that `RESEND_API_KEY` is correct
- Verify your domain with Resend
- Check Resend dashboard for delivery logs

### Newsletter subscription not working
- Verify `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` are correct
- Check Beehiiv API logs for errors
- Ensure API key has subscription permissions

### Forms showing errors
- Check browser console for detailed error messages
- Verify all required environment variables are set
- Check API route logs in Vercel dashboard

## Support

For questions or issues, contact the development team or refer to:
- [Resend Documentation](https://resend.com/docs)
- [Beehiiv API Documentation](https://developers.beehiiv.com)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

