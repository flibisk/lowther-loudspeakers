# 🎵 Lowther Speaker Database Guide

## 📋 Overview
This guide explains how to populate the speaker database with comprehensive information for each Lowther masterpiece. The database is structured to provide rich metadata for SEO, product pages, and AI assistance.

## 🏗️ Database Structure

### 📁 File Location
`/src/lib/data/speakers-database.json`

### 🎯 Purpose
- **SEO Optimization**: Rich metadata for search engines
- **Product Information**: Detailed specifications and descriptions
- **AI Assistance**: Comprehensive data for generating content
- **Marketing**: Compelling copy and positioning information

## 📝 Required Information Sections

### 1. **Basic Information** (Required)
```json
{
  "id": "speaker-slug",
  "title": "Speaker Name",
  "slug": "speaker-slug",
  "feeling": "Two. Words.",
  "image": "/images/card-images/card-image-speaker.webp",
  "href": "/speakers/speaker-slug"
}
```

### 2. **Technical Specifications** (Required)
```json
"technical": {
  "dimensions": {
    "height": "120cm",
    "width": "45cm", 
    "depth": "35cm"
  },
  "weight": "45kg",
  "frequency_response": "35Hz - 20kHz",
  "sensitivity": "96dB",
  "impedance": "8 ohms",
  "power_handling": "25W RMS",
  "driver": "Lowther PM6A full-range",
  "enclosure_type": "Quarter-wave transmission line",
  "materials": {
    "cabinet": "Solid oak with walnut veneer",
    "internal_bracing": "Reinforced MDF",
    "finish": "Hand-rubbed oil finish"
  }
}
```

### 3. **Design Information** (Required)
```json
"design": {
  "designer": "Paul Voigt",
  "year_launched": "1950s",
  "design_philosophy": "Brief description of design approach",
  "unique_features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "target_room_size": "Small to medium rooms (15-30 sqm)",
  "placement": "Corner placement recommended"
}
```

### 4. **Market Information** (Required)
```json
"market": {
  "price_tier": "Premium|Mid-premium|Entry",
  "target_audience": "Who this speaker appeals to",
  "positioning": "How it's positioned in the market",
  "competitors": ["Competitor 1", "Competitor 2"]
}
```

### 5. **Content Information** (Required)
```json
"content": {
  "short_description": "One sentence description (under 160 characters)",
  "long_description": "Detailed paragraph about the speaker",
  "key_benefits": [
    "Benefit 1",
    "Benefit 2",
    "Benefit 3"
  ],
  "use_cases": [
    "Use case 1",
    "Use case 2",
    "Use case 3"
  ]
}
```

### 6. **SEO Information** (Required)
```json
"seo": {
  "meta_title": "Speaker Name - Key Feature | Lowther",
  "meta_description": "Compelling description under 160 characters",
  "keywords": [
    "keyword 1",
    "keyword 2",
    "keyword 3"
  ]
}
```

## 🎯 Filling Out Each Section

### 📐 Technical Specifications
**Where to find this information:**
- Product manuals
- Technical documentation
- Lowther website specifications
- Dealer information sheets

**Important notes:**
- Use metric measurements (cm, kg)
- Be precise with frequency response
- Include exact driver model numbers
- Specify exact materials used

### 🎨 Design Information
**Key elements to include:**
- Historical context (when designed, by whom)
- Design philosophy (what makes it unique)
- Physical features that set it apart
- Room requirements and placement advice

### 💰 Market Information
**Consider:**
- Who would buy this speaker?
- How does it compare to competitors?
- What's the price positioning?
- What makes it special vs alternatives?

### 📝 Content Information
**Writing guidelines:**
- **Short description**: One compelling sentence
- **Long description**: 2-3 paragraphs of detail
- **Key benefits**: What the customer gets
- **Use cases**: Where/how it's used

### 🔍 SEO Information
**Best practices:**
- **Meta title**: Include speaker name + key feature + brand
- **Meta description**: Compelling, under 160 characters
- **Keywords**: Think about what customers would search for

## 📚 Information Sources

### 🏢 Internal Sources
- Lowther product documentation
- Technical specifications
- Historical archives
- Design philosophy documents

### 🌐 External Sources
- Hi-fi magazines and reviews
- Audiophile forums
- Competitor analysis
- Market research

### 👥 Expert Sources
- Lowther engineers
- Audio dealers
- Customer feedback
- Industry experts

## 🚀 Getting Started

### Step 1: Choose a Speaker
Start with one speaker you know well (e.g., The Quarter Wave)

### Step 2: Gather Information
Collect all available technical specs, design info, and marketing materials

### Step 3: Fill Out Template
Use the provided template structure to organize the information

### Step 4: Review and Refine
Ensure all information is accurate and compelling

### Step 5: Test with AI
Ask me to generate content based on the database entry

## 💡 Tips for Success

### ✅ Do:
- Be specific and accurate with technical details
- Include compelling marketing language
- Think about customer pain points
- Consider SEO best practices
- Include unique selling propositions

### ❌ Don't:
- Make up technical specifications
- Use overly technical jargon
- Forget about the customer perspective
- Ignore SEO requirements
- Rush the process

## 🔄 Maintenance

### Regular Updates
- Update pricing information
- Refresh market positioning
- Add new reviews or awards
- Update technical specs if changed

### Quality Control
- Verify all technical information
- Check for spelling/grammar errors
- Ensure consistency across speakers
- Test generated content quality

## 📞 Need Help?

If you need assistance with:
- Finding specific information
- Writing compelling descriptions
- Understanding technical specifications
- SEO optimization
- Market positioning

Just ask! I can help guide you through any section of the database.

---

**Next Steps:**
1. Choose your first speaker to document
2. Gather all available information
3. Start filling out the template
4. Ask for help with any sections you're unsure about
