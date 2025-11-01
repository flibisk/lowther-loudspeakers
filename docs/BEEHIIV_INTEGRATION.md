# Beehiiv + Resend Integration Documentation

This document outlines the Beehiiv and Resend integration for form submissions and blog post management.

## 🔧 Setup

### Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Beehiiv API
BEEHIIV_API_KEY=VXyomhOrCqJVkcjwz8cymJnF3gDivqcOQYaTSt5EiBsvq8UjCw5uMcZuVUd4plgC
NEXT_PUBLIC_BEEHIIV_API_KEY=VXyomhOrCqJVkcjwz8cymJnF3gDivqcOQYaTSt5EiBsvq8UjCw5uMcZuVUd4plgC
BEEHIIV_PUBLICATION_ID=pub_79bec092-7d42-4cc7-b7ce-58fe2c776e5f

# Resend
RESEND_API_KEY=re_4Z44LmvN_8XyDssLfPZJf1u7EQQRamdiD
```

## 📝 Form Submission System

### API Route: `/app/api/form/route.ts`

Handles form submissions with the following workflow:

1. **Validates** required fields (name, email, message, segment)
2. **Adds contact to Beehiiv** with UTM source tracking
3. **Sends email notification** to hello@lowtherloudspeakers.com via Resend
4. **Returns success/error response** to the client

#### Request Format

```typescript
POST /api/form
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in...",
  "segment": "Contact", // Used for categorization
  "phone": "+44 123 456 7890", // Optional
  "location": "London, UK" // Optional
}
```

#### Response Format

```typescript
// Success
{
  "success": true,
  "message": "Thank you for your enquiry. We'll get back to you soon!"
}

// Error
{
  "success": false,
  "message": "Error processing form submission. Please try again."
}
```

### Contact Form Component: `/components/forms/contact-form.tsx`

Updated component features:

- **Segment support**: Pass a `segment` prop to categorize form submissions
- **Loading states**: Shows "Sending..." during submission
- **Success/error feedback**: Displays colored status messages
- **Auto-close**: Form closes automatically after successful submission
- **Error handling**: Graceful error handling with user-friendly messages

#### Usage Example

```tsx
import { ContactForm } from "@/components/forms/contact-form";

function MyPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <ContactForm
      isOpen={isFormOpen}
      onClose={() => setIsFormOpen(false)}
      segment="Upgrade" // Optional, defaults to "Contact"
    />
  );
}
```

#### Available Segments

Common segment values for tracking different form sources:

- `"Contact"` - General contact form
- `"Upgrade"` - Upgrade enquiries
- `"Refurbishment"` - Refurbishment requests
- `"PX4 Interest"` - PX4 amplifier interest
- `"Build a Lowther"` - Building plans requests
- `"Listening Room"` - Listening room booking
- `"OEM"` - OEM opportunities

## 📰 Blog System

### Blog Page: `/app/blog/page.tsx`

Fetches and displays blog posts from Beehiiv with the following features:

- **ISR Caching**: Revalidates every hour (3600 seconds)
- **Beehiiv API Integration**: Fetches published posts
- **Responsive Grid**: 1 column mobile, 2 columns tablet, 3 columns desktop
- **Fallback UI**: Shows "Posts will appear here soon" when no posts available
- **External Links**: Opens posts in new tab via `post.web_url`

#### Post Card Display

Each post card shows:
- **Thumbnail image** (if available)
- **Publication date** (formatted as "DD Month YYYY")
- **Title** with hover effect
- **Preview text** (limited to 3 lines)

#### API Details

- **Endpoint**: `https://api.beehiiv.com/v2/publications/{PUBLICATION_ID}/posts`
- **Parameters**: `?status=confirmed&limit=50`
- **Authentication**: Bearer token in Authorization header
- **Cache**: 1 hour via ISR (`revalidate: 3600`)

## 🧪 Testing

### Test Checklist

