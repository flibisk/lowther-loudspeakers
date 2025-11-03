import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { getAllCollections } from '@/lib/utils/drive-units-loader';

// Speaker data
const speakers = [
  {
    id: "quarterwave",
    title: "Quarter Wave",
    feeling: "Discreet. Architectural.",
    image: "/images/card-images/card-image-acoustaQW.avif",
    href: "/loudspeakers/acousta-quarter-wave"
  },
  {
    id: "edilia",
    title: "Edilia", 
    feeling: "Elegant. Focused.",
    image: "/images/card-images/card-image-Edillia.webp",
    href: "/loudspeakers/edilia"
  },
  {
    id: "hegeman",
    title: "Hegeman",
    feeling: "Exclusive. Reverent.",
    image: "/images/card-images/card-image-hegeman.webp", 
    href: "/loudspeakers/hegeman"
  },
  {
    id: "acousta-117",
    title: "Acousta 117",
    feeling: "Timeless. Versatile.",
    image: "/images/card-images/card-image-Acousta-117.webp",
    href: "/speakers/acousta-117"
  },
  {
    id: "almira",
    title: "Almira",
    feeling: "Balanced. Expressive.",
    image: "/images/card-images/card-image-Almira.webp",
    href: "/speakers/almira"
  },
  {
    id: "tp2",
    title: "TP2",
    feeling: "Powerful. Grand.",
    image: "/images/card-images/card-image-TP2.webp",
    href: "/speakers/tp2"
  },
  {
    id: "audiovector",
    title: "Audiovector",
    feeling: "Dynamic. Bold.",
    image: "/images/card-images/card-image-audiovector.webp",
    href: "/speakers/audiovector"
  },
  {
    id: "voigt-horn",
    title: "Voigt Horn",
    feeling: "Historic. Iconic.",
    image: "/images/card-images/card-image-voigt-horn.avif",
    href: "/speakers/voigt-horn"
  }
];

// Ensemble items data
const ensembleItems = [
  {
    id: "px4-amplifier",
    title: "The PX4 AMP",
    subtitle: "Amplifier",
    image: "/images/ensemble/px4-amplifier/gallery/Green-Lowther-PX4-Tube-Amplifier-transparent.avif",
    href: "/ensemble/px4-amplifier"
  },
  {
    id: "reference-cables",
    title: "Premium Cables",
    subtitle: "Cables",
    image: "/images/ensemble/reference-cables/gallery/Lowther-Premium-Reference-Cable-Pair.avif",
    href: "/ensemble/reference-cables"
  },
  {
    id: "phase-plugs",
    title: "Phase Plugs",
    subtitle: "Enhancement",
    image: "/images/ensemble/phase-plugs/gallery/Lowther-Phase-Plugs.avif",
    href: "/ensemble/phase-plugs"
  },
  {
    id: "lowther-badges",
    title: "Lowther Badges",
    subtitle: "Authenticity",
    image: "/images/ensemble/lowther-badges/gallery/Lowther-Badge-Plaque-Kit.avif",
    href: "/ensemble/lowther-badges"
  },
  {
    id: "residential-design",
    title: "Residential System Design",
    subtitle: "Service",
    image: "/images/ensemble/residential-system-design/gallery/Lowther-Residential-Listening-Room-Design.avif",
    href: "/ensemble/residential-system-design"
  },
  {
    id: "commercial-design",
    title: "Commercial System Design",
    subtitle: "Service",
    image: "/images/ensemble/commercial-system-design/gallery/Lowther-Commercial-Listening-Room-Design.avif",
    href: "/ensemble/commercial-system-design"
  }
];

export default function ProductsPage() {
  const collections = getAllCollections();

  return (
    <div className="min-h-screen bg-white">
      {/* Video Banner */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight">
            Craftsmanship that Transcends Time.<br />
            Sound that Transforms your Space.
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            All our speakers are designed by ear, built by hand and exist for one reason: to enhance the experience of listening to music.
          </p>
        </div>
      </section>

      {/* Our Masterpieces Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl mb-4" style={{ color: '#c59862' }}>
                Our Masterpieces
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Handcrafted, folded-horn speakers housing our legendary full-range sonic instruments.
              </p>
            </div>
            <Link 
              href="/category/loudspeakers"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {speakers.map((speaker) => (
                <Link 
                  key={speaker.id} 
                  href={speaker.href}
                  className="block w-[320px] flex-shrink-0"
                >
                  <Card className="overflow-hidden group h-full hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <Image
                        src={speaker.image}
                        alt={speaker.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                    </div>
                    <CardHeader className="pt-6 pb-6">
                      <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-[#c59862] transition-colors">
                        {speaker.title}
                      </h3>
                      <p className="text-gray-600 text-sm italic">
                        {speaker.feeling}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile View All Link */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/category/loudspeakers"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Our Instruments Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl mb-4" style={{ color: '#c59862' }}>
                Our Instruments
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                At the core of every Lowther acoustic masterpiece beats a heart of our legendary drive units.
              </p>
            </div>
            <Link 
              href="/category/drive-units"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {collections.map((collection: any) => (
                <Link 
                  key={collection.id} 
                  href={`/collection/${collection.slug}`}
                  className="block w-[400px] flex-shrink-0"
                >
                  <Card className="overflow-hidden group h-full hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <Image
                        src={`${collection.images?.base || '/images/drive-units/'}${collection.slug}/hero/${collection.slug}-hero.jpg`}
                        alt={collection.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="400px"
                        onError={(e) => {
                          // Fallback image logic
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    <CardHeader className="pt-6 pb-6">
                      <h3 className="font-display text-2xl font-semibold mb-3 group-hover:text-[#c59862] transition-colors">
                        {collection.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {collection.short_description}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile View All Link */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/category/drive-units"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Lowther Ensemble Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl mb-4" style={{ color: '#c59862' }}>
                The Lowther Ensemble
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Crafted to complete and elevate your Lowther sound.
              </p>
            </div>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {ensembleItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.href}
                  className="block w-[320px] flex-shrink-0"
                >
                  <Card className="overflow-hidden group h-full hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                    </div>
                    <CardHeader className="pt-6 pb-6">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {item.subtitle}
                      </p>
                      <h3 className="font-display text-xl font-semibold group-hover:text-[#c59862] transition-colors">
                        {item.title}
                      </h3>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

