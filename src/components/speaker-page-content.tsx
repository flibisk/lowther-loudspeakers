'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CommissionForm } from '@/components/commission-form';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { X, ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';

interface SpeakerPageContentProps {
  speaker: any;
  technical: any;
  approvedCopy: any;
  heroImage: string;
  heroVideo?: string;
  mobileHeroImage?: string;
  galleryImages: Array<{ src: string; alt: string }>;
  specsImage: string;
  specsImages?: Array<string>;
  craftsmanshipContent: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  customerQuotes: Array<{ quote: string; author?: string }>;
  lifestyleHeading: string;
  lifestyleImages: Array<{ src: string; alt: string }>;
  showGenericCraftsmanship?: boolean;
  genericCraftsmanshipHeading?: string;
  speakerCraftsmanshipHeading?: string;
  speakerVideo?: {
    title: string;
    thumbnail: string;
    videoUrl: string;
    loopVideo?: string;
  };
  speakerVideos?: Array<{
    title: string;
    thumbnail: string;
    videoUrl: string;
    loopVideo?: string;
  }>;
  remakingVideo?: {
    heading: string;
    description: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
    loopVideo?: string;
  };
  pressReviews?: Array<{
    logo: string;
    quote: string;
    author: string;
    publication: string;
    link: string;
  }>;
}

