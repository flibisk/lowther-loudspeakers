# Open Graph Images

This folder contains Open Graph (OG) images for social media sharing and search engine optimization.

## Image Specifications

**Required Dimensions:**
- Width: 1200px
- Height: 630px
- Aspect Ratio: 1.91:1
- Format: JPG or PNG (WebP for modern browsers)
- File Size: < 300KB (recommended)

## File Naming Convention

All OG images should be named using the page path with dashes:
- Homepage: `home.jpg`
- Contact page: `contact.jpg`
- Blog page: `blog.jpg`
- Brand pages: `brand-[slug].jpg`
- Collections: `collection-[slug].jpg`
- Loudspeakers: `loudspeaker-[slug].jpg`

## Current Placeholders

Replace the `.placeholder` files with actual `.jpg` or `.webp` images:

### Core Pages
- [ ] `home.jpg` - Homepage hero
- [ ] `contact.jpg` - Contact page
- [ ] `blog.jpg` - Blog listing page
- [ ] `reviews.jpg` - Reviews page
- [ ] `listen.jpg` - Listen page
- [ ] `warranty.jpg` - Warranty page
- [ ] `catalogue.jpg` - Catalogue page
- [ ] `verify.jpg` - Authenticity checker
- [ ] `build-a-lowther.jpg` - Build guide
- [ ] `book-appointment.jpg` - Appointments
- [ ] `ambassador.jpg` - Ambassador program

### Brand Pages
- [ ] `brand-our-craft.jpg`
- [ ] `brand-handcrafted.jpg`
- [ ] `brand-lasting-legacy.jpg`
- [ ] `brand-paul-voigt-era.jpg`
- [ ] `brand-donald-chave-era.jpg`

### History
- [ ] `history.jpg`

### Categories
- [ ] `category-loudspeakers.jpg`
- [ ] `category-drive-units.jpg`
- [ ] `category-cables.jpg`

### Collections
- [ ] `collection-grand-opera.jpg`
- [ ] `collection-philharmonic.jpg`
- [ ] `collection-concert.jpg`
- [ ] `collection-sinfonia.jpg`

### Services
- [ ] `services-oem-opportunities.jpg`
- [ ] `services-listening-rooms.jpg`
- [ ] `services-refurbishments-upgrades.jpg`

### Ensemble
- [ ] `ensemble-px4-amplifier.jpg`
- [ ] `ensemble-reference-cables.jpg`
- [ ] `ensemble-phase-plugs.jpg`
- [ ] `ensemble-lowther-badges.jpg`
- [ ] `ensemble-residential-system-design.jpg`
- [ ] `ensemble-commercial-system-design.jpg`

### Products
- [ ] `products.jpg` - All products listing

### Landings
- [ ] `landings-qw-a.jpg`
- [ ] `landings-qw-b.jpg`

### Dynamic Pages (use default)
- Loudspeakers: Use individual speaker images or default
- Blog posts: Use featured image or default

## Design Guidelines

### Visual Style
- High-quality product photography
- Lowther brand colors (#c59862 gold accent)
- Clean, professional aesthetic
- Consistent typography (HV Muse for display)

### Text Overlay
- Keep text minimal and readable
- Use white text on dark images or vice versa
- Include Lowther logo (top left or top right)
- Page title or tagline

### Content Requirements
- Show key products or hero imagery
- Maintain brand consistency
- Ensure mobile preview looks good (Facebook, Twitter, LinkedIn)
- Test with Open Graph debuggers before finalizing

## Testing Your Images

After adding images, test them with these tools:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
4. **Open Graph Checker**: https://www.opengraph.xyz/

## Default Fallback

If a page doesn't have a specific OG image, the system will use:
`/images/og/default.jpg`

Make sure this default image represents the Lowther brand well as it will be used for any new pages until specific images are created.

## Quick Replace Commands

To replace a placeholder with your actual image:

```bash
# Example: Replace homepage OG image
cp your-new-image.jpg public/images/og/home.jpg

# Or using drag-and-drop in VS Code
# Just drag your image file into this folder and rename it
```

## Maintenance

When adding new pages to the site:
1. Create a corresponding OG image following the naming convention
2. Update the page's metadata to reference the image
3. Test with OG debuggers
4. Update this README checklist


