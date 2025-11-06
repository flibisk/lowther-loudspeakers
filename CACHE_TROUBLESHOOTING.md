# Open Graph Cache Troubleshooting

## 🚨 Your Issue: Cache, Not Configuration

Your metadata is configured correctly (favicons work proves deployment is live). The issue is **cached data** on Facebook and iMessage.

---

## ✅ STEP-BY-STEP FIX

### Step 1: Clear Facebook Cache (DO THIS FIRST)

1. **Go to Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Enter your EXACT Vercel URL**: `https://your-project.vercel.app`
3. **Click "Debug"** button
4. **Scroll down** and click **"Scrape Again"** button (IMPORTANT!)
5. **Wait 5-10 seconds** for it to re-fetch
6. **Check the preview** at the bottom

**Expected Result:**
- ✅ Title: "Handcrafted Excellence | Lowther Loudspeakers"
- ✅ Description: "Discover the finest handcrafted loudspeakers..."
- ✅ Image: Should show your OG image

**If it still shows wrong data:**
- Clear your Facebook app cache (Settings → Browser → Clear Data)
- Try in Facebook's web browser, not the app
- Wait 5 minutes and try again

---

### Step 2: Test Different Pages

Try these specific URLs in the debugger:

```
Homepage:
https://your-site.vercel.app/

Contact page:
https://your-site.vercel.app/contact

Edilia speaker:
https://your-site.vercel.app/loudspeakers/edilia
```

Each should show a **different** OG image and description.

---

### Step 3: iMessage Fix (24-48 Hour Cache)

**Bad News:** iMessage caches for 24-48 hours. There's no way to force refresh.

**Workarounds:**

1. **Add a query parameter** (sometimes works):
   ```
   Send: https://your-site.vercel.app/?v=2
   Instead of: https://your-site.vercel.app/
   ```

2. **Use a URL shortener** (forces new cache):
   - Bit.ly
   - TinyURL
   - Your own domain redirect

3. **Wait 24 hours** (unfortunately, this is sometimes the only way)

**Why?** Apple caches link previews on their servers for performance. Once cached, they don't check again for ~24 hours.

---

## 🔍 Verify Metadata is Working

### Quick Test: View Page Source

1. **Open your Vercel site** in a browser
2. **Right-click** → "View Page Source" (or Ctrl+U / Cmd+U)
3. **Search for** (Ctrl+F / Cmd+F): `og:image`

**You should see these tags:**
```html
<meta property="og:title" content="Handcrafted Excellence | Lowther Loudspeakers">
<meta property="og:description" content="Discover the finest handcrafted loudspeakers from Lowther...">
<meta property="og:image" content="https://your-site.vercel.app/images/og/home.webp">
<meta property="og:type" content="website">
<meta property="og:url" content="https://your-site.vercel.app/">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://your-site.vercel.app/images/og/home.webp">
```

**If you see these tags** → Metadata is working! It's just a cache issue.

**If you DON'T see these tags** → There's a build issue (let me know).

---

## 🧪 Test Image URL Directly

**Copy the OG image URL from the meta tag** and open it directly in your browser:

```
https://your-site.vercel.app/images/og/home.webp
```

**Should:**
- ✅ Load immediately
- ✅ Show image at 1200x630px
- ✅ Be under 300KB

**If the image doesn't load:**
- Check file exists in `/public/images/og/`
- Check file extension matches (.webp vs .jpg vs .png)
- Verify Vercel deployment completed

---

## ⚡ Platform-Specific Cache Times

| Platform | Cache Duration | Force Refresh? |
|----------|----------------|----------------|
| Facebook | Hours to days | ✅ Yes - Use debugger |
| WhatsApp | Hours to days | ✅ Yes - Facebook debugger |
| LinkedIn | Minutes to hours | ✅ Yes - Post inspector |
| Twitter/X | Minutes | ✅ Yes - Card validator |
| iMessage | **24-48 hours** | ❌ No - Must wait or use ?v=2 |
| Slack | Minutes to hours | ⚠️ Sometimes - Re-paste link |
| Discord | Minutes | ✅ Yes - Re-paste link |

---

## 🎯 Most Likely Causes (In Order)

### 1. **Facebook Cache** (90% of cases)
- **Fix**: Use Facebook debugger → "Scrape Again"
- **Time**: Immediate

### 2. **iMessage Cache** (If testing on iPhone)
- **Fix**: Wait 24 hours OR use `?v=2` parameter
- **Time**: 24-48 hours

### 3. **Old Deployment** (5% of cases)
- **Fix**: Check Vercel dashboard shows "Ready"
- **Time**: 2-3 minutes after push

### 4. **Wrong URL** (4% of cases)
- **Fix**: Make sure using Vercel URL, not localhost
- **Time**: Immediate

### 5. **Image Path Wrong** (1% of cases)
- **Fix**: Check image loads directly in browser
- **Time**: Immediate

---

## 🆘 Still Not Working?

### Checklist:

- [ ] Vercel deployment shows "Ready" status
- [ ] Waited at least 5 minutes after deployment
- [ ] Used Facebook debugger and clicked "Scrape Again"
- [ ] Tested the OG image URL directly (loads in browser)
- [ ] Checked page source (meta tags are present)
- [ ] Tested with `?v=2` parameter for iMessage
- [ ] Tried different page (homepage, /contact, etc.)

### If ALL checked and still not working:

1. **Send me:**
   - Your exact Vercel URL
   - Screenshot of Facebook debugger results
   - Screenshot of page source (showing meta tags)

2. **Try:**
   - Different browser (incognito mode)
   - Desktop instead of mobile
   - Wait 24 hours (for aggressive caches)

---

## 💡 Pro Tips

1. **Always use Facebook debugger** before sharing new pages
2. **iMessage ALWAYS takes 24hrs** - this is normal, not a bug
3. **Query parameters help**: `?v=1`, `?v=2`, `?refresh=true`
4. **Test in incognito** to avoid browser cache
5. **Different pages = different images** - test multiple URLs

---

## 📱 Expected Timeline

| Action | Time |
|--------|------|
| Deploy to Vercel | 2-3 minutes |
| Facebook cache clear | Immediate (with debugger) |
| iMessage cache clear | **24-48 hours** |
| WhatsApp cache clear | 5-10 minutes (with debugger) |
| LinkedIn cache clear | 5-10 minutes (with inspector) |

---

**Bottom Line:** Your metadata IS working. Social platforms are showing OLD cached data. Use the Facebook debugger to force refresh!

**Last Updated:** November 6, 2025