export function SpeakerPageContent({ 
  speaker, 
  technical, 
  approvedCopy,
  heroImage,
  heroVideo,
  mobileHeroImage,
  galleryImages,
  specsImage,
  specsImages,
  craftsmanshipContent,
  customerQuotes,
  lifestyleHeading,
  lifestyleImages,
  showGenericCraftsmanship = true,
  genericCraftsmanshipHeading = 'Handcrafted in Great Britain',
  speakerCraftsmanshipHeading,
  speakerVideo,
  speakerVideos,
  remakingVideo,
  pressReviews
}: SpeakerPageContentProps) {
  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

  // Generic craftsmanship content (same for all speakers)
  const genericCraftsmanship = [
    {
      title: 'The Finest Materials',
      description: 'We use high-grade Baltic birch plywood for strength and tonal purity. Every panel is cut, shaped and joined by hand for perfect alignment.',
      image: '/images/speakers/quarter-wave/details/900x1000 - birch plywood.jpg'
    },
    {
      title: 'Matched Veneers',
      description: 'You can choose from a range of real wood and specialist veneers. Each pair is book-matched to create a natural flow of grain that suits your space.',
      image: '/images/speakers/quarter-wave/details/900x1000 - real-wood-veneers.jpg'
    },
    {
      title: 'The Heart of the Sound',
      description: 'The drive units, including the PM7A Philharmonic, are assembled in our Norfolk atelier. Every part is crafted to the same standard as the world\'s finest instruments.',
      image: '/images/speakers/quarter-wave/details/900x1000 - Lowther drive unit.jpg'
    },
    {
      title: 'Paper Cones',
      description: 'Each cone is hand-treated, air-dried and cured in natural sunlight. This gives every Lowther its unmistakably natural tone.',
      image: '/images/speakers/quarter-wave/details/900x1000 - lowther paper cones curing in sunlight.jpg'
    },
    {
      title: 'Built to Endure',
      description: 'From wood to wire, every element is made to last for generations. A Lowther is not a product but an instrument that grows more beautiful with time.',
      image: '/images/speakers/quarter-wave/details/900x1000 - Old woodworking machine.jpg'
    },
    {
      title: 'Handmade Excellence',
      description: 'Every cut, every joint, every finish is completed by hand. Our craftsmen bring decades of experience to each speaker, ensuring uncompromising quality.',
      image: '/images/speakers/quarter-wave/details/900x1000 - Hand-saw-speaker-making.jpg'
    }
  ];

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

  const openVideo = (videoUrl: string, videoTitle: string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentVideoTitle(videoTitle);
    setIsVideoOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    setCurrentVideoUrl('');
    setCurrentVideoTitle('');
    document.body.style.overflow = 'unset';
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

  return (
    <>
      {/* Hero Section - Like Homepage Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        {/* Desktop Background - Video or Image */}
        {heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hidden 930:block absolute inset-0 h-full w-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={heroImage}
            alt={`${speaker.title} loudspeaker`}
            fill
            className="hidden 930:block absolute inset-0 h-full w-full object-cover"
            priority
          />
        )}
        {/* Mobile Image */}
        <Image
          src={mobileHeroImage || heroImage}
          alt={`${speaker.title} loudspeaker`}
          fill
          className="block 930:hidden absolute inset-0 h-full w-full object-cover"
          priority
        />
        {/* Black to transparent gradient overlay for text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Text Overlay - Mobile: Stacked, Desktop: Side by side */}
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          {/* Small line and category */}
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">A LOWTHER MASTERPIECE</span>
          </div>
          
          {/* Main title */}
          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            {speaker.title}
          </h1>
          
          {/* Description */}
          <p className="text-lg text-white/90 leading-relaxed mb-6 930:mb-0">
            {approvedCopy.hero_subheading}
          </p>
        </div>

        {/* Button - Mobile: Below text, Desktop: Bottom Right */}
        <div className="absolute bottom-8 930:bottom-20 left-6 930:left-auto 930:right-16 z-10 w-auto 930:w-auto">
          <Button 
            variant="white"
            size="lowther"
            onClick={() => setIsCommissionFormOpen(true)}
          >
            COMMISSION YOURS
          </Button>
        </div>

        {/* Scroll Indicator - Bottom Center - Hidden on mobile when button is below text */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Sentinel sits at the bottom of the hero */}
        <div id="hero-sentinel" className="absolute bottom-0 h-[1px] w-full" />
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/loudspeakers' },
          { label: 'Masterpieces', href: '/loudspeakers' },
          { label: speaker.title }
        ]}
      />

      {/* Simply Just Works Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          {/* Section Label */}
          <ScrollReveal animation="fade-in">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-12 bg-gray-300"></div>
              <span className="px-4 text-xs tracking-[0.2em] uppercase text-gray-500">{speaker.title.toUpperCase()}</span>
              <div className="h-px w-12 bg-gray-300"></div>
            </div>
          </ScrollReveal>

          {/* Main Heading */}
          <ScrollReveal animation="fade-up" delay={100}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-12 text-[#c59862]">
              {approvedCopy.hero_heading}
            </h2>
          </ScrollReveal>

          {/* Body Copy */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="space-y-6 text-lg leading-relaxed text-gray-800 mb-12">
              {speaker.content.long_description.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>
          </ScrollReveal>

          {/* CTA Button */}
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

      {/* Bento Box Gallery Section */}
      <section data-surface="light" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Simple responsive grid with consistent heights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Multiple speaker-specific videos (if provided) - each spans 3 columns */}
            {speakerVideos && speakerVideos.map((video, videoIndex) => (
              <ScrollReveal key={`video-${videoIndex}`} animation="scale" className="sm:col-span-2 lg:col-span-3">
                <div 
                  className="group relative aspect-[21/9] overflow-hidden rounded-lg cursor-pointer bg-black"
                  onClick={() => openVideo(video.videoUrl, video.title)}
                  onMouseEnter={() => setHoveredVideo(videoIndex)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  {/* Loop video on hover */}
                  {video.loopVideo && hoveredVideo === videoIndex ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      <source src={video.loopVideo} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-[#c59862] transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                      <Play className="w-8 h-8 text-black group-hover:text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Video title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-semibold text-lg">{video.title}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {/* Single speaker-specific video (if provided, legacy support) - spans 3 columns */}
            {!speakerVideos && speakerVideo && (
              <ScrollReveal animation="scale" className="sm:col-span-2 lg:col-span-3">
                <div 
                  className="group relative aspect-[21/9] overflow-hidden rounded-lg cursor-pointer bg-black"
                  onClick={() => openVideo(speakerVideo.videoUrl, speakerVideo.title)}
                  onMouseEnter={() => setHoveredVideo(0)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  {/* Loop video on hover */}
                  {speakerVideo.loopVideo && hoveredVideo === 0 ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      <source src={speakerVideo.loopVideo} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={speakerVideo.thumbnail}
                      alt={speakerVideo.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-[#c59862] transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                      <Play className="w-8 h-8 text-black group-hover:text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Video title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-semibold text-lg">{speakerVideo.title}</p>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Gallery images */}
            {galleryImages.map((image, index) => (
              <ScrollReveal 
                key={index}
                animation="scale"
                delay={((speakerVideos?.length || (speakerVideo ? 1 : 0)) + index) * 100}
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

      {/* Specs Section - Two Column Table */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Heading */}
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-[#c59862]">
              Specs
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Technical Diagram(s) */}
            <ScrollReveal animation="slide-right" delay={100}>
              <div className="flex flex-col items-center justify-center space-y-8">
                {specsImages ? (
                  specsImages.map((imageSrc, index) => (
                    <div key={index} className="w-full max-w-md">
                      <Image
                        src={imageSrc}
                        alt={`${speaker.title} technical dimensions ${index + 1}`}
                        width={400}
                        height={600}
                        className="w-full h-auto"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full max-w-md">
                    <Image
                      src={specsImage}
                      alt={`${speaker.title} technical dimensions`}
                      width={400}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Right: Specifications Table */}
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
                <h3 className="text-sm font-semibold mb-2">Recommended Lowther Drive Unit</h3>
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
          </div>
        </div>
      </section>

      {/* Remaking Video Section (if provided) */}
      {remakingVideo && (
        <section data-surface="dark" className="py-24 bg-black">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-8">
                <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                  {remakingVideo.heading}
                </h2>
                <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                  {remakingVideo.description}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={200}>
              <div 
                className="group relative aspect-video overflow-hidden rounded-lg cursor-pointer bg-black"
                onClick={() => openVideo(remakingVideo.videoUrl, remakingVideo.title)}
                onMouseEnter={() => setHoveredVideo(-1)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                {/* Loop video on hover */}
                {remakingVideo.loopVideo && hoveredVideo === -1 ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={remakingVideo.loopVideo} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={remakingVideo.thumbnail}
                    alt={remakingVideo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-[#c59862] transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                    <Play className="w-10 h-10 text-black group-hover:text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Video title */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-semibold text-xl">{remakingVideo.title}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Generic Handcrafted in Great Britain Section - Only shown for certain speakers */}
      {showGenericCraftsmanship && (
        <section data-surface="light" className="py-24 bg-[#fafaf8]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Section Heading */}
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <h2 className="font-display text-4xl md:text-5xl text-[#c59862] mb-4">
                  {genericCraftsmanshipHeading}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Every {speaker.title} is handmade to order in our Northampton workshop. Each piece is built with care from start to finish by British craftsmen.
                </p>
              </div>
            </ScrollReveal>

            {/* Craftsmanship Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {genericCraftsmanship.map((item, index) => (
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
      )}

      {/* Lifestyle Images Section */}
      <section data-surface="light" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Heading Above Images */}
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

      {/* Speaker-Specific Details Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Heading */}
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl text-[#c59862] mb-4">
                {speakerCraftsmanshipHeading || `The Details That Define the ${speaker.title}`}
              </h2>
            </div>
          </ScrollReveal>

          {/* Craftsmanship Grid - Dynamic columns based on content length */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${craftsmanshipContent.length === 3 || craftsmanshipContent.length >= 6 ? 'lg:grid-cols-3' : ''}`}>
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

      {/* Press Reviews Section */}
      {pressReviews && pressReviews.length > 0 && (
        <section data-surface="light" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <ScrollReveal animation="fade-up">
              <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-[#c59862]">
                What the Press Say
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {pressReviews.map((review, index) => (
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
                      <div className="text-sm text-gray-500 mb-4">
                        — {review.author}
                      </div>
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
      )}

      {/* Customer Quotes Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Heading */}
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl text-[#c59862] mb-4">
                What Owners Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real experiences from {speaker.title} owners around the world
              </p>
            </div>
          </ScrollReveal>

          {/* Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerQuotes.map((item, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 50}>
                <div className="backdrop-blur-md bg-white/50 p-8 rounded-2xl shadow-md border border-white/60 hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                  <p className="text-gray-800 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                  {item.author && (
                    <p className="mt-4 text-sm text-gray-600">— {item.author}</p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA Button */}
          <ScrollReveal animation="scale" delay={300}>
            <div className="text-center mt-12">
              <Button 
                variant="black" 
                size="lowther" 
                onClick={() => setIsCommissionFormOpen(true)}
              >
                COMMISSION YOUR PAIR
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection />

      {/* Commission Form - Slide-in from right */}
      <CommissionForm 
        isOpen={isCommissionFormOpen}
        onClose={() => setIsCommissionFormOpen(false)}
        speakerName={speaker.title}
      />

      {/* Fullscreen Gallery Overlay */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 z-10 p-2 text-white hover:text-[#c59862] transition-colors"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 z-10 text-white text-lg">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={previousImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-[#c59862] transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-[#c59862] transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>

          {/* Current Image */}
          <div className="relative w-full h-full flex items-center justify-center p-12">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                src={galleryImages[currentImageIndex].src}
                alt={galleryImages[currentImageIndex].alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Overlay */}
      {isVideoOpen && currentVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeVideo}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-6xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`${currentVideoUrl}?autoplay=1`}
              title={currentVideoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

