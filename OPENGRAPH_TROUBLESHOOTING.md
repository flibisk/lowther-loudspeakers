# Open Graph Troubleshooting Guide

## Issue: OG Image/Title/Description Not Showing

If your Open Graph preview isn't showing when sharing links, follow these steps:

---

## ✅ Fixes Applied

1. **Added OG Image to Root Layout** - The default OG image is now configured
2. **Added Twitter Card Images** - Twitter previews should now work
3. **Added Favicon Configuration** - Browser icons are configured

---

## 🔍 Troubleshooting Steps

### 1. **Check Deployment Status**
```bash
# Wait 2-3 minutes after push for Vercel to finish building
# Check: https://vercel.com/your-project/deployments
```

✅ Deployment should show "Ready" status

---

### 2. **Clear Social Platform Cache**

Social platforms cache OG data aggressively. You must clear the cache:

#### **Facebook/Meta**
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter your URL: `https://your-site.com`
3. Click "Scrape Again" button
4. Check the preview

#### **LinkedIn**
1. Visit: https://www.linkedin.com/post-inspector/
2. Enter your URL
3. Click "Inspect"
4. Check the preview

#### **Twitter/X**
1. Visit: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Check the preview

#### **WhatsApp/iMessage**
- These apps cache VERY aggressively
- May take 24-48 hours to update
- Try sharing with a URL parameter: `?v=1` or `?refresh=true`

---

### 3. **Test with Different URLs**

Try these specific pages to verify OG is working:

```
Homepage: https://your-site.com/
Contact: https://your-site.com/contact
Blog: https://your-site.com/blog
Loudspeaker: https://your-site.com/loudspeakers/edilia
```

Each should show:
- ✅ Custom title
- ✅ Custom description
- ✅ 1200x630 image

---

### 4. **Verify Image Accessibility**

Check that your OG images are publicly accessible:

```
Direct image URL:
https://your-site.com/images/og/default.jpg
https://your-site.com/images/og/home.webp
```

Open these URLs in an incognito browser window - they should load immediately.

---

### 5. **Check HTML Source**

Visit your site and "View Page Source". Look for these meta tags:

```html
<!-- Should see these in <head> -->
<meta property="og:title" content="Lowther Loudspeakers - Handcrafted Excellence" />
<meta property="og:description" content="Discover the finest..." />
<meta property="og:image" content="https://your-site.com/images/og/default.jpg" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://your-site.com/" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://your-site.com/images/og/default.jpg" />
```

✅ If you see these tags, OG is configured correctly.

---

## 🐛 Common Issues

### Issue: "Image not found" in debugger
**Solution**: 
- Verify image exists at `/public/images/og/[filename]`
- Check file extension matches code (.jpg vs .webp vs .png)
- Ensure image is exactly 1200x630px

### Issue: "Content too large" warning
**Solution**:
- OG images should be < 300KB
- Compress images: https://tinypng.com/
- Convert to WebP or AVIF format

### Issue: Shows old/wrong image
**Solution**:
- Clear social platform cache (see step 2 above)
- Wait 24-48 hours for aggressive caches (WhatsApp)
- Add `?v=2` to URL when sharing

### Issue: Title/description are wrong
**Solution**:
- Check page-specific metadata in layouts
- Verify `metadata-config.ts` has correct content
- Clear cache and re-scrape

---

## 📱 Testing Checklist

After deploying, test on these platforms:

- [ ] **Facebook** - Share link, check preview
- [ ] **Twitter/X** - Tweet link, check card
- [ ] **LinkedIn** - Post link, check preview
- [ ] **WhatsApp** - Send link, check preview (may take 24hrs)
- [ ] **iMessage** - Send link, check preview (may take 24hrs)
- [ ] **Slack** - Share link, check unfurl
- [ ] **Discord** - Share link, check embed

---

## 🔧 Advanced Debugging

### View OG Tags via cURL
```bash
curl -I https://your-site.com | grep -i "og:"
```

### Check Response Headers
```bash
curl -I https://your-site.com/images/og/default.jpg
# Should return: HTTP/2 200
# Should have: content-type: image/jpeg
```

### Validate with Google
```
https://search.google.com/test/rich-results
Enter URL → Check for errors
```

---

## 🎯 Quick Fix Summary

1. ✅ **Wait 2-3 minutes** for Vercel deployment
2. ✅ **Clear cache** on social platform debuggers
3. ✅ **Check image URLs** are accessible
4. ✅ **View page source** to verify meta tags exist
5. ✅ **Test multiple pages** to isolate issue
6. ✅ **Add URL parameter** (`?v=1`) to force refresh

---

## 📊 Expected Results

### Homepage (`/`)
- **Title**: "Handcrafted Excellence | Lowther Loudspeakers"
- **Description**: "Discover the finest handcrafted loudspeakers from Lowther..."
- **Image**: `/images/og/home.webp`

### Contact (`/contact`)
- **Title**: "Contact Us | Lowther Loudspeakers"
- **Description**: "Get in touch with Lowther Loudspeakers. Visit our listening room..."
- **Image**: `/images/og/contact.jpg`

### Loudspeaker (`/loudspeakers/edilia`)
- **Title**: "Edilia – Tunable Quarter-Wave Mastery | Lowther"
- **Description**: "Edilia blends Lowther's full-range voice..."
- **Image**: `/images/og/edilia.jpg`

---

## 🆘 Still Not Working?

If after following all steps OG still doesn't work:

1. **Check Vercel environment variables**
   - `NEXT_PUBLIC_SITE_URL` should be: `https://lowtherloudspeakers.com`

2. **Verify Next.js version**
   - App Router (Next.js 13+) uses different metadata API
   - Check `next.config.ts` for issues

3. **Test locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # View source and check meta tags
   ```

4. **Contact support**
   - If issue persists after 48 hours
   - Provide URL and platform where it's failing
   - Share screenshot of debugger results

---

**Last Updated**: November 6, 2025  
**Status**: OG configuration complete, awaiting deployment and cache clearing








