# Favicon & App Icons Guide

## Required Files

You need to create the following icon files and place them in the `/public` directory:

### 1. **favicon.ico** (32x32)
- Standard favicon for browsers
- ICO format
- 32x32 pixels

### 2. **favicon-16x16.png**
- Small favicon
- PNG format
- 16x16 pixels

### 3. **favicon-32x32.png**
- Standard favicon
- PNG format
- 32x32 pixels

### 4. **apple-touch-icon.png** (180x180)
- iOS home screen icon (webclip)
- PNG format
- 180x180 pixels
- Will be used when users add your site to their iPhone/iPad home screen

---

## Design Guidelines

### Favicon (16x16, 32x32)
- Use the Lowther "L" logo or monogram
- Keep it simple - favicons are tiny!
- High contrast colors
- Test on light and dark backgrounds

### Apple Touch Icon (180x180)
- Use full Lowther logo or brand mark
- Add padding around edges (safe area)
- Background color: White or brand color (#c59862)
- No transparency (iOS adds its own mask)

---

## How to Create

### Option 1: Use a Favicon Generator
1. Visit: https://realfavicongenerator.net/
2. Upload your logo (SVG or high-res PNG)
3. Configure settings
4. Download and place in `/public`

### Option 2: Manual Creation
1. Create a 512x512px PNG with your logo
2. Use Photoshop/Figma to export:
   - 16x16px → `favicon-16x16.png`
   - 32x32px → `favicon-32x32.png`
   - 32x32px → `favicon.ico` (convert to ICO)
   - 180x180px → `apple-touch-icon.png`

---

## File Locations

Place all files directly in `/public`:

```
/public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
└── apple-touch-icon.png
```

---

## Testing

After adding the files:

1. **Clear browser cache**
2. **Visit your site** - favicon should appear in:
   - Browser tab
   - Bookmarks
   - History
3. **Test iOS webclip**:
   - Open site in Safari on iPhone
   - Tap Share → Add to Home Screen
   - Check icon appearance

---

## Quick Tips

- **Favicon.ico**: Can contain multiple sizes (16x16 and 32x32)
- **Apple Touch Icon**: iOS automatically adds rounded corners and shine
- **High contrast**: Make sure icon is visible on all backgrounds
- **Consistent branding**: Use same colors/style as your logo

---

## Current Status

⚠️ **MISSING** - Please create and add these 4 icon files:
- [ ] `favicon.ico`
- [ ] `favicon-16x16.png`
- [ ] `favicon-32x32.png`
- [ ] `apple-touch-icon.png`

---

## References

- **Favicon Generator**: https://realfavicongenerator.net/
- **Apple Touch Icon Spec**: https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Next.js Icons Documentation**: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons







