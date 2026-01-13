/**
 * Metadata Configuration
 * Centralized metadata for all pages including titles, descriptions, and OG images
 */

export interface PageMetadata {
  title: string;
  description: string;
  ogImage: string;
  keywords?: string[];
}

/**
 * Metadata configuration for all pages
 * OG images should be 1200x630px (1.91:1 aspect ratio)
 */
export const METADATA_CONFIG: Record<string, PageMetadata> = {
  // Core Pages
  home: {
    title: "Lowther Loudspeakers | Handmade British High Fidelity Loudspeakers",
    description: "Experience clear and natural sound from handmade British loudspeakers. Explore full range drive units, bespoke builds and legacy designs crafted for accuracy and long term performance.",
    ogImage: "/images/og/default.jpg",
    keywords: [
      "handmade loudspeakers",
      "british hi-fi",
      "full range drive units",
      "bespoke speaker builds",
      "high fidelity audio"
    ],
  },
  
  contact: {
    title: "Contact Us",
    description: "Get in touch with Lowther Loudspeakers. Visit our listening room in Northampton or reach out to our team of audio specialists.",
    ogImage: "/images/og/contact.jpg",
    keywords: ["contact", "listening room", "customer service"],
  },
  
  blog: {
    title: "Blog",
    description: "Insights, guides, and stories from the world of Lowther loudspeakers. Building tips, acoustic design, and the Lowther story.",
    ogImage: "/images/og/blog.jpg",
    keywords: ["blog", "articles", "guides", "acoustics", "building", "DIY"],
  },
  
  reviews: {
    title: "Customer Reviews",
    description: "Read what our customers say about their Lowther loudspeakers. Real experiences from audiophiles worldwide.",
    ogImage: "/images/og/reviews.jpg",
    keywords: ["reviews", "testimonials", "customer feedback"],
  },
  
  listen: {
    title: "Listen",
    description: "Experience the Lowther sound. Book an appointment to visit our listening rooms and hear the difference for yourself.",
    ogImage: "/images/og/listen.jpg",
    keywords: ["listening room", "demo", "experience"],
  },
  
  warranty: {
    title: "Warranty",
    description: "Every Lowther loudspeaker comes with a comprehensive warranty. Learn about our commitment to quality and support.",
    ogImage: "/images/og/warranty.jpg",
    keywords: ["warranty", "guarantee", "support"],
  },
  
  catalogue: {
    title: "Catalogue",
    description: "Browse the complete Lowther catalogue. Explore our range of loudspeakers, drive units, and accessories.",
    ogImage: "/images/og/catalogue.jpg",
    keywords: ["catalogue", "brochure", "products"],
  },
  
  verify: {
    title: "Authenticity Checker",
    description: "Verify your Lowther product. Check serial numbers and confirm authenticity of your loudspeakers or drive units.",
    ogImage: "/images/og/verify.jpg",
    keywords: ["authenticity", "verification", "serial number"],
  },
  
  "trust-your-ears": {
    title: "Album of the Week | Trust Your Ears",
    description: "Trust Your Ears is Lowther's album club. Every week the community recommends and votes on a single record to listen to together. A simple way for Lowther owners to discover beautifully mastered music and hear what their speakers are truly capable of.",
    ogImage: "/images/og/trust-your-ears.jpeg",
    keywords: ["album club", "music recommendation", "vinyl", "audiophile", "album of the week", "listening community", "hi-fi music"],
  },
  
  "build-a-lowther": {
    title: "Build a Lowther",
    description: "Join the DIY audio community. Build your own Lowther loudspeaker system with our comprehensive guides and plans.",
    ogImage: "/images/og/build-a-lowther.jpg",
    keywords: ["DIY", "build", "plans", "construction"],
  },
  
  "book-appointment": {
    title: "Book an Appointment",
    description: "Schedule a visit to our listening room. Experience Lowther loudspeakers with personalised consultation.",
    ogImage: "/images/og/book-appointment.jpg",
    keywords: ["appointment", "booking", "visit", "consultation"],
  },
  
  ambassador: {
    title: "Ambassador Program",
    description: "Join the Lowther Ambassador Programme. Share your passion for high-fidelity audio and become part of our community.",
    ogImage: "/images/og/ambassador.jpg",
    keywords: ["ambassador", "program", "community"],
  },
  
  // Brand Pages
  "brand/our-craft": {
    title: "Our Craft",
    description: "Discover the artistry behind every Lowther loudspeaker. Handcrafted with precision, passion, and over 90 years of expertise.",
    ogImage: "/images/og/brand-our-craft.jpg",
    keywords: ["craftsmanship", "handmade", "artisan"],
  },
  
  "brand/handcrafted": {
    title: "Handcrafted Excellence",
    description: "Every Lowther speaker is meticulously handcrafted by skilled artisans. No compromises, only perfection.",
    ogImage: "/images/og/brand-handcrafted.jpg",
    keywords: ["handcrafted", "artisan", "quality"],
  },
  
  "brand/lasting-legacy": {
    title: "A Lasting Legacy",
    description: "Over 90 years of audio excellence. Discover the legacy that makes Lowther a trusted name in high-fidelity sound.",
    ogImage: "/images/og/brand-lasting-legacy.jpg",
    keywords: ["legacy", "heritage", "history"],
  },
  
  "brand/paul-voigt-era": {
    title: "The Paul Voigt Era",
    description: "Explore the pioneering work of Paul Voigt, whose innovative designs laid the foundation for the Hifi we have today.",
    ogImage: "/images/og/brand-paul-voigt-era.jpg",
    keywords: ["Paul Voigt", "history", "innovation"],
  },
  
  "brand/donald-chave-era": {
    title: "The Donald Chave Era",
    description: "Discover the Donald Chave era and the evolution of Lowther's iconic drive units and speaker systems.",
    ogImage: "/images/og/brand-donald-chave-era.jpg",
    keywords: ["Donald Chave", "history", "development"],
  },
  
  // History
  history: {
    title: "Our History",
    description: "Since 1934, Lowther has been at the forefront of acoustic innovation. Explore 90+ years of audio excellence.",
    ogImage: "/images/og/history.jpg",
    keywords: ["history", "heritage", "timeline"],
  },
  
  // Categories
  "category/loudspeakers": {
    title: "Loudspeakers",
    description: "Explore our collection of handcrafted loudspeakers.",
    ogImage: "/images/og/category-loudspeakers.jpg",
    keywords: ["loudspeakers", "speakers", "systems"],
  },
  
  "category/drive-units": {
    title: "Drive Units",
    description: "World-renowned Lowther drive units. The heart of exceptional sound, trusted by audiophiles for generations.",
    ogImage: "/images/og/category-drive-units.jpg",
    keywords: ["drive units", "drivers", "components"],
  },
  
  "category/cables": {
    title: "Cables & Accessories",
    description: "Premium audio cables and accessories. Complete your Lowther system with handcrafted perfection.",
    ogImage: "/images/og/category-cables.jpg",
    keywords: ["cables", "accessories", "wiring"],
  },
  
  // Collections
  "collection/grand-opera": {
    title: "Grand Opera Collection",
    description: "The pinnacle of Lowther engineering. Grand Opera drive units deliver unparalleled sonic performance.",
    ogImage: "/images/og/collection-grand-opera.jpg",
    keywords: ["Grand Opera", "premium", "flagship"],
  },
  
  "collection/philharmonic": {
    title: "Philharmonic Collection",
    description: "Explore the Philharmonic Collection — Lowther's most refined drive units featuring exclusive metalwork, chrome finishing, and emotionally rich sound tuned by expert craftsmen.",
    ogImage: "/images/og/collection-philharmonic.jpg",
    keywords: ["Philharmonic", "mid-range", "performance"],
  },
  
  "collection/concert": {
    title: "Concert Collection",
    description: "Explore the Concert Collection from Lowther Loudspeakers – handcrafted in Great Britain with classic paper treatment for the authentic Lowther sound. Ideal for home builders seeking immediate, detailed, and profoundly musical reproduction.",
    ogImage: "/images/og/collection-concert.jpg",
    keywords: ["Concert", "accessible", "entry-level"],
  },

  "collection/super-tweeter": {
    title: "The Lowther Super Tweeter",
    description: "Complete the final octave of your Lowther system. The Super Tweeter restores spatial cues and harmonic detail with DX or PM magnet options, perfectly matching our full-range drivers.",
    ogImage: "/images/og/supertweeter.jpg",
    keywords: ["Super Tweeter", "high frequency", "drive unit", "magnet options"],
  },
  
  "collection/sinfonia": {
    title: "Sinfonia Collection",
    description: "Discover the Sinfonia Collection from Lowther Loudspeakers - handcrafted in Great Britain with enhanced diaphragms for refined clarity, resolution, and tonal accuracy. Elevate your custom audio designs with timeless acoustic excellence.",
    ogImage: "/images/og/collection-sinfonia.jpg",
    keywords: ["Sinfonia", "compact", "small"],
  },
  
  // Services
  "services/oem-opportunities": {
    title: "OEM Opportunities",
    description: "Partner with Lowther. OEM opportunities for manufacturers seeking the finest drive units.",
    ogImage: "/images/og/services-oem-opportunities.jpg",
    keywords: ["OEM", "partnership", "B2B"],
  },
  
  "services/listening-rooms": {
    title: "Listening Rooms",
    description: "Experience Lowther in our dedicated listening rooms. Schedule a visit and hear the difference.",
    ogImage: "/images/og/services-listening-rooms.jpg",
    keywords: ["listening room", "showroom", "demo"],
  },
  
  "services/refurbishments-upgrades": {
    title: "Refurbishments & Upgrades",
    description: "Restore and upgrade your Lowther products. Expert refurbishment services for vintage and modern systems.",
    ogImage: "/images/og/services-refurbishments-upgrades.jpg",
    keywords: ["refurbishment", "upgrade", "restoration"],
  },
  
  // Ensemble
  "ensemble/px4-amplifier": {
    title: "PX4 Valve Amplifier",
    description: "The legendary PX4 valve amplifier. Handcrafted perfection paired with Lowther loudspeakers.",
    ogImage: "/images/og/ensemble-px4-amplifier.jpg",
    keywords: ["PX4", "amplifier", "valve", "tube"],
  },
  
  "ensemble/reference-cables": {
    title: "Reference Cables",
    description: "Premium audio cables designed specifically for Lowther systems. Handcrafted for optimal performance.",
    ogImage: "/images/og/ensemble-reference-cables.jpg",
    keywords: ["cables", "wiring", "reference"],
  },
  
  "ensemble/phase-plugs": {
    title: "Phase Plugs",
    description: "Precision-engineered phase plugs. Enhance your Lowther drive units with optimized performance.",
    ogImage: "/images/og/ensemble-phase-plugs.jpg",
    keywords: ["phase plugs", "accessories", "upgrade"],
  },
  
  "ensemble/lowther-badges": {
    title: "Lowther Badges",
    description: "Authentic Lowther badges and branding. Complete your build with official accessories.",
    ogImage: "/images/og/ensemble-lowther-badges.jpg",
    keywords: ["badges", "branding", "accessories"],
  },
  
  "ensemble/residential-system-design": {
    title: "Residential System Design",
    description: "Bespoke audio solutions for your home. Custom Lowther system design and installation.",
    ogImage: "/images/og/ensemble-residential-system-design.jpg",
    keywords: ["residential", "custom", "design", "installation"],
  },
  
  "ensemble/commercial-system-design": {
    title: "Commercial System Design",
    description: "Professional audio solutions. Lowther systems for commercial spaces and venues.",
    ogImage: "/images/og/ensemble-commercial-system-design.jpg",
    keywords: ["commercial", "business", "installation"],
  },
  
  // Products
  products: {
    title: "All Products",
    description: "Browse the complete Lowther product range. Loudspeakers, drive units, amplifiers, and accessories.",
    ogImage: "/images/og/products.jpg",
    keywords: ["products", "catalogue", "range"],
  },
  
  // Landings
  "landings/qw-a": {
    title: "Quarter Wave - Variant A",
    description: "Discover the Quarter Wave loudspeaker system. Architectural elegance meets acoustic perfection.",
    ogImage: "/images/og/landings-qw-a.jpg",
    keywords: ["Quarter Wave", "landing", "special offer"],
  },
  
  "landings/qw-b": {
    title: "Quarter Wave - Variant B",
    description: "Experience the Quarter Wave difference. Discreet design, extraordinary sound.",
    ogImage: "/images/og/landings-qw-b.jpg",
    keywords: ["Quarter Wave", "landing", "special offer"],
  },
};

/**
 * Get metadata for a specific page
 * @param path - The page path (e.g., "/contact" or "/brand/our-craft")
 * @returns PageMetadata object or default metadata
 */
export function getPageMetadata(path: string): PageMetadata {
  // Remove leading/trailing slashes
  const cleanPath = path.replace(/^\/|\/$/g, "");
  
  // Return specific metadata if exists
  if (METADATA_CONFIG[cleanPath]) {
    return METADATA_CONFIG[cleanPath];
  }
  
  // Return default metadata
  return {
    title: "Handcrafted Excellence",
    description: "Discover the finest handcrafted loudspeakers from Lowther. Masterpieces of acoustic engineering built to last a lifetime.",
    ogImage: "/images/og/default.jpg",
    keywords: ["Lowther", "loudspeakers", "handcrafted", "high-end audio"],
  };
}

/**
 * Get all configured page paths
 */
export function getAllConfiguredPages(): string[] {
  return Object.keys(METADATA_CONFIG);
}


