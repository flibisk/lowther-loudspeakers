import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getAllSpeakers, getSpeakerUrl, getSpeakerHeroImage } from '@/data/speakers';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Loudspeakers',
  description: 'Discover Lowther\'s handcrafted loudspeakers. From the discreet Acousta QW to the statement Voigt Horn, each design embodies our single-driver philosophy and British craftsmanship.',
  keywords: [
    'Lowther loudspeakers',
    'horn loudspeakers',
    'single driver speakers',
    'British high end audio',
    'Voigt horn',
    'quarter wave speakers',
  ],
  url: '/loudspeakers',
});

export default function LoudspeakersPage() {
  const speakers = getAllSpeakers();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';

  // Generate ItemList schema for AEO
  const itemListSchema = generateStructuredData('ItemList', {
    items: speakers.map((speaker) => ({
      name: speaker.title,
      url: getSpeakerUrl(speaker),
      image: getSpeakerHeroImage(speaker),
    })),
  });

  return (
    <>
      {/* ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Loudspeakers' },
        ]}
      />

      <main className="min-h-screen bg-white">
        <article className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-12">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Lowther Loudspeakers
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Handcrafted in Great Britain, each Lowther loudspeaker embodies our single-driver 
              philosophy. From discreet corner horns to statement pieces, discover the full range 
              of our horn-loaded designs.
            </p>
          </header>

          {/* Introduction */}
          <section className="mb-16 max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-4">
                Lowther loudspeakers are built around a simple principle: a single full-range driver 
                working without complex crossovers delivers the most coherent, natural sound. Our 
                horn-loaded designs leverage decades of acoustic engineering to create loudspeakers 
                that are both musically engaging and visually refined.
              </p>
              <p className="text-lg leading-relaxed">
                Each model is handmade to order in our Northampton workshop, finished in bespoke 
                real wood veneers, and backed by a 10-year warranty. Whether you're stepping into 
                high-efficiency audio for the first time or seeking a statement piece for a dedicated 
                listening room, there's a Lowther loudspeaker designed for your space and preferences.
              </p>
            </div>
          </section>

          {/* Speakers Grid */}
          <section>
            <h2 className="text-3xl font-semibold mb-8 text-gray-900">Our Loudspeakers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => {
                const speakerUrl = getSpeakerUrl(speaker);
                const heroImage = getSpeakerHeroImage(speaker);

                return (
                  <article
                    key={speaker.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={speakerUrl} className="block">
                      <div className="aspect-[4/3] relative bg-gray-100">
                        <Image
                          src={heroImage}
                          alt={`Lowther ${speaker.title} loudspeaker`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                          {speaker.title}
                        </h3>
                        {speaker.feeling && (
                          <p className="text-sm text-gray-500 mb-3 italic">
                            {speaker.feeling}
                          </p>
                        )}
                        {speaker.content?.short_description && (
                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {speaker.content.short_description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {speaker.technical?.recommended_driver && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {speaker.technical.recommended_driver}
                            </span>
                          )}
                          {speaker.technical?.horn_type && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {speaker.technical.horn_type}
                            </span>
                          )}
                          {speaker.market?.price_tier && (
                            <span className="text-xs bg-[#c59862] text-white px-2 py-1 rounded">
                              {speaker.market.price_tier}
                            </span>
                          )}
                        </div>
                        <div className="text-[#c59862] font-semibold hover:text-[#a67c52]">
                          Learn more →
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Key Features Section */}
          <section className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Why Lowther Loudspeakers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Single Driver Design</h3>
                <p className="text-gray-700">
                  No crossovers in the audio band means perfect phase coherence and natural timing. 
                  Every Lowther loudspeaker uses a single full-range driver for the most authentic 
                  musical reproduction.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Horn Loading</h3>
                <p className="text-gray-700">
                  Our Voigt horn designs provide high efficiency and dynamic range, allowing 
                  low-powered amplifiers to drive the speakers to realistic listening levels with 
                  remarkable clarity.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">British Craftsmanship</h3>
                <p className="text-gray-700">
                  Handmade in Great Britain since 1932, each pair is built to order with bespoke 
                  real wood veneers and finished to the highest standards. Every loudspeaker carries 
                  a 10-year warranty.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Experience Lowther Loudspeakers
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              The best way to appreciate a Lowther loudspeaker is to hear it in your own space. 
              Contact us to arrange a listening appointment or discuss which model suits your room 
              and musical preferences.
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

