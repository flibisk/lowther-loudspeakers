import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import speakersDatabase from '@/lib/data/speakers-database.json';
import { SpeakerPageContent } from '@/components/speaker-page-content';
import { speakerPageConfigs } from '@/lib/speaker-page-config';
import { generateSEOMetadata, generateStructuredData } from '@/lib/seo';

interface SpeakerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Create slug mapping for proper URL generation
  const slugMapping: { [key: string]: string } = {
    'quarterwave': 'acousta-quarter-wave',
    'acousta-117': 'acousta-117',
    'edilia': 'edilia',
    'almira': 'almira',
    'tp2': 'tp2',
    'audiovector': 'audiovector',
    'hegeman': 'hegeman',
    'voigt-horn': 'voigt-horn'
  };

  return Object.keys(speakersDatabase.speakers).map((key) => ({
    slug: slugMapping[key] || key,
  }));
}

export async function generateMetadata({ params }: SpeakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Reverse mapping from URL slug to database key
  const reverseSlugMapping: { [key: string]: string } = {
    'acousta-quarter-wave': 'quarterwave',
    'acousta-117': 'acousta-117',
    'edilia': 'edilia',
    'almira': 'almira',
    'tp2': 'tp2',
    'audiovector': 'audiovector',
    'hegeman': 'hegeman',
    'voigt-horn': 'voigt-horn'
  };

  // OG image mapping
  const ogImageMapping: { [key: string]: string } = {
    'acousta-quarter-wave': '/images/og/acousta-quarter-wave.png',
    'acousta-117': '/images/og/acousta-117.jpg',
    'edilia': '/images/og/edilia.jpg',
    'almira': '/images/og/almira.jpg',
    'tp2': '/images/og/tp2.jpg',
    'audiovector': '/images/og/audiovector.jpg',
    'hegeman': '/images/og/hegeman.jpg',
    'voigt-horn': '/images/og/voigt-horn.jpg'
  };

  const speakerKey = reverseSlugMapping[slug] || slug;
  const speaker = speakersDatabase.speakers[speakerKey as keyof typeof speakersDatabase.speakers];
  
  if (!speaker) {
    return {
      title: 'Speaker Not Found',
    };
  }

  const ogImage = ogImageMapping[slug] || '/images/og/default.jpg';
  const url = `/loudspeakers/${slug}`;

  return generateSEOMetadata({
    title: speaker.seo?.meta_title || speaker.title,
    description: speaker.seo?.meta_description || speaker.content?.short_description || '',
    keywords: speaker.seo?.keywords || [],
    image: ogImage,
    url: url,
    type: 'website',
  });
}

/**
 * Extract price from price tier string (e.g., "£8,000+" -> "8000.00")
 */
function extractPrice(priceTier?: string): string {
  if (!priceTier) return '0.00';
  
  // Remove currency symbols, commas, and + signs
  const cleaned = priceTier.replace(/[£$€,+\s]/g, '');
  const num = parseFloat(cleaned);
  
  if (isNaN(num)) return '0.00';
  
  return num.toFixed(2);
}

/**
 * Generate FAQ data for common questions
 */
