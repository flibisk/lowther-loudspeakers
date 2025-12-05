import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
  SPEAKERS, 
  getSpeakerBySlug, 
  getSpeakerHeroImage, 
  getSpeakerUrl,
  getAllSpeakers,
  getSpeakerSlugs
} from '@/data/speakers';

interface SpeakerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getSpeakerSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: SpeakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const speaker = getSpeakerBySlug(slug);

  if (!speaker) {
    return {
      title: 'Speaker Not Found',
    };
  }

  const heroImage = getSpeakerHeroImage(speaker);
  const url = getSpeakerUrl(speaker);

  return generateSEOMetadata({
    title: speaker.content?.seo?.meta_title || speaker.title,
    description: speaker.content?.seo?.meta_description || speaker.content?.short_description || '',
    keywords: speaker.content?.seo?.keywords || [],
    image: heroImage,
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
 * Format dimensions for display
 */
function formatDimensions(dimensions?: { height?: number; width?: number; depth?: number }): string {
  if (!dimensions) return 'Not specified';
  
  const parts: string[] = [];
  if (dimensions.height) parts.push(`H: ${dimensions.height}mm`);
  if (dimensions.width) parts.push(`W: ${dimensions.width}mm`);
  if (dimensions.depth) parts.push(`D: ${dimensions.depth}mm`);
  
  return parts.length > 0 ? parts.join(' × ') : 'Not specified';
}

/**
 * Format weight for display
 */
function formatWeight(weight?: number | string): string {
  if (!weight) return 'Not specified';
  if (typeof weight === 'number') return `${weight}kg`;
  return weight;
}

/**
 * Generate FAQ data for common questions
 */
function generateFAQs(speaker: typeof SPEAKERS[string]): Array<{ question: string; answer: string }> {
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
  const speaker = getSpeakerBySlug(slug);

  if (!speaker) {
    notFound();
  }

  const heroImage = getSpeakerHeroImage(speaker);
  const url = getSpeakerUrl(speaker);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
  const fullHeroImage = heroImage.startsWith('http') ? heroImage : `${siteUrl}${heroImage}`;

  // Prepare Product schema data
  const productImages = speaker.images?.base && speaker.images?.hero 
    ? [`${siteUrl}${speaker.images.base}${speaker.images.hero}`]
    : speaker.image 
      ? [`${siteUrl}${speaker.image}`]
      : [fullHeroImage];

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
  if (speaker.technical?.dimensions_mm) {
    additionalProperties.push({ name: 'dimensions', value: formatDimensions(speaker.technical.dimensions_mm) });
  }

  // Generate Product schema
  const baseProductSchema = generateStructuredData('Product', {
    name: speaker.title,
    description: speaker.content?.long_description || speaker.content?.short_description || '',
    images: productImages,
    sku: speaker.id,
    price: price,
    currency: 'GBP',
    inStock: false, // Made to order, so PreOrder availability
  });

  // Override availability for made-to-order products and add additionalProperty
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

  // Get related speakers (other Lowther products)
  const allSpeakers = getAllSpeakers();
  const relatedSpeakers = allSpeakers
    .filter(s => s.id !== speaker.id)
    .slice(0, 3);

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

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Loudspeakers', href: '/loudspeakers' },
          { label: speaker.title },
        ]}
      />

      <main className="min-h-screen bg-white">
        <article className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-12">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              {speaker.title}
            </h1>
            {speaker.content?.short_description && (
              <p className="text-xl text-gray-700 max-w-3xl">
                {speaker.content.short_description}
              </p>
            )}
          </header>

          {/* Hero Image */}
          {heroImage && (
            <div className="mb-12">
              <Image
                src={heroImage}
                alt={`Lowther ${speaker.title} loudspeaker`}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          )}

          {/* Overview Section */}
          {speaker.content?.long_description && (
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-gray-900">Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {speaker.content.long_description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Technical Details Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {speaker.technical?.recommended_driver && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recommended Driver</h3>
                  <p className="text-gray-700">{speaker.technical.recommended_driver}</p>
                </div>
              )}
              
              {speaker.technical?.driver_size && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Driver Size</h3>
                  <p className="text-gray-700">{speaker.technical.driver_size}</p>
                </div>
              )}

              {speaker.technical?.horn_type && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Horn Type</h3>
                  <p className="text-gray-700">{speaker.technical.horn_type}</p>
                </div>
              )}

              {speaker.technical?.dimensions_mm && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dimensions</h3>
                  <p className="text-gray-700">{formatDimensions(speaker.technical.dimensions_mm)}</p>
                </div>
              )}

              {speaker.technical?.sensitivity && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sensitivity</h3>
                  <p className="text-gray-700">{speaker.technical.sensitivity}</p>
                </div>
              )}

              {speaker.technical?.impedance && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Impedance</h3>
                  <p className="text-gray-700">{speaker.technical.impedance}</p>
                </div>
              )}

              {speaker.technical?.frequency_response && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Frequency Response</h3>
                  <p className="text-gray-700">{speaker.technical.frequency_response}</p>
                </div>
              )}

              {speaker.technical?.weight && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Weight</h3>
                  <p className="text-gray-700">{formatWeight(speaker.technical.weight)}</p>
                </div>
              )}

              {speaker.technical?.enclosure_type && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enclosure Type</h3>
                  <p className="text-gray-700">{speaker.technical.enclosure_type}</p>
                </div>
              )}
            </div>

            {speaker.technical?.alternative_drivers && speaker.technical.alternative_drivers.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Alternative Drivers</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {speaker.technical.alternative_drivers.map((driver, index) => (
                    <li key={index}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Design and Philosophy Section */}
          {(speaker.design?.design_philosophy || speaker.design?.unique_features) && (
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-gray-900">Design and Philosophy</h2>
              
              {speaker.design.designer && (
                <div className="mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Designer:</span> {speaker.design.designer}
                    {speaker.design.year_launched && ` (${speaker.design.year_launched})`}
                  </p>
                </div>
              )}

              {speaker.design.design_philosophy && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{speaker.design.design_philosophy}</p>
                </div>
              )}

              {speaker.design.unique_features && speaker.design.unique_features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Unique Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {speaker.design.unique_features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Listening Space and Placement Section */}
          {(speaker.design?.target_room_size || speaker.design?.placement) && (
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-gray-900">Listening Space and Placement</h2>
              
              {speaker.design.target_room_size && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Recommended Room Size</h3>
                  <p className="text-gray-700">{speaker.design.target_room_size}</p>
                </div>
              )}

              {speaker.design.placement && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Placement</h3>
                  <p className="text-gray-700">{speaker.design.placement}</p>
                </div>
              )}
            </section>
          )}

          {/* Who This Is For Section */}
          {(speaker.market?.target_audience || speaker.market?.positioning) && (
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-gray-900">Who This Is For</h2>
              
              {speaker.market.target_audience && (
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{speaker.market.target_audience}</p>
                </div>
              )}

              {speaker.market.positioning && (
                <div>
                  <p className="text-gray-700 leading-relaxed italic">{speaker.market.positioning}</p>
                </div>
              )}
            </section>
          )}

          {/* Related Products and Competitors Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Related Products and Alternatives</h2>
            
            {relatedSpeakers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Other Lowther Loudspeakers</h3>
                <ul className="space-y-2">
                  {relatedSpeakers.map((related) => (
                    <li key={related.id}>
                      <Link 
                        href={getSpeakerUrl(related)}
                        className="text-[#c59862] hover:text-[#a67c52] underline"
                      >
                        {related.title}
                      </Link>
                      {related.content?.short_description && (
                        <span className="text-gray-600 ml-2">
                          — {related.content.short_description}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {speaker.market?.competitors && speaker.market.competitors.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Alternative Brands</h3>
                <p className="text-gray-700 mb-2">
                  The {speaker.title} is often compared to products from:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                  {speaker.market.competitors.map((competitor, index) => (
                    <li key={index}>{competitor}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Call to Action */}
          <section className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Experience the {speaker.title}</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Handcrafted in Great Britain, the {speaker.title} represents the pinnacle of Lowther's 
              single-driver philosophy. Contact us to learn more or arrange a listening appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#c59862] text-white px-8 py-3 rounded hover:bg-[#a67c52] transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/book-appointment"
                className="bg-white text-[#c59862] border-2 border-[#c59862] px-8 py-3 rounded hover:bg-gray-50 transition-colors"
              >
                Book Listening Appointment
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
