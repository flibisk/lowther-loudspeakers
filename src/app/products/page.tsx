'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

// Speaker data with nav menu images
const speakers = [
  {
    id: "quarterwave",
    title: "Quarter Wave",
    feeling: "Discreet. Architectural.",
    image: "/images/Menu/masterpieces/acousta-qw.jpg",
    href: "/loudspeakers/acousta-quarter-wave"
  },
  {
    id: "edilia",
    title: "Edilia", 
    feeling: "Elegant. Focused.",
    image: "/images/Menu/masterpieces/edilia.jpg",
    href: "/loudspeakers/edilia"
  },
  {
    id: "hegeman",
    title: "Hegeman",
    feeling: "Exclusive. Reverent.",
    image: "/images/Menu/masterpieces/hegeman.jpg", 
    href: "/loudspeakers/hegeman"
  },
  {
    id: "acousta-117",
    title: "Acousta 117",
    feeling: "Timeless. Versatile.",
    image: "/images/Menu/masterpieces/acousta-117.jpg",
    href: "/loudspeakers/acousta-117"
  },
  {
    id: "almira",
    title: "Almira",
    feeling: "Balanced. Expressive.",
    image: "/images/Menu/masterpieces/almira.jpg",
    href: "/loudspeakers/almira"
  },
  {
    id: "tp2",
    title: "TP2",
    feeling: "Powerful. Grand.",
    image: "/images/Menu/masterpieces/tp2.jpg",
    href: "/loudspeakers/tp2"
  },
  {
    id: "audiovector",
    title: "Audiovector",
    feeling: "Dynamic. Bold.",
    image: "/images/Menu/masterpieces/audiovector.jpg",
    href: "/loudspeakers/audiovector"
  },
  {
    id: "voigt-horn",
    title: "Voigt Horn",
    feeling: "Historic. Iconic.",
    image: "/images/Menu/masterpieces/voigt-horn.jpg",
    href: "/loudspeakers/voigt-horn"
  }
];

// Instrument collections with nav menu images
const collections = [
  {
    id: "concert-collection",
    title: "The Concert Collection",
    description: "Hand-crafted drive units deliver the legendary immediate and detailed sound.",
    image: "/images/Menu/instruments/concert-collection.jpg",
    href: "/collection/concert"
  },
  {
    id: "sinfonia-collection",
    title: "The Sinfonia Collection",
    description: "Enhanced performance with neodymium magnets for exceptional clarity.",
    image: "/images/Menu/instruments/sinfonia-collection.jpg",
    href: "/collection/sinfonia"
  },
  {
    id: "philharmonic-collection",
    title: "The Philharmonic Collection",
    description: "Commissioning-based artistry with field-coil designs for discerning collectors.",
    image: "/images/Menu/instruments/philharmonic-collection.jpg",
    href: "/collection/philharmonic"
  },
  {
    id: "grand-opera-collection",
    title: "The Grand Opera Collection",
    description: "Our flagship collection representing the pinnacle of acoustic achievement.",
    image: "/images/Menu/instruments/grand-opera-collection.jpg",
    href: "/collection/grand-opera"
  }
];

// Ensemble items with corrected image paths
const ensembleItems = [
  {
    id: "px4-amplifier",
    title: "The PX4 AMP",
    subtitle: "Amplifier",
    image: "/images/Menu/Ensemble/PX4-Amplifier.avif",
    href: "/ensemble/px4-amplifier"
  },
  {
    id: "reference-cables",
    title: "Premium Cables",
    subtitle: "Cables",
    image: "/images/Menu/Ensemble/Reference-Cables.avif",
    href: "/ensemble/reference-cables"
  },
  {
    id: "phase-plugs",
    title: "Phase Plugs",
    subtitle: "Enhancement",
    image: "/images/Menu/Ensemble/Phase-Plugs.webp",
    href: "/ensemble/phase-plugs"
  },
  {
    id: "lowther-badges",
    title: "Lowther Badges",
    subtitle: "Authenticity",
    image: "/images/Menu/Ensemble/Lowther-badges.avif",
    href: "/ensemble/lowther-badges"
  },
  {
    id: "residential-design",
    title: "Residential System Design",
    subtitle: "Service",
    image: "/images/Menu/Ensemble/White-Glove-residential.avif",
    href: "/ensemble/residential-system-design"
  },
  {
    id: "commercial-design",
    title: "Commercial System Design",
    subtitle: "Service",
    image: "/images/Menu/Ensemble/Commercial-white-glove.avif",
    href: "/ensemble/commercial-system-design"
  }
];

