'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CommissionForm } from '@/components/commission-form';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollReveal } from '@/components/scroll-reveal';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface AlmiraPageContentProps {
  speaker: any;
  technical: any;
  approvedCopy: any;
  heroImage: string;
  mobileHeroImage?: string;
  galleryImages: Array<{ src: string; alt: string }>;
  specsImage: string;
  craftsmanshipContent: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  customerQuotes: Array<{ quote: string; author?: string }>;
  lifestyleHeading: string;
  lifestyleImages: Array<{ src: string; alt: string }>;
}

export function AlmiraPageContent({ 
  speaker, 
  technical, 
  approvedCopy,
  heroImage,
  mobileHeroImage,
  galleryImages,
  specsImage,
  craftsmanshipContent,
  customerQuotes,
  lifestyleHeading,
  lifestyleImages
}: AlmiraPageContentProps) {
  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen]);

  // Review cards data
  const reviews = [
    {
      logo: '/images/speakers/almira/details/The Ear Editors Choice.png',
      quote: 'The Almira has the ability to connect the music to the listener on an emotional level as well. The pathos of the piano sonatas, the anguish in Belinda\'s dying aria, the heartache in so many of Adele\'s songs, the list goes on, they\'re gin-clear.',
      publication: 'The Ear',
      link: 'https://the-ear.net/review-hardware/lowther-almira-floorstanding-loudspeaker/'
    },
    {
      logo: '/images/speakers/almira/details/5 star review from Hi-Fi Pig Magazine.jpeg',
      quote: 'This is no pipe and slippers box like some Lowther\'s from the 50\'s. This looks truly 21st century and sounds just as present-day when placed carefully in any medium-sized living room.',
      publication: 'HiFi Pig',
      link: 'https://www.hifipig.com/lowther-almira-loudspeaker/'
    },
    {
      logo: '/images/speakers/almira/details/Hi-fi+ Logo.webp',
      quote: 'The sound is very open and transparent - extremely fast and sharp... Playing Bob Downes Open Music... I was impressed by the sheer effervescence of the sound and its\' amazing attack.',
      publication: 'HiFi+',
      link: 'https://hifiplus.com/publications/hi-fi-plus/issues/hi-fi-issue-209-july-2022/'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src={heroImage}
          alt={`${speaker.title} loudspeaker`}
          fill
          className="hidden 930:block absolute inset-0 h-full w-full object-cover"
          priority
        />
        <Image
          src={mobileHeroImage || heroImage}
          alt={`${speaker.title} loudspeaker`}
          fill
          className="block 930:hidden absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-8 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <ScrollReveal animation="fade-in">
            <div className="flex items-center mb-2">
              <div className="w-8 h-px bg-white mr-3"></div>
              <span className="text-sm tracking-wider uppercase text-white/80">A LOWTHER MASTERPIECE</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
              {speaker.title}
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="hidden 930:block text-lg text-white/90 leading-relaxed mb-6 930:mb-0">
              {approvedCopy.hero_subheading}
            </p>
          </ScrollReveal>
        </div>

        <div className="absolute bottom-8 930:bottom-20 left-6 930:left-auto 930:right-16 z-10 w-auto 930:w-auto">
          <ScrollReveal animation="scale" delay={300}>
            <Button 
              variant="white"
              size="lowther"
              onClick={() => setIsCommissionFormOpen(true)}
            >
              COMMISSION YOURS
            </Button>
          </ScrollReveal>
        </div>

        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <div id="hero-sentinel" className="absolute bottom-0 h-[1px] w-full" />
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Masterpieces', href: '/products' },
          { label: speaker.title }
        ]}
      />

      {/* Simply Just Works Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <ScrollReveal animation="fade-in">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-12 bg-gray-300"></div>
              <span className="px-4 text-xs tracking-[0.2em] uppercase text-gray-500">{speaker.title.toUpperCase()}</span>
              <div className="h-px w-12 bg-gray-300"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-12 text-[#c59862]">
              {approvedCopy.hero_heading}
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div 
              className="space-y-6 text-lg leading-relaxed text-gray-800 mb-12"
              dangerouslySetInnerHTML={{ 
                __html: speaker.content.long_description
                  .split('. ')
                  .map((sentence: string) => `<p>${sentence}${sentence.endsWith('.') ? '' : '.'}</p>`)
                  .join('') 
              }}
            />
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={300}>
            <Button 
              variant="black" 
              size="lowther" 
              onClick={() => setIsCommissionFormOpen(true)}
            >
              COMMISSION YOURS
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Video Section */}
      <section data-surface="light" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-[#c59862]">
              See the Almira in Action
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={100}>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/5hyZ086aQmA"
                title="Lowther Almira Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bento Box Gallery Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <ScrollReveal 
                key={index}
                animation="scale"
                delay={index * 100}
              >
                <div 
                  className="group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section data-surface="light" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-[#c59862]">
              Specs
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal animation="slide-right" delay={100}>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <Image
                    src={specsImage}
                    alt={`${speaker.title} technical dimensions`}
                    width={400}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" delay={200}>
              <div className="space-y-6">
                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Colour Options</h3>
                  <p className="text-gray-700">{technical.colour_options}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Horn Type</h3>
                  <p className="text-gray-700">{technical.horn_type}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Drive Unit Size</h3>
                  <p className="text-gray-700">{technical.driver_size}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Lowther Drive Unit</h3>
                  <p className="text-gray-700">{technical.recommended_driver}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Alternative Lowther Drive Units</h3>
                  <p className="text-gray-700">{(technical.alternative_drivers || []).join(', ')}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Sensitivity</h3>
                  <p className="text-gray-700">{technical.sensitivity}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Nominal Impedance</h3>
                  <p className="text-gray-700">{technical.impedance}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Frequency Response</h3>
                  <p className="text-gray-700">{technical.frequency_response}</p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <h3 className="text-sm font-semibold mb-2">Dimensions (H×W×D)</h3>
                  <p className="text-gray-700">{technical.dimensions_mm.height}mm × {technical.dimensions_mm.width}mm × {technical.dimensions_mm.depth}mm</p>
                </div>

                <div className="pb-4">
                  <h3 className="text-sm font-semibold mb-2">Weight</h3>
                  <p className="text-gray-700">{technical.weight}</p>
                </div>

                <div className="pt-6">
                  <Button 
                    variant="black" 
                    size="lowther" 
                    onClick={() => setIsCommissionFormOpen(true)}
                  >
                    ENQUIRE NOW
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Lifestyle Images Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-8 text-[#c59862]">
                {lifestyleHeading}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {lifestyleImages.map((image, index) => (
              <ScrollReveal key={index} animation="scale" delay={index * 100}>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg leading-relaxed text-gray-800 mb-8">
                {approvedCopy.lifestyle_copy}
              </p>

              <Button 
                variant="black" 
                size="lowther" 
                onClick={() => setIsCommissionFormOpen(true)}
              >
                ORDER NOW
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section data-surface="light" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl text-[#c59862] mb-4">
                Handcrafted in Great Britain
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every {speaker.title} is handmade to order in our Northampton workshop. Each piece is built with care from start to finish by British craftsmen.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {craftsmanshipContent.map((item, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="group">
                  <div className="relative aspect-[9/10] mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-2xl text-[#c59862] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-[#c59862]">
              What the Press Say
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {reviews.map((review, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100} className="flex">
                <Link 
                  href={review.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group flex-1"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-[#c59862]">
                    <div className="relative h-20 mb-6 flex items-center justify-center">
                      <Image
                        src={review.logo}
                        alt={review.publication}
                        fill
                        className={`object-contain ${review.publication === 'HiFi+' ? 'scale-50' : ''}`}
                      />
                    </div>
                    <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">
                      "{review.quote}"
                    </p>
                    <div className="flex items-center justify-between text-[#c59862] group-hover:text-[#a07b4d] transition-colors">
                      <span className="font-semibold">Read Full Review</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Quotes Section */}
      <section data-surface="light" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-[#c59862]">
              What Our Customers Say
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerQuotes.map((quote, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 50}>
                <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700 italic leading-relaxed">
                    "{quote.quote}"
                  </p>
                  {quote.author && (
                    <p className="text-sm text-gray-500 mt-4">— {quote.author}</p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Form */}
      <CommissionForm 
        isOpen={isCommissionFormOpen} 
        onClose={() => setIsCommissionFormOpen(false)}
        speakerName="Almira"
      />

      {/* Fullscreen Gallery Overlay */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={previousImage}
            className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
}

