# 🎵 Drive Units Database Guide

## 📋 Overview
This guide explains how to populate the drive units (instruments) database with comprehensive information for each Lowther drive unit collection. The database is structured to provide rich metadata for SEO, product pages, and AI assistance.

## 🏗️ Database Structure

### 📁 File Location
`/src/lib/data/drive-units-database.json`

### 🎯 Purpose
- **SEO Optimization**: Rich metadata for search engines
- **Product Information**: Detailed specifications and descriptions
- **AI Assistance**: Comprehensive data for generating content
- **Marketing**: Compelling copy and positioning information

## 📝 Database Structure

### **Collections Level:**
```json
{
  "id": "concert-collection",
  "title": "Concert Collection",
  "slug": "concert-collection",
  "feeling": "timeless. foundational.",
  "description": "Short description of the collection",
  "long_description": "Detailed description of the collection",
  "images": {
    "base": "/images/drive-units/concert-collection/",
    "hero": "hero/",
    "gallery": "gallery/",
    "details": "details/",
    "technical": "technical/"
  },
  "instruments": [...]
}
```

### **Individual Instruments:**
```json
{
  "id": "pm4a-concert",
  "title": "PM4A Concert",
  "slug": "pm4a-concert",
  "frame_size": "8 inch",
  "magnet_type": "Alnico",
  "voice_coil": "Aluminium/Silver",
  "impedance_options": [8, 15],
  "metal_work": "High Grade EN1A Lead Free Steel",
  "clean_air_efficiency": "98dB",
  "image": "/images/drive-units/concert-collection/hero/pm4a-concert.jpg",
  "price_display": "From £1,030*",
  "price_value_gbp": 1030.0
}
```

## 🎵 Collections Overview

### **1. Concert Collection**
- **Feeling**: "timeless. foundational."
- **Description**: The original Lowther experience - unadorned, uncompromising, and eternally captivating
- **Instruments**: 13 drive units (PM2A-PM7A, DX2-DX4, EX2-EX4, PM6C)
- **Price Range**: £420* - £1,085*

### **2. Sinfonia Collection**
- **Feeling**: "refined. harmonious."
- **Description**: Enhanced cone structures, refined spiders, and proprietary paper treatment
- **Instruments**: 9 drive units (PM2A-PM7A, DX2-DX4)
- **Price Range**: £865* - £1,685*

### **3. Philharmonic Collection**
- **Feeling**: "orchestral. precise."
- **Description**: The pinnacle of Lowther engineering with enhanced metal work
- **Instruments**: 3 instruments (Field Coil Motor, PM4A, PM7A)
- **Price Range**: £1,530* - £6,700*

### **4. Grand Opera Collection**
- **Feeling**: "bespoke. ultimate."
- **Description**: Completely bespoke build, made to order
- **Instruments**: 3 instruments (Field Coil Motor, PM4A, PM7A)
- **Price Range**: Price on commission (completely bespoke)

## 🖼️ Image Folder Structure

### **Created Folders:**
```
public/images/drive-units/
├── concert-collection/
│   ├── hero/          ← Hero images
│   ├── gallery/       ← Gallery images  
│   ├── details/       ← Detail shots
│   └── technical/     ← Technical diagrams
├── sinfonia-collection/
├── philharmonic-collection/
└── grand-opera-collection/
```

## 🔧 Utility Functions

### **Available Functions:**
- `getAllCollections()` - Get all collections
- `getCollection(slug)` - Get specific collection
- `getCollectionInstruments(slug)` - Get instruments from collection
- `getInstrument(id)` - Get specific instrument
- `getInstrumentsByMagnetType(type)` - Filter by magnet type
- `getInstrumentsByFrameSize(size)` - Filter by frame size
- `getInstrumentsByPriceRange(min, max)` - Filter by price range
- `getInstrumentsSortedByPrice(ascending)` - Sort by price
- `getInstrumentsByImpedance(impedance)` - Filter by impedance
- `getInstrumentsSortedByCollectionTier(ascending)` - Sort by collection tier
- `getCommissionBasedInstruments()` - Get commission-based instruments
- `getFixedPriceInstruments()` - Get fixed-price instruments
- `getInstrumentsByOverallDiameter(diameter)` - Filter by overall diameter
- `getRandomInstrument(slug)` - Get random instrument
- `getFeaturedInstruments(count)` - Get featured instruments