export default function ProductsPage() {
  const masterpiecesRef = useRef<HTMLDivElement>(null);
  const instrumentsRef = useRef<HTMLDivElement>(null);
  const ensembleRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 400;
      const newScrollPosition = ref.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      ref.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Video Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/product-page/hero/Handmade-to-order-Banner.webm" type="video/webm" />
          <source src="/images/product-page/hero/Handmade-to-order-Banner.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Content - Bottom Left */}
        <div className="absolute bottom-8 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-5xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">LOWTHER LOUDSPEAKERS</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight" style={{ color: '#c59862' }}>
            Craftsmanship that Transcends Time.<br />
            Sound that Transforms your Space.
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">
            All our speakers are designed by ear, built by hand and exist for one reason: to enhance the experience of listening to music.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <div id="hero-sentinel" className="absolute bottom-0 h-[1px] w-full" />
      </section>

      {/* Our Masterpieces Section */}
      <section className="py-24 bg-white overflow-hidden">
        {/* Header with constrained width */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl mb-4" style={{ color: '#c59862' }}>
                Our Masterpieces
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Handcrafted, folded-horn speakers housing our legendary full-range sonic instruments.
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll(masterpiecesRef, 'left')}
                className="p-2 rounded-full border border-gray-300 hover:border-[#c59862] hover:text-[#c59862] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll(masterpiecesRef, 'right')}
                className="p-2 rounded-full border border-gray-300 hover:border-[#c59862] hover:text-[#c59862] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container - full width */}
        <div 
          ref={masterpiecesRef}
          className="overflow-x-auto scrollbar-hide px-6 sm:px-8 lg:px-12"
        >
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                {speakers.map((speaker) => (
                  <div key={speaker.id} className="w-[320px] flex-shrink-0 group">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                      <Image
                        src={speaker.image}
                        alt={speaker.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="320px"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      
                      {/* Text Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                        <h3 className="text-[#c59862] text-2xl mb-2">
                          {speaker.title}
                        </h3>
                        <p className="text-white text-lg mb-6">
                          {speaker.feeling}
                        </p>
                        <Link href={speaker.href}>
                          <Button 
                            variant="white" 
                            size="lowther"
                          >
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Our Instruments Section */}
      <section className="py-24 bg-white overflow-hidden">
        {/* Header with constrained width */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl mb-4" style={{ color: '#c59862' }}>
                Our Instruments
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                At the core of every Lowther acoustic masterpiece beats a heart of our legendary drive units.
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll(instrumentsRef, 'left')}
                className="p-2 rounded-full border border-gray-300 hover:border-[#c59862] hover:text-[#c59862] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll(instrumentsRef, 'right')}
                className="p-2 rounded-full border border-gray-300 hover:border-[#c59862] hover:text-[#c59862] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container - full width */}
        <div 
          ref={instrumentsRef}
          className="overflow-x-auto scrollbar-hide px-6 sm:px-8 lg:px-12"
        >
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                {collections.map((collection) => (
                  <div key={collection.id} className="w-[320px] flex-shrink-0 group">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                      <Image
                        src={collection.image}
                        alt={collection.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="320px"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      
                      {/* Text Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                        <h3 className="text-[#c59862] text-2xl mb-6">
                          {collection.title}
                        </h3>
                        <Link href={collection.href}>
                          <Button 
                            variant="white" 
                            size="lowther"
                          >
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Lowther Ensemble Section */}
      <section className="py-24 bg-white overflow-hidden">
        {/* Header with constrained width */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl mb-4" style={{ color: '#c59862' }}>
                The Lowther Ensemble
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Crafted to complete and elevate your Lowther sound.
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll(ensembleRef, 'left')}
                className="p-2 rounded-full border border-gray-300 hover:border-[#c59862] hover:text-[#c59862] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll(ensembleRef, 'right')}
                className="p-2 rounded-full border border-gray-300 hover:border-[#c59862] hover:text-[#c59862] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container - full width */}
        <div 
          ref={ensembleRef}
          className="overflow-x-auto scrollbar-hide px-6 sm:px-8 lg:px-12"
        >
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                {ensembleItems.map((item) => (
                  <div key={item.id} className="w-[320px] flex-shrink-0 group">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="320px"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      
                      {/* Text Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                        <p className="text-gray-300 text-xs uppercase tracking-wider mb-2">
                          {item.subtitle}
                        </p>
                        <h3 className="text-[#c59862] text-2xl mb-6">
                          {item.title}
                        </h3>
                        <Link href={item.href}>
                          <Button 
                            variant="white" 
                            size="lowther"
                          >
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}
