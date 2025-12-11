# Logo Image Setup for Abandoned Cart Emails

## Image Location
The logo image is located at:
- **File**: `public/images/Lowther-Logo-Black-Box.jpg`
- **URL Path**: `/images/Lowther-Logo-Black-Box.jpg`

## Vercel Configuration

For the logo to load correctly in emails sent from Vercel, ensure:

1. **Environment Variable**: Set `NEXT_PUBLIC_SITE_URL` in Vercel:
   - Value: `https://www.lowtherloudspeakers.com`
   - This ensures emails use the correct absolute URL

2. **Image Accessibility**: The image must be publicly accessible at:
   ```
   https://www.lowtherloudspeakers.com/images/Lowther-Logo-Black-Box.jpg
   ```

3. **File Deployment**: Ensure the image file is committed to git and deployed to Vercel:
   ```bash
   git add public/images/Lowther-Logo-Black-Box.jpg
   git commit -m "Add logo for abandoned cart emails"
   git push
   ```

## How It Works

The email templates use a `getLogoUrl()` helper function that:
1. First checks `NEXT_PUBLIC_SITE_URL` environment variable
2. Falls back to `VERCEL_URL` (for preview deployments)
3. Defaults to `https://www.lowtherloudspeakers.com`

This ensures the logo URL is always an absolute URL that works in email clients.

## Testing

To verify the logo loads:
1. Check that the image is accessible at the production URL
2. Send a test email and verify the logo appears
3. Check email client compatibility (Gmail, Outlook, etc.)

## Troubleshooting

If the logo doesn't load:
1. Verify `NEXT_PUBLIC_SITE_URL` is set in Vercel environment variables
2. Check that the image file exists in `public/images/`
3. Verify the image is accessible at the absolute URL
4. Check email client image blocking settings

