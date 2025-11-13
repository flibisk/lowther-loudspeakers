import { Button } from "@/components/ui/button";
import { FeaturedMasterpieces } from "@/components/featured-masterpieces";
import { EdiliaBanner } from "@/components/edilia-banner";
import { PhilharmonicCollection } from "@/components/philharmonic-collection";
import { CatalogueOrder } from "@/components/catalogue-order";
import { BlogSection } from "@/components/blog-section";
import { BuildALowtherBanner } from "@/components/build-a-lowther-banner";
import { ReviewsSection } from "@/components/reviews-section";
import { HistoryBanner } from "@/components/history-banner";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";
import Link from "next/link";

const pageMetadata = getPageMetadata("home");

export const metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/",
});

export default async function HomePage() {
  return (
    <>
      {/* HERO - Dark video section */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <video 
          className="absolute inset-0 h-full w-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline 
          src="/videos/Banner-Voigt-Horn.mp4" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        
        {/* Text Overlay - Mobile: Stacked, Desktop: Side by side */}
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          {/* Small line and category */}
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">A LOWTHER MASTERPIECE</span>
          </div>
          
          {/* Main title */}
          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            The 4ft Voigt Horn
          </h1>
          
          {/* Description */}
          <p className="text-lg text-white/90 leading-relaxed mb-6 930:mb-0">
            More than just a loudspeaker. Every 4ft Voigt Horn represents a piece of Hi-Fi history, a moment in time preserved in an eternity of music.
          </p>
        </div>

        {/* Button - Mobile/Tablet: Below text, Desktop: Hidden (moved to separate div) */}
        <div className="930:hidden absolute bottom-8 left-6 z-10">
          <Button 
            variant="white"
            size="lowther"
            asChild
          >
            <Link href="/loudspeakers/voigt-horn">LEARN MORE</Link>
          </Button>
        </div>

        {/* Button - Desktop: Bottom Right */}
        <div className="hidden 930:block absolute bottom-20 right-16 z-10">
          <Button 
            variant="white"
            size="lowther"
            asChild
          >
            <Link href="/loudspeakers/voigt-horn">LEARN MORE</Link>
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

      {/* LIGHT CONTENT - Featured Masterpieces */}
      <FeaturedMasterpieces />

      {/* EDILIA BANNER - Dark atmospheric banner */}
      <EdiliaBanner />

      {/* PHILHARMONIC COLLECTION - Drive units showcase */}
      <PhilharmonicCollection />

      {/* CATALOGUE ORDER - Dark atmospheric banner */}
      <CatalogueOrder />

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