1. **Form Submission**
   - [ ] Submit a form with all required fields
   - [ ] Check Beehiiv dashboard for new subscriber
   - [ ] Verify email arrives at hello@lowtherloudspeakers.com
   - [ ] Test with different segment values
   - [ ] Verify success message displays
   - [ ] Confirm form auto-closes after 2 seconds

2. **Error Handling**
   - [ ] Submit form with missing fields (should show validation error)
   - [ ] Test with invalid email format
   - [ ] Test with network disconnected (should show error message)

3. **Blog Page**
   - [ ] Visit `/blog` and verify posts load
   - [ ] Click on a post card (should open in new tab)
   - [ ] Check page source for proper SEO metadata
   - [ ] Wait 1 hour and verify ISR revalidation works
   - [ ] Publish new post in Beehiiv and verify it appears

### Manual Testing

#### Test Form Submission

```bash
# Test the form API directly
curl -X POST http://localhost:3000/api/form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message",
    "segment": "Test"
  }'
```

#### Check Beehiiv Subscribers

1. Log into Beehiiv dashboard
2. Navigate to Subscribers section
3. Look for new subscriber with:
   - Email address from test
   - UTM source matching the segment
   - Custom fields populated

#### Check Email Notification

1. Check inbox at hello@lowtherloudspeakers.com
2. Look for email with subject "New {segment} Enquiry"
3. Verify all form data is included

## 🔒 Security Considerations

- **API Keys**: Never commit `.env.local` to version control
- **Rate Limiting**: Consider adding rate limiting to `/api/form`
- **Validation**: Server-side validation ensures data integrity
- **CORS**: API routes are only accessible from your domain
- **Spam Protection**: Consider adding reCAPTCHA for production

## 🚀 Deployment

### Vercel Setup

1. Add environment variables in Vercel dashboard:
   - Settings → Environment Variables
   - Add all variables from `.env.local`
   - Apply to Production, Preview, and Development

2. Deploy:
   ```bash
   git add .
   git commit -m "Add Beehiiv + Resend integration"
   git push
   ```

3. Verify deployment:
   - Test form submission on production URL
   - Check `/blog` page loads correctly
   - Verify emails are received

## 📊 Monitoring

### Beehiiv Dashboard

Monitor:
- New subscribers by segment (via UTM source)
- Subscriber growth trends
- Custom field data quality

### Email Logs

Check Resend dashboard for:
- Email delivery status
- Bounce rates
- Failed deliveries

## 🐛 Troubleshooting

### Form Submission Issues

**Problem**: Form submits but no email received

- Check Resend API key is correct
- Verify `from` domain is verified in Resend
- Check Resend logs for errors
- Ensure `hello@lowtherloudspeakers.com` is a valid recipient

**Problem**: Subscriber not appearing in Beehiiv

- Check Beehiiv API key has write permissions
- Verify publication ID is correct
- Check Beehiiv API logs for errors
- Ensure email is not already subscribed with `reactivate_existing: false`

### Blog Page Issues

**Problem**: Posts not loading

- Check Beehiiv API key has read permissions
- Verify posts are published (status: confirmed)
- Check console for API errors
- Ensure ISR cache isn't stale (wait 1 hour or clear cache)

**Problem**: Images not displaying

- Check Beehiiv posts have `thumbnail_url` set
- Verify image URLs are accessible
- Add Beehiiv CDN domain to `next.config.js` `images.domains`

## 🔄 Updates and Maintenance

### Updating Segments

To add new segment types:

1. Add to documentation above
2. Update any TypeScript types if needed
3. Train team on when to use each segment

### API Changes

If Beehiiv or Resend APIs change:

1. Check their changelog/documentation
2. Update TypeScript interfaces
3. Test thoroughly before deploying
4. Update this documentation

## 📞 Support

For issues or questions:

- **Beehiiv Support**: https://support.beehiiv.com
- **Resend Support**: https://resend.com/docs
- **Internal**: Contact development team
