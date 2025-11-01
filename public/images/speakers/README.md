# 🎵 Speaker Images Directory Structure

## 📁 Folder Organization

Each speaker has its own directory with 4 subdirectories for different image types:

### 🏠 Hero Images (`/hero/`)
- **Purpose**: Main banner/hero images for speaker pages
- **Format**: High-resolution landscape images
- **Usage**: Page headers, featured sections
- **Recommended**: 1920x1080px or larger
- **Naming**: `hero-1.jpg`, `hero-2.jpg`, etc.

### 🖼️ Gallery Images (`/gallery/`)
- **Purpose**: Image galleries, carousels, lightboxes
- **Format**: Various orientations and compositions
- **Usage**: Product galleries, portfolio sections
- **Recommended**: 1200x800px or larger
- **Naming**: `gallery-1.jpg`, `gallery-2.jpg`, etc.

### 🔍 Detail Images (`/details/`)
- **Purpose**: Close-up shots, craftsmanship details
- **Format**: High-resolution detail shots
- **Usage**: Detail pages, zoom functionality
- **Recommended**: 800x800px or larger
- **Naming**: `detail-1.jpg`, `detail-2.jpg`, etc.

### ⚙️ Technical Images (`/technical/`)
- **Purpose**: Technical diagrams, specifications, measurements
- **Format**: Diagrams, technical drawings, specifications
- **Usage**: Technical documentation, specs pages
- **Recommended**: 1200x800px or larger
- **Naming**: `technical-1.jpg`, `technical-2.jpg`, etc.

## 📋 Speaker Directories

- `/quarter-wave/` - The Quarter Wave
- `/edilia/` - The Edilia  
- `/hegeman/` - The Hegeman
- `/acousta-117/` - Acousta 117
- `/almira/` - The Almira
- `/tp2/` - The TP2
- `/audiovector/` - The AudioVector
- `/voigt-horn/` - The Voigt Horn

## 🎯 Usage in Database

When populating the speaker database, reference images like this:

```json
{
  "images": {
    "hero": "/images/speakers/quarter-wave/hero/hero-1.jpg",
    "gallery": [
      "/images/speakers/quarter-wave/gallery/gallery-1.jpg",
      "/images/speakers/quarter-wave/gallery/gallery-2.jpg"
    ],
    "details": [
      "/images/speakers/quarter-wave/details/detail-1.jpg",
      "/images/speakers/quarter-wave/details/detail-2.jpg"
    ],
    "technical": [
      "/images/speakers/quarter-wave/technical/technical-1.jpg"
    ]
  }
}
```

## 📝 Image Guidelines

### ✅ Best Practices:
- Use high-quality, professional photography
- Maintain consistent lighting and styling
- Include multiple angles and compositions
- Optimize file sizes for web (compress but maintain quality)
- Use descriptive filenames
- Include both landscape and portrait orientations where appropriate

### 🚫 Avoid:
- Low-resolution images
- Inconsistent styling between speakers
- Overly large file sizes
- Generic or stock photography
- Poor lighting or composition
