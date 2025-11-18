# SEO & AEO Implementation Guide
## Lowther Loudspeakers

This guide explains the SEO/AEO system implemented for the Lowther Loudspeakers website.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Adding SEO to Pages](#adding-seo-to-pages)
4. [Adding Alt Text to Images](#adding-alt-text-to-images)
5. [Structured Data (JSON-LD)](#structured-data-json-ld)
6. [Running SEO Audit](#running-seo-audit)
7. [Utilities Reference](#utilities-reference)
8. [Best Practices](#best-practices)

---

## Overview

The SEO system provides:

- **Automatic metadata generation** from page content
- **Intelligent alt text generation** from image filenames
- **JSON-LD structured data** for Answer Engine Optimization (AEO)
- **SEO audit tool** to find missing metadata and suggest improvements
- **Modular architecture** for easy extension

All utilities are in `/src/lib/seo.ts`.

---

## Quick Start

### 1. Install tsx (if not already installed)

```bash
npm install -D tsx
```

### 2. Run the SEO audit

```bash
npm run seo-audit
```

This will scan all pages and images, identify issues, and suggest improvements.

---

## Adding SEO to Pages

### Method 1: Using the Helper (Recommended)

```typescript
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'PM6C Loudspeaker',
  description: 'Discover the Lowther PM6C - a handcrafted loudspeaker with exceptional clarity and presence.',
  keywords: ['PM6C', 'loudspeaker', 'full-range driver'],
  image: '/images/loudspeakers/pm6c/hero.jpg',
  url: '/loudspeakers/pm6c',
});
```

### Method 2: Auto-generation from Path

```typescript
import { generateMetaFromPath, generateSEOMetadata } from '@/lib/seo';

// Automatically generates title and description from URL path
const { title, description } = generateMetaFromPath('/loudspeakers/pm6c');

export const metadata = generateSEOMetadata({
  title,
  description,
  image: '/images/loudspeakers/pm6c/hero.jpg',
  url: '/loudspeakers/pm6c',
});
```

### Method 3: Auto-generation from H1

```typescript
import { generateMetaFromPath, generateSEOMetadata } from '@/lib/seo';

const h1Content = 'The Legendary PM6C Drive Unit';
const { title, description } = generateMetaFromPath('/loudspeakers/pm6c', h1Content);

export const metadata = generateSEOMetadata({
  title,
  description,
  image: '/images/loudspeakers/pm6c/hero.jpg',
  url: '/loudspeakers/pm6c',
});
```

### What Gets Generated

- Meta title with site name
- Meta description
- OpenGraph tags (og:title, og:description, og:image, etc.)
- Twitter Card tags
- Structured robots meta tags
- Keywords (with Lowther defaults)

---

## Adding Alt Text to Images

### Method 1: Manual Alt Text

```tsx
import Image from 'next/image';

<Image
  src="/images/loudspeakers/pm6c-heritage-horn.jpg"
  alt="Lowther PM6C Heritage horn loudspeaker with natural finish"
  width={800}
  height={600}
/>
```

### Method 2: Auto-generated Alt Text

```tsx
import Image from 'next/image';
import { generateAltText } from '@/lib/seo';

const imageSrc = '/images/loudspeakers/pm6c-heritage-horn.jpg';

<Image
  src={imageSrc}
  alt={generateAltText(imageSrc, 'product')}
  width={800}
  height={600}
/>
```

### How Alt Text Generation Works

The `generateAltText()` function:

1. Extracts the filename from the path
2. Removes extensions (.jpg, .png, etc.)
3. Identifies Lowther model codes (PM6C, DX3, PX4, etc.)
4. Capitalizes special terms (AlNiCo, Voigt, Hegeman)
5. Converts kebab-case to readable text
6. Adds context-specific descriptions

**Example transformations:**

```
pm4a-heritage-horn-natural-alnico.jpg
→ "Lowther PM4A Heritage horn loudspeaker with natural AlNiCo driver"

dx3-drive-unit-gloss-black.webp
→ "Lowther DX3 Drive unit gloss black"

px4-amplifier-valve-chassis.jpg
→ "Lowther PX4 Amplifier valve chassis"
```

### Context Options

```typescript
generateAltText(filename, 'hero')    // Adds "- premium handcrafted audio"
generateAltText(filename, 'gallery') // Adds "detailed view"
generateAltText(filename, 'product') // Adds "- available now"
generateAltText(filename)            // No suffix
```

---

## Structured Data (JSON-LD)

### Organization Schema (Site-wide)

Already implemented in `/src/app/layout.tsx`.

This provides rich information about Lowther Loudspeakers to search engines and answer engines.

### Product Schema

Add to product pages:

```tsx
import { generateStructuredData } from '@/lib/seo';

export default function PM6CPage() {
  const productSchema = generateStructuredData('Product', {
    name: 'PM6C Drive Unit',
    description: 'Premium full-range driver with AlNiCo magnet',
    images: [
      '/images/drive-units/pm6c-front.jpg',
      '/images/drive-units/pm6c-side.jpg',
    ],
    price: '499.00',
    currency: 'GBP',
    inStock: true,
    rating: {
      value: 4.9,
      count: 47,
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      {/* Page content */}
    </>
  );
}
```

### Article Schema

Add to blog posts:

```tsx
import { generateStructuredData } from '@/lib/seo';

export default function BlogPostPage() {
  const articleSchema = generateStructuredData('Article', {
    title: 'The History of Lowther Drive Units',
    description: 'A journey through 90 years of innovation',
    image: '/images/blog/history-hero.jpg',
    author: 'Lowther Team',
    publishedTime: '2025-01-15',
    modifiedTime: '2025-01-20',
    url: '/blog/history-of-lowther',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {/* Article content */}
    </>
  );
}
```

---

## Running SEO Audit

### Run the Audit

```bash
npm run seo-audit
```

### What It Checks

✓ Pages with missing metadata exports  
✓ Pages not using `generateSEOMetadata()` helper  
✓ Pages without structured data  
✓ Images without alt text  
✓ Opportunities for improvement

### Audit Output Example

```
═══════════════════════════════════════════
   Lowther Loudspeakers SEO Audit Report   
═══════════════════════════════════════════

Summary:
  Pages with issues: 3
  Images with issues: 0

📄 Page Issues:

/src/app/services/oem-opportunities/page.tsx
  Issues:
    ✗ Missing metadata export
  Suggestions:
    → Title: "OEM Opportunities"
    → Description: "OEM Opportunities - Lowther Loudspeakers: Premium handcrafted audio equipment and services for audiophiles worldwide."
    → Consider adding JSON-LD structured data

═══════════════════════════════════════════

Next Steps:
  1. Add missing metadata using generateSEOMetadata()
  2. Add alt text to images using generateAltText()
  3. Add JSON-LD structured data where appropriate
  4. Re-run this audit with: npm run seo-audit
```

---

## Utilities Reference

### `generateSEOMetadata(options)`

Generates comprehensive Next.js metadata object.

**Options:**
- `title` (string, optional): Page title
- `description` (string, optional): Meta description
- `keywords` (string[], optional): Additional keywords
- `image` (string, optional): OG image path
- `url` (string, optional): Canonical URL path
- `type` ('website' | 'article', optional): OpenGraph type
- `publishedTime` (string, optional): ISO date string
- `modifiedTime` (string, optional): ISO date string
- `author` (string, optional): Author name

**Returns:** `Metadata` object

---

### `generateAltText(filename, context?)`

Generates descriptive alt text from filename.

**Parameters:**
- `filename` (string): Image filename or path
- `context` ('hero' | 'gallery' | 'product', optional): Context for suffix

**Returns:** `string` - Descriptive alt text

**Example:**
```typescript
generateAltText('pm6c-drive-unit-alnico.jpg', 'product')
// → "Lowther PM6C Drive unit alnico - available now"
```

---

### `generateMetaFromPath(path, h1Content?)`

Auto-generates title and description from URL path or H1 content.

**Parameters:**
- `path` (string): URL path (e.g., '/loudspeakers/pm6c')
- `h1Content` (string, optional): H1 text from the page

**Returns:** `{ title: string; description: string }`

**Example:**
```typescript
generateMetaFromPath('/loudspeakers/pm6c')
// → { 
//     title: "PM6C", 
//     description: "Discover the PM6C - a handcrafted Lowther loudspeaker..." 
//   }
```

---

### `generateStructuredData(type, data)`

Generates JSON-LD structured data.

**Parameters:**
- `type` ('Product' | 'Article' | 'Organization'): Schema type
- `data` (object): Type-specific data

**Returns:** JSON-LD object

**Product Data:**
- `name`, `description`, `images`, `price`, `currency`, `inStock`, `rating`

**Article Data:**
- `title`, `description`, `image`, `author`, `publishedTime`, `modifiedTime`, `url`

**Organization Data:**
- Auto-populated with Lowther details

---

## Best Practices

### 1. Metadata

- ✅ **Do** use `generateSEOMetadata()` for consistency
- ✅ **Do** provide unique titles and descriptions for each page
- ✅ **Do** keep titles under 60 characters
- ✅ **Do** keep descriptions between 120-160 characters
- ❌ **Don't** duplicate metadata across pages
- ❌ **Don't** keyword stuff

### 2. Alt Text

- ✅ **Do** describe what's in the image
- ✅ **Do** include product names/models when relevant
- ✅ **Do** keep alt text concise (under 125 characters)
- ❌ **Don't** start with "Image of..." or "Picture of..."
- ❌ **Don't** leave alt text empty

### 3. Images

- ✅ **Do** use descriptive filenames (pm6c-hero.jpg ✓, IMG_1234.jpg ✗)
- ✅ **Do** use kebab-case for filenames
- ✅ **Do** include model names in filenames
- ✅ **Do** use modern formats (WebP, AVIF) when possible

### 4. Structured Data

- ✅ **Do** add Product schema to product pages
- ✅ **Do** add Article schema to blog posts
- ✅ **Do** test with Google's Rich Results Test
- ❌ **Don't** add multiple schema types to one page

### 5. Content

- ✅ **Do** write for humans first, search engines second
- ✅ **Do** use proper heading hierarchy (H1 → H2 → H3)
- ✅ **Do** include relevant keywords naturally
- ❌ **Don't** hide text or links
- ❌ **Don't** use clickbait titles

---

## Testing & Validation

### Test Structured Data

Use Google's Rich Results Test:
https://search.google.com/test/rich-results

### Test Open Graph

Use Facebook's Sharing Debugger:
https://developers.facebook.com/tools/debug/

### Test Twitter Cards

Use Twitter's Card Validator:
https://cards-dev.twitter.com/validator

---

## File Organization

```
lowther-loudspeakers/
├── src/
│   ├── lib/
│   │   └── seo.ts              # SEO utilities
│   └── app/
│       ├── layout.tsx           # Organization schema
│       └── [pages]/
│           └── page.tsx         # Individual page metadata
├── scripts/
│   └── seo-audit.ts            # SEO audit tool
├── docs/
│   ├── SEO_GUIDE.md            # This file
│   └── ALT_TEXT_GUIDE.md       # Alt text guide
└── package.json                # Contains "seo-audit" script
```

---

## Future Enhancements

The system is designed to be modular. Future additions could include:

1. **CMS Integration**: Connect to headless CMS for dynamic metadata
2. **AI API Integration**: Use OpenAI/Claude for smarter descriptions
3. **Multilingual Support**: Generate metadata in multiple languages
4. **Automatic Image Optimization**: Compress and convert images
5. **Sitemap Generation**: Auto-generate XML sitemaps
6. **Analytics Integration**: Track SEO performance

---

## Support & Questions

For questions about SEO implementation:
- Check this guide first
- Run `npm run seo-audit` for automated suggestions
- Review `/src/lib/seo.ts` for implementation details

---

**Last Updated:** January 2025  
**Version:** 1.0.0













