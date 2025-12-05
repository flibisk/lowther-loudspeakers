import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FeaturedMasterpieces } from "@/components/featured-masterpieces";
import { EdiliaBanner } from "@/components/edilia-banner";
import { PhilharmonicCollection } from "@/components/philharmonic-collection";
import { CatalogueOrder } from "@/components/catalogue-order";
import { BlogSection } from "@/components/blog-section";
import { BuildALowtherBanner } from "@/components/build-a-lowther-banner";
import { ReviewsSection } from "@/components/reviews-section";
import { HistoryBanner } from "@/components/history-banner";
import { HomepageFAQ } from "@/components/homepage-faq";
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("home");

export const metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/",
});

export const dynamic = "force-dynamic";

type HeroVariant =
  | {
      id: string;
      type: "video";
      src: string;
      title: string;
      subtitle: string;
      eyebrow: string;
      cta: string;
    }
  | {
      id: string;
      type: "image";
      src: string;
      mobileSrc?: string;
      title: string;
      subtitle: string;
      eyebrow: string;
      cta: string;
    };

const HERO_VARIANTS: HeroVariant[] = [
  {
    id: "voigt-horn",
    type: "video",
    src: "/videos/Banner-Voigt-Horn.mp4",
    title: "The 4ft Voigt Horn",
    subtitle:
      "More than just a loudspeaker. Every 4ft Voigt Horn represents a piece of Hi-Fi history, a moment in time preserved in an eternity of music.",
    eyebrow: "A LOWTHER MASTERPIECE",
    cta: "/loudspeakers/voigt-horn",
  },
  {
    id: "philharmonic-collection",
    type: "image",
    src: "/images/drive-units/philharmonic-collection/hero/Philharmonic-hero1.avif",
    title: "The Philharmonic Collection",
    subtitle: "Our most refined offering of instruments, standard in every Lowther masterpiece.",
    eyebrow: "DRIVE UNITS",
    cta: "/collection/philharmonic",
  },
  {
    id: "super-tweeter",
    type: "image",
    src: "/images/drive-units/super-tweeter/hero/supertweeter-hero.jpg",
    title: "The Lowther Super Tweeter",
    subtitle: "Completing the top octave with precision and intent.",
    eyebrow: "DRIVE UNITS",
    cta: "/collection/super-tweeter",
  },
  {
    id: "quarter-wave",
    type: "image",
    src: "/images/speakers/quarter-wave/hero/quarter-wave-hero2.jpg",
    mobileSrc: "/images/speakers/quarter-wave/hero/quarterwave_hero-mobile.avif",
    title: "Simply just works.",
    subtitle: "Engineered with the flexibility to perform anywhere in a room, even behind furniture.",
    eyebrow: "LOUDSPEAKERS",
    cta: "/loudspeakers/acousta-quarter-wave",
  },
  {
    id: "hegeman",
    type: "image",
    src: "/images/speakers/hegeman/hero/hegeman-hero.webp",
    title: "Exclusive and reverent.",
    subtitle: "Hegeman, a reimagining of Lowther's horn legacy.",
    eyebrow: "LOUDSPEAKERS",
    cta: "/loudspeakers/hegeman",
  },
];

export default async function HomePage() {
  const heroVariant =
    HERO_VARIANTS[Math.floor(Math.random() * HERO_VARIANTS.length)] ?? HERO_VARIANTS[0];

  const isVideo = heroVariant.type === "video";
  const backgroundAlt =
    heroVariant.type === "image"
      ? heroVariant.title
      : "Lowther Loudspeakers hero background";

  // Generate FAQ schema for homepage
  const faqSchema = generateStructuredData('FAQPage', {
    faqs: [
      {
        question: 'What is a Lowther Masterpiece?',
        answer: 'Lowther Masterpieces are our handcrafted folded-horn loudspeakers, built to order in the veneers and style that suit your home.',
      },
      {
        question: 'What makes horn loaded loudspeakers different?',
        answer: 'Horn loaded designs use carefully shaped enclosures to control how sound leaves the driver, giving higher efficiency, scale, and realism from a single full-range unit.',
      },
      {
        question: 'Who are Lowther loudspeakers for?',
        answer: 'They are for listeners who value natural, lifelike reproduction and are willing to invest in carefully placed, handmade loudspeakers rather than mass-market systems.',
      },
      {
        question: 'Can I build my own Lowther speakers?',
        answer: 'Yes. Our "Build your Lowther" plans and drive units are designed for home builders who want to create their own horn loaded loudspeakers using our designs.',
      },
    ],
  });

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO - Dark video section */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        {isVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src={heroVariant.src}
          />
        ) : (
          <>
            <Image
              src={heroVariant.src}
              alt={backgroundAlt}
              fill
              priority
              className="hidden 930:block absolute inset-0 h-full w-full object-cover"
            />
            <Image
              src={heroVariant.mobileSrc ?? heroVariant.src}
              alt={backgroundAlt}
              fill
              priority
              className="930:hidden absolute inset-0 h-full w-full object-cover"
            />
          </>
        )}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.7) 20%, rgba(0, 0, 0, 0) 100%)'
          }}
        ></div>
        
        {/* Text Overlay - Mobile: Stacked, Desktop: Side by side */}
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          {/* Small line and category */}
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">
              {heroVariant.eyebrow}
            </span>
          </div>
          
          {/* Main title */}
          <h1
            className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4"
            style={{ color: "#c59862" }}
          >
            {heroVariant.title}
          </h1>
          
          {/* Description */}
          <p className="hidden 930:block text-lg text-white/90 leading-relaxed mb-6 930:mb-0">
            {heroVariant.subtitle}
          </p>
        </div>

        {/* Button - Mobile/Tablet: Below text, Desktop: Hidden (moved to separate div) */}
        <div className="930:hidden absolute bottom-8 left-6 z-10">
          <Button 
            variant="white"
            size="lowther"
            asChild
          >
            <Link href={heroVariant.cta}>LEARN MORE</Link>
          </Button>
        </div>

        {/* Button - Desktop: Bottom Right */}
        <div className="hidden 930:block absolute bottom-20 right-16 z-10">
          <Button 
            variant="white"
            size="lowther"
            asChild
          >
            <Link href={heroVariant.cta}>LEARN MORE</Link>
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

      {/* AEO/SEO: Visually hidden semantic content */}
      <div className="visually-hidden">
        <h1>Lowther Loudspeakers</h1>
        <p>Handcrafted British loudspeakers built since the 1930s. Makers of horn loaded and full range systems, drive units, and bespoke audio instruments.</p>
      </div>

      {/* LIGHT CONTENT - Featured Masterpieces */}
      <FeaturedMasterpieces />

      {/* EDILIA BANNER - Dark atmospheric banner */}
      <EdiliaBanner />

      {/* PHILHARMONIC COLLECTION - Drive units showcase */}
      <PhilharmonicCollection />

      {/* CATALOGUE ORDER - Dark atmospheric banner */}
      <CatalogueOrder />

      {/* FAQ SECTION - Frequently asked questions */}
      <HomepageFAQ />

      {/* BLOG SECTION - From Our Blog */}
      <BlogSection />

      {/* BUILD A LOWTHER BANNER - Dark atmospheric banner */}
      <BuildALowtherBanner />

      {/* REVIEWS SECTION - Customer testimonials */}
      <ReviewsSection />

      {/* HISTORY BANNER - Dark atmospheric banner */}
      <HistoryBanner />

    </>
  );
}