## 🎯 SEO Features

### **Alt Text Generation:**
- **Collection Images**: "Concert Collection drive unit - timeless. foundational. - Professional photography of Lowther Concert Collection full-range drive unit"
- **Instrument Images**: "PM4A Concert drive unit - Alnico magnet - Premium Lowther PM4A Concert full-range drive unit from Concert Collection"
- **Gallery Images**: Smart filename recognition for specific descriptions

### **Keyword Targeting:**
- **Brand Keywords**: "Lowther", collection names
- **Product Keywords**: "drive unit", "instrument", "full-range"
- **Technical Keywords**: "Alnico", "Neodymium", "Ceramic", magnet types
- **Quality Keywords**: "premium", "handcrafted", "professional"

## 📊 Current Data Status

### **✅ Completed:**
- **Concert Collection**: 13 instruments with full specifications
- **Sinfonia Collection**: 9 instruments with full specifications
- **Philharmonic Collection**: 3 instruments with full specifications
- **Grand Opera Collection**: 3 instruments with commission-based pricing
- **Image folder structure**: All collections have organized folders
- **Utility functions**: Complete set of data access functions including commission handling
- **Alt text system**: SEO-optimized alt text generation
- **Price tier system**: Collection-based sorting and filtering

### **🚧 To Be Added:**
- **Approved copy**: Marketing copy for each collection
- **Technical details**: More detailed specifications (frequency response, THD, etc.)
- **Images**: Actual product images for each collection
- **Product pages**: Individual instrument pages
- **Comparison tools**: Side-by-side specifications

## 🚀 Usage Examples

### **Get Collection Data:**
```typescript
import { getCollection } from '@/lib/utils/drive-units-loader';

const concert = getCollection('concert-collection');
console.log(concert.title); // "Concert Collection"
console.log(concert.instruments.length); // 13
```

### **Get Instruments by Type:**
```typescript
import { getInstrumentsByMagnetType } from '@/lib/utils/drive-units-loader';

const alnicoUnits = getInstrumentsByMagnetType('Alnico');
console.log(alnicoUnits.length); // Number of Alnico instruments
```

### **Get Instruments by Price Range:**
```typescript
import { getInstrumentsByPriceRange } from '@/lib/utils/drive-units-loader';

const affordableUnits = getInstrumentsByPriceRange(400, 600);
console.log(affordableUnits.length); // Instruments under £600
```

### **Sort Instruments by Price:**
```typescript
import { getInstrumentsSortedByPrice } from '@/lib/utils/drive-units-loader';

const cheapestFirst = getInstrumentsSortedByPrice(true);
console.log(cheapestFirst[0].price_display); // "From £420*"
```

### **Get Commission-Based Instruments:**
```typescript
import { getCommissionBasedInstruments } from '@/lib/utils/drive-units-loader';

const bespokeInstruments = getCommissionBasedInstruments();
console.log(bespokeInstruments.length); // 3 (all Grand Opera instruments)
```

### **Sort by Collection Tier:**
```typescript
import { getInstrumentsSortedByCollectionTier } from '@/lib/utils/drive-units-loader';

const byTier = getInstrumentsSortedByCollectionTier(true);
// Concert → Sinfonia → Philharmonic → Grand Opera
```

### **Generate Alt Text:**
```typescript
import { generateDriveUnitAltText } from '@/lib/utils/drive-units-alt-text';

const altText = generateDriveUnitAltText(
  'concert-collection',
  '/images/drive-units/concert-collection/gallery/pm4a-detail.jpg',
  'gallery',
  0
);
```

## 💡 Next Steps

### **Immediate Tasks:**
1. **Add Philharmonic Collection** instruments with specifications
2. **Add Grand Opera Collection** instruments with specifications
3. **Create approved copy** for each collection
4. **Add product images** to appropriate folders

### **Future Enhancements:**
- **Performance specifications**: Frequency response, THD, etc.
- **Compatibility information**: Which speakers use which drive units
- **Build guides**: DIY assembly instructions
- **Comparison tools**: Side-by-side specifications

---

**Ready to expand the drive units database!** 🎉

The foundation is complete with Concert and Sinfonia collections fully populated. Just add the remaining collections and approved copy to have a comprehensive drive units database system.
