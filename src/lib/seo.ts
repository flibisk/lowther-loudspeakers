import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: SEOProps): Metadata {
  const siteName = "Lowther Loudspeakers";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lowtherloudspeakers.com";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription = description || "Discover the finest handcrafted loudspeakers from Lowther Loudspeakers. Masterpieces of acoustic engineering built to last a lifetime.";
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}/images/og-default.jpg`;

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: ["Lowther", "loudspeakers", "handcrafted", "high-end audio", "speakers", "audiophile", ...keywords],
    authors: author ? [{ name: author }] : [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: type || "website",
      locale: "en_GB",
      url: url ? `${siteUrl}${url}` : siteUrl,
      title: fullTitle,
      description: fullDescription,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  return metadata;
}

export function generateStructuredData(type: "Product" | "Article" | "Organization", data: Record<string, unknown>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lowtherloudspeakers.com";

  if (type === "Product") {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.name,
      description: data.description,
      image: Array.isArray(data.images) ? data.images.map((img: string) => `${baseUrl}${img}`) : undefined,
      brand: {
        "@type": "Brand",
        name: "Lowther Loudspeakers",
      },
      manufacturer: {
        "@type": "Organization",
        name: "Lowther Loudspeakers",
      },
      offers: {
        "@type": "Offer",
        price: data.price,
        priceCurrency: data.currency || "GBP",
        availability: data.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Lowther Loudspeakers",
        },
      },
      aggregateRating: data.rating && typeof data.rating === 'object' && 'value' in data.rating && 'count' in data.rating ? {
        "@type": "AggregateRating",
        ratingValue: (data.rating as any).value,
        reviewCount: (data.rating as any).count,
      } : undefined,
    };
  }

  if (type === "Article") {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image ? `${baseUrl}${data.image}` : undefined,
      author: {
        "@type": "Person",
        name: data.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Lowther Loudspeakers",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/logo.png`,
        },
      },
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}${data.url}`,
      },
    };
  }

  if (type === "Organization") {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Lowther Loudspeakers",
      alternateName: "Lowther",
      url: baseUrl,
      logo: `${baseUrl}/images/logo.png`,
      description: "Premium handcrafted loudspeakers and drive units. Trusted by audiophiles worldwide for over 90 years.",
      foundingDate: "1932",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1 Foundry Street",
        addressLocality: "Northampton",
        postalCode: "NN1 1PN",
        addressCountry: "GB",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+44-20-8300-9166",
        contactType: "Customer Service",
        email: "hello@lowtherloudspeakers.com",
        availableLanguage: ["English"],
      },
      sameAs: [
        "https://www.facebook.com/lowtherloudspeakers",
        "https://www.instagram.com/lowtherloudspeakers",
        "https://www.youtube.com/@lowtherloudspeakers",
        "https://twitter.com/lowtherspeakers",
      ],
    };
  }

  return null;
}

/**
 * Generate intelligent alt text from filename
 * Converts kebab-case filenames into descriptive alt text
 * 
 * @param filename - Image filename (with or without extension)
 * @param context - Optional context (e.g., "hero", "gallery", "product")
 * @returns Descriptive alt text
 * 
 * @example
 * generateAltText("pm4a-heritage-horn-natural-alnico.jpg")
 * // Returns: "Lowther PM4A Heritage horn loudspeaker with natural AlNiCo driver"
 */
export function generateAltText(filename: string, context?: string): string {
  // Remove extension and path
  const name = filename
    .split('/').pop()
    ?.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '') || '';

  // Known Lowther model patterns
  const modelPatterns = [
    { regex: /pm(\d+[a-z]?)/i, format: (m: string) => `PM${m.slice(2).toUpperCase()}` },
    { regex: /dx(\d+)/i, format: (m: string) => `DX${m.slice(2)}` },
    { regex: /px(\d+)/i, format: (m: string) => `PX${m.slice(2)}` },
    { regex: /tp(\d+)/i, format: (m: string) => `TP${m.slice(2)}` },
    { regex: /ex(\d+[a-z]?)/i, format: (m: string) => `EX${m.slice(2).toUpperCase()}` },
  ];

  // Replace model codes with proper formatting
  let altText = name;
  for (const { regex, format } of modelPatterns) {
    const match = name.match(regex);
    if (match) {
      altText = altText.replace(regex, format(match[0]));
    }
  }

  // Replace common keywords
  const replacements: Record<string, string> = {
    'alnico': 'AlNiCo',
    'neodymium': 'neodymium',
    'voigt': 'Voigt',
    'hegeman': 'Hegeman',
    'horn': 'horn',
    'drive-unit': 'drive unit',
    'drive-units': 'drive units',
    'amplifier': 'amplifier',
    'valve': 'valve',
    'loudspeaker': 'loudspeaker',
    'loudspeakers': 'loudspeakers',
    'cabinet': 'cabinet',
    'speaker': 'speaker',
    'handcrafted': 'handcrafted',
    'heritage': 'heritage',
    'natural': 'natural',
    'gloss': 'gloss',
    'satin': 'satin',
    'black': 'black',
    'walnut': 'walnut',
    'oak': 'oak',
    'cherry': 'cherry',
    'mahogany': 'mahogany',
  };

  // Split by dashes and underscores, capitalize properly
  const words = altText
    .split(/[-_]/)
    .map(word => {
      const lower = word.toLowerCase();
      return replacements[lower] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

  // Build descriptive alt text
  let description = words.join(' ');

  // Add "Lowther" prefix if not present
  if (!description.toLowerCase().includes('lowther')) {
    description = `Lowther ${description}`;
  }

  // Add context-specific prefixes/suffixes
  if (context === 'hero') {
    description = `${description} - premium handcrafted audio`;
  } else if (context === 'gallery') {
    description = `${description} detailed view`;
  } else if (context === 'product') {
    description = `${description} - available now`;
  }

  return description;
}

/**
 * Generate meta title and description from page content
 * Uses filename, h1 content, or path to create SEO-friendly metadata
 * 
 * @param pathOrTitle - URL path or page title
 * @param h1Content - Optional H1 content from the page
 * @returns Object with title and description
 * 
 * @example
 * generateMetaFromPath("/loudspeakers/pm6c")
 * // Returns: { title: "PM6C Loudspeaker", description: "..." }
 */
export function generateMetaFromPath(pathOrTitle: string, h1Content?: string): { title: string; description: string } {
  // Use H1 content if provided
  if (h1Content) {
    return {
      title: h1Content,
      description: `Learn more about ${h1Content} at Lowther Loudspeakers. Premium handcrafted audio equipment built to last a lifetime.`,
    };
  }

  // Extract meaningful parts from path
  const segments = pathOrTitle
    .split('/')
    .filter(Boolean)
    .map(segment => segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    );

  const title = segments[segments.length - 1] || 'Home';
  
  // Generate context-aware descriptions
  const pathLower = pathOrTitle.toLowerCase();
  let description = '';

  if (pathLower.includes('loudspeaker') || pathLower.includes('/loudspeakers/')) {
    description = `Discover the ${title} - a handcrafted Lowther loudspeaker built with precision and care. Experience unparalleled acoustic performance.`;
  } else if (pathLower.includes('drive-unit') || pathLower.includes('/category/drive-units')) {
    description = `Explore the ${title} drive unit from Lowther. Premium drivers engineered for exceptional sound quality and reliability.`;
  } else if (pathLower.includes('amplifier')) {
    description = `The ${title} from Lowther - handcrafted valve amplification delivering pure, musical sound.`;
  } else if (pathLower.includes('brand') || pathLower.includes('history')) {
    description = `${title} - Discover the rich heritage and craftsmanship behind Lowther Loudspeakers, trusted by audiophiles for over 90 years.`;
  } else if (pathLower.includes('collection')) {
    description = `${title} Collection - Explore curated Lowther loudspeaker systems designed for discerning audio enthusiasts.`;
  } else {
    description = `${title} - Lowther Loudspeakers: Premium handcrafted audio equipment and services for audiophiles worldwide.`;
  }

  return { title, description };
}
