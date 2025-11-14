# Post Domain Linking Checklist

## After Linking lowtherloudspeakers.com to Vercel

Follow these steps to ensure everything works perfectly:

---

## ✅ Step 1: Wait for DNS Propagation (5-60 minutes)

After linking your domain in Vercel:
- Wait for SSL certificate to provision
- Check that `https://lowtherloudspeakers.com` loads
- Verify it redirects to HTTPS (not HTTP)

**Vercel will show "Ready" when DNS is propagated**

---

## ✅ Step 2: Verify Metadata is Live

### Test in Browser:
1. Visit: `https://lowtherloudspeakers.com`
2. Right-click → "View Page Source"
3. Search for: `og:image`

**Should see:**
```html
<meta property="og:image" content="https://lowtherloudspeakers.com/images/og/home.webp">
<meta property="og:title" content="Handcrafted Excellence | Lowther Loudspeakers">
<meta property="og:description" content="Discover the finest...">
```

### Test Image Directly:
Open: `https://lowtherloudspeakers.com/images/og/home.webp`
- Should load immediately
- Should be 1200x630px

---

## ✅ Step 3: Clear Social Media Cache

### Facebook/Meta/WhatsApp:
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter: `https://lowtherloudspeakers.com`
3. Click "Debug"
4. Click **"Scrape Again"** button
5. Verify preview shows your image

### LinkedIn:
1. Visit: https://www.linkedin.com/post-inspector/
2. Enter: `https://lowtherloudspeakers.com`
3. Click "Inspect"

### Twitter/X:
1. Visit: https://cards-dev.twitter.com/validator
2. Enter: `https://lowtherloudspeakers.com`

---

## ✅ Step 4: Test Multiple Pages

Test these specific URLs to ensure each shows unique metadata:

```
Homepage:
https://lowtherloudspeakers.com/

Contact:
https://lowtherloudspeakers.com/contact

Blog:
https://lowtherloudspeakers.com/blog

Edilia Speaker:
https://lowtherloudspeakers.com/loudspeakers/edilia

Philharmonic Collection:
https://lowtherloudspeakers.com/collection/philharmonic
```

**Each should show:**
- ✅ Unique title
- ✅ Unique description
- ✅ Unique OG image

---

## ✅ Step 5: Test Social Sharing

### Facebook:
- Share the link in a post (private or public)
- Check preview before posting

### iMessage/WhatsApp:
- Send link to yourself or friend
- Preview should appear within 5 minutes

### Twitter:
- Tweet the link
- Card should appear automatically

---

## ✅ Step 6: Test Favicon

### Browser Tab:
- Open `https://lowtherloudspeakers.com`
- Check favicon appears in browser tab
- Bookmark the page - favicon should show

### iOS (Apple Touch Icon):
- Open in Safari on iPhone/iPad
- Tap Share → "Add to Home Screen"
- Icon should appear on home screen

---

## ✅ Step 7: Submit to Google

### Google Search Console:
1. Add property: `https://lowtherloudspeakers.com`
2. Verify ownership (DNS or HTML method)
3. Submit sitemap: `https://lowtherloudspeakers.com/sitemap.xml`

### Request Indexing:
- Request indexing for key pages
- Homepage
- Product pages
- Collection pages

---

## ✅ Step 8: Monitor Sitelinks

**Timeline:** 2-6 weeks for Google Sitelinks to appear

Google will automatically generate sitelinks based on:
- Your WebSite schema (✅ Already configured)
- Site structure
- User behavior
- Internal linking

**Check periodically:**
- Search "Lowther Loudspeakers" in Google
- Look for quicklinks below main result
- Monitor in Google Search Console

---

## 🔧 Troubleshooting

### If OG preview doesn't show:
1. Clear cache (Facebook debugger "Scrape Again")
2. Wait 5 minutes and try again
3. Check image loads directly
4. Verify meta tags in page source

### If favicon doesn't show:
1. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Clear browser cache
3. Try incognito/private window

### If sitelinks don't appear (after 6 weeks):
1. Check Google Search Console for errors
2. Verify internal linking structure
3. Ensure pages are indexed
4. Build brand search volume

---

## 📊 Expected Timeline

| Item | When to Check | Expected Result |
|------|---------------|-----------------|
| Domain loads | Immediately | ✅ HTTPS site loads |
| Metadata in source | Immediately | ✅ Meta tags present |
| Favicon | Immediately | ✅ Shows in browser |
| Facebook OG | After cache clear | ✅ Preview shows |
| iMessage preview | 5-60 minutes | ✅ Preview shows |
| Google indexing | 1-7 days | ✅ Pages indexed |
| Google Sitelinks | 2-6 weeks | ✅ Sitelinks appear |

---

## 🎯 Success Criteria

After completing all steps, you should have:

- ✅ Site loads on custom domain with HTTPS
- ✅ All pages have unique metadata
- ✅ OG images show in social previews (45 pages)
- ✅ Favicons show in browsers and iOS
- ✅ Site submitted to Google Search Console
- ✅ Sitemap accessible and submitted
- ✅ WebSite schema configured (for future sitelinks)

---

## 📝 Quick Reference Links

### Testing Tools:
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
- **Twitter Validator**: https://cards-dev.twitter.com/validator
- **Google Rich Results**: https://search.google.com/test/rich-results
- **Google Search Console**: https://search.google.com/search-console

### Your URLs to Test:
- Homepage: `https://lowtherloudspeakers.com/`
- Contact: `https://lowtherloudspeakers.com/contact`
- Collections: `https://lowtherloudspeakers.com/collection/philharmonic`
- Speakers: `https://lowtherloudspeakers.com/loudspeakers/edilia`

---

## 💡 Pro Tips

1. **Test in incognito mode** to avoid browser cache
2. **Clear cache on each platform** before testing
3. **Wait 5 minutes** between domain linking and testing
4. **Save screenshots** of working OG previews
5. **Document any issues** for troubleshooting

---

**Ready to Link Domain?** Follow Vercel's domain setup guide, then come back to this checklist!

**Estimated Total Time:** 30-45 minutes (plus DNS propagation wait)

---

**Last Updated:** November 6, 2025  
**Status:** Ready for domain linking