function generateFAQs(speaker: any): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];

  // Room size question
  if (speaker.design?.target_room_size) {
    faqs.push({
      question: `What room size does the ${speaker.title} suit?`,
      answer: `The ${speaker.title} is designed for ${speaker.design.target_room_size}. ${speaker.design.placement || 'Please consult with our team for specific placement recommendations.'}`
    });
  }

  // Placement question
  if (speaker.design?.placement) {
    faqs.push({
      question: `Where should I place the ${speaker.title}?`,
      answer: speaker.design.placement
    });
  }

  // Driver compatibility
  if (speaker.technical?.recommended_driver || speaker.technical?.alternative_drivers?.length) {
    const drivers = [
      speaker.technical.recommended_driver,
      ...(speaker.technical.alternative_drivers || [])
    ].filter(Boolean);
    
    if (drivers.length > 0) {
      faqs.push({
        question: `Which drive units are compatible with the ${speaker.title}?`,
        answer: `The ${speaker.title} is designed for ${speaker.technical.driver_size || '8" full range'} Lowther drivers. Recommended: ${speaker.technical.recommended_driver || 'Consult our team'}. ${speaker.technical.alternative_drivers?.length ? `Alternative options include: ${speaker.technical.alternative_drivers.join(', ')}.` : ''}`
      });
    }
  }

  return faqs;
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { slug } = await params;
  
  // Reverse mapping from URL slug to database key
  const reverseSlugMapping: { [key: string]: string } = {
    'acousta-quarter-wave': 'quarterwave',
    'acousta-117': 'acousta-117',
    'edilia': 'edilia',
    'almira': 'almira',
    'tp2': 'tp2',
    'audiovector': 'audiovector',
    'hegeman': 'hegeman',
    'voigt-horn': 'voigt-horn'
  };

  const speakerKey = reverseSlugMapping[slug] || slug;
  const speaker = speakersDatabase.speakers[speakerKey as keyof typeof speakersDatabase.speakers];

  if (!speaker) {
    notFound();
  }

  // Safe access to approved_copy with fallbacks
  const approvedCopy = speaker.content?.approved_copy || {
    hero_heading: speaker.title || 'Speaker',
    hero_subheading: speaker.content?.short_description || 'No description available.',
    body: speaker.content?.long_description || 'No description available.',
    technical_highlights: 'Technical details coming soon.',
    lifestyle_copy: 'Lifestyle information coming soon.',
    call_to_action: 'Contact us for more information.',
    features_list: []
  };
  
  const technical = speaker.technical || {
    frequency_response: 'Not specified',
    sensitivity: 'Not specified',
    impedance: 'Not specified',
    power_handling: 'Not specified',
    alternative_drivers: []
  };

  // Get speaker-specific configuration or use defaults
  const pageConfig = speakerPageConfigs[speakerKey] || {
    heroImage: `${speaker.images?.base || '/images/speakers/'}${speaker.images?.hero || 'hero/'}default.jpg`,
    galleryImages: [],
    specsImage: '',
    craftsmanshipContent: [],
    customerQuotes: [],
    lifestyleHeading: 'Craftsmanship and Design',
    lifestyleImages: []
  };

  // Generate Product schema for AEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
  const heroImage = pageConfig.heroImage.startsWith('http') 
    ? pageConfig.heroImage 
    : `${siteUrl}${pageConfig.heroImage}`;
  
  const productImages = [heroImage];
  if (pageConfig.galleryImages && pageConfig.galleryImages.length > 0) {
    pageConfig.galleryImages.slice(0, 3).forEach(img => {
      const imgUrl = img.src.startsWith('http') ? img.src : `${siteUrl}${img.src}`;
      productImages.push(imgUrl);
    });
  }

  const price = extractPrice(speaker.market?.price_tier);
  
  // Build additional properties for technical data
  const additionalProperties: Array<{ name: string; value: string }> = [];
  
  if (speaker.technical?.driver_size) {
    additionalProperties.push({ name: 'driver_size', value: speaker.technical.driver_size });
  }
  if (speaker.technical?.horn_type) {
    additionalProperties.push({ name: 'horn_type', value: speaker.technical.horn_type });
  }
  if (speaker.technical?.impedance) {
    additionalProperties.push({ name: 'impedance', value: speaker.technical.impedance });
  }
  if (speaker.technical?.sensitivity) {
    additionalProperties.push({ name: 'sensitivity', value: speaker.technical.sensitivity });
  }
  if (speaker.technical?.frequency_response) {
    additionalProperties.push({ name: 'frequency_response', value: speaker.technical.frequency_response });
  }

  // Generate Product schema
  const baseProductSchema = generateStructuredData('Product', {
    name: speaker.title,
    description: speaker.content?.long_description || speaker.content?.short_description || '',
    images: productImages,
    sku: speaker.id,
    price: price,
    currency: 'GBP',
    inStock: false, // Made to order
  });

  // Add additionalProperty and PreOrder availability
  const productSchema = {
    ...baseProductSchema,
    ...(additionalProperties.length > 0 && {
      additionalProperty: additionalProperties.map(prop => ({
        '@type': 'PropertyValue',
        name: prop.name,
        value: prop.value,
      })),
    }),
    offers: {
      ...(baseProductSchema as any).offers,
      availability: 'https://schema.org/PreOrder',
    },
  };

  // Generate FAQ schema if we have FAQs
  const faqs = generateFAQs(speaker);
  const faqSchema = faqs.length > 0 
    ? generateStructuredData('FAQPage', { faqs })
    : null;

  return (
    <>
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <SpeakerPageContent 
        speaker={speaker} 
        technical={technical} 
        approvedCopy={approvedCopy}
        heroImage={pageConfig.heroImage}
        heroVideo={pageConfig.heroVideo}
        mobileHeroImage={pageConfig.mobileHeroImage}
        galleryImages={pageConfig.galleryImages}
        specsImage={pageConfig.specsImage}
        specsImages={pageConfig.specsImages}
        craftsmanshipContent={pageConfig.craftsmanshipContent}
        customerQuotes={pageConfig.customerQuotes}
        lifestyleHeading={pageConfig.lifestyleHeading}
        lifestyleImages={pageConfig.lifestyleImages}
        showGenericCraftsmanship={pageConfig.showGenericCraftsmanship}
        genericCraftsmanshipHeading={pageConfig.genericCraftsmanshipHeading}
        speakerCraftsmanshipHeading={pageConfig.speakerCraftsmanshipHeading}
        speakerVideo={pageConfig.speakerVideo}
        speakerVideos={pageConfig.speakerVideos}
        remakingVideo={pageConfig.remakingVideo}
        pressReviews={pageConfig.pressReviews}
        slug={slug}
      />
    </>
  );
}
