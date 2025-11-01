# 🖼️ Dynamic Image System Guide

## 🎯 Overview

The new image system automatically loads all images from speaker folders without requiring exact paths. Just drop images into the appropriate folders and they'll be available for use!

## 📁 How It Works

### 1. **Drop Images in Folders**
Simply place images in the appropriate folders:
```
public/images/speakers/quarterwave/
├── hero/
│   ├── hero-1.jpg
│   ├── hero-2.webp
│   └── hero-3.png
├── gallery/
│   ├── gallery-1.jpg
│   ├── gallery-2.webp
│   └── gallery-3.avif
├── details/
│   ├── detail-1.jpg
│   └── detail-2.png
└── technical/
    ├── technical-1.jpg
    └── technical-2.pdf
```

### 2. **Supported File Types**
- **Images**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`
- **Documents**: `.pdf` (for technical drawings)

### 3. **Automatic Discovery**
The system automatically finds all images in each folder and makes them available via API.

## 🚀 Usage Examples

### **Create a Gallery Component**
```tsx
import { SpeakerGallery } from '@/components/speaker-gallery';

// Automatically loads all gallery images for quarterwave
<SpeakerGallery speakerSlug="quarterwave" category="gallery" />

// Load technical images
<SpeakerGallery speakerSlug="quarterwave" category="technical" />

// Load detail images with thumbnails
<SpeakerGallery 
  speakerSlug="quarterwave" 
  category="details" 
  showThumbnails={true}
/>
```

### **Use the Hook Directly**
```tsx
import { useSpeakerImages } from '@/hooks/use-speaker-images';

function MyComponent() {
  const { images, loading, getRandomImage, getFirstImage } = useSpeakerImages('quarterwave');
  
  if (loading) return <div>Loading...</div>;
  
  const heroImage = getFirstImage('hero');
  const randomGalleryImage = getRandomImage('gallery');
  
  return (
    <div>
      {heroImage && <img src={heroImage} alt="Hero" />}
      {randomGalleryImage && <img src={randomGalleryImage} alt="Gallery" />}
    </div>
  );
}
```

### **Server-Side Usage**
```tsx
import { loadSpeakerImages } from '@/lib/utils/image-loader';

// In a page or API route
const images = await loadSpeakerImages('quarterwave');
const heroImages = images.hero; // Array of hero image paths
const galleryImages = images.gallery; // Array of gallery image paths
```

## 🎨 Gallery Features

### **Automatic Features**
- ✅ **Image Discovery**: Finds all images in folders
- ✅ **File Type Support**: Handles multiple image formats
- ✅ **Responsive Design**: Adapts to different screen sizes
- ✅ **Lightbox**: Click to view full-size images
- ✅ **Navigation**: Previous/next buttons
- ✅ **Thumbnails**: Optional thumbnail strip
- ✅ **Image Counter**: Shows current position
- ✅ **Loading States**: Handles loading and errors gracefully

### **Customization Options**
```tsx
<SpeakerGallery 
  speakerSlug="quarterwave"
  category="gallery"           // 'gallery' | 'details' | 'technical'
  showThumbnails={true}        // Show thumbnail strip
  autoPlay={false}             // Auto-advance slideshow
/>
```

## 🔧 API Endpoints

### **Get All Images for a Speaker**
```
GET /api/speakers/[slug]/images
```

**Response:**
```json
{
  "hero": ["/images/speakers/quarterwave/hero/hero-1.jpg"],
  "gallery": [
    "/images/speakers/quarterwave/gallery/gallery-1.jpg",
    "/images/speakers/quarterwave/gallery/gallery-2.webp"
  ],
  "details": ["/images/speakers/quarterwave/details/detail-1.jpg"],
  "technical": ["/images/speakers/quarterwave/technical/technical-1.jpg"]
}
```

## 📝 Database Integration

### **No Hardcoded Paths Needed**
Your speaker database no longer needs hardcoded image paths:

```json
{
  "quarterwave": {
    "id": "quarterwave",
    "title": "Quarterwave",
    "slug": "quarterwave",
    "feeling": "discreet. architectural.",
    "image": "/images/card-images/card-image-Quarterwave.webp",
    "href": "/speakers/quarterwave"
    // No need for hardcoded gallery/detail/technical paths!
  }
}
```

### **Dynamic Image Loading**
Images are loaded dynamically based on what's in the folders:
- **Hero images**: `/public/images/speakers/[slug]/hero/`
- **Gallery images**: `/public/images/speakers/[slug]/gallery/`
- **Detail images**: `/public/images/speakers/[slug]/details/`
- **Technical images**: `/public/images/speakers/[slug]/technical/`

## 🎯 Benefits

### ✅ **Easy Management**
- Drop images in folders - no path management needed
- Support for multiple file formats
- Automatic discovery and organization

### ✅ **Flexible Usage**
- Use any number of images per category
- Mix and match file formats
- Easy to add/remove images

### ✅ **Developer Friendly**
- Simple API and hooks
- TypeScript support
- Error handling built-in

### ✅ **User Experience**
- Fast loading with proper image optimization
- Responsive design
- Professional gallery with lightbox

## 🚀 Getting Started

1. **Add Images**: Drop images into the appropriate speaker folders
2. **Use Components**: Import and use `SpeakerGallery` component
3. **Customize**: Adjust props for different behaviors
4. **Scale**: Add more speakers by creating new folders

## 💡 Pro Tips

### **Image Organization**
- Use descriptive filenames: `hero-room-shot.jpg`, `detail-driver-closeup.jpg`
- Keep file sizes reasonable (compress for web)
- Use consistent aspect ratios within each category

### **Performance**
- Images are automatically optimized by Next.js
- Lazy loading is built-in
- Responsive images are generated automatically

### **SEO**
- Alt text is automatically generated
- Images are properly structured for search engines
- Technical images can include PDFs for detailed specifications

---

**Ready to use!** Just drop images in the folders and start building galleries! 🎉
