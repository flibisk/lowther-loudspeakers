'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function HandcraftedPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/handcrafted/hero/Handcrafted-hero.avif"
          alt="Handcrafted to Order"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">THE LOWTHER WAY</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Handcrafted to Order
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Every Lowther loudspeaker begins in conversation
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Brand', href: '/history' },
          { label: 'Handcrafted' }
        ]}
      />

      {/* Content Section - Medium Style */}
      <article data-surface="light" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <p className="text-2xl leading-relaxed text-gray-900 font-light mb-12">
                Every Lowther loudspeaker begins in conversation.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                You do not simply buy a product from Lowther; you commission an instrument. From the moment you choose your preferred veneer, the process becomes personal. You are selecting not just an aesthetic, but a cherished wood - each species chosen for how it shapes the speaker. Just as a luthier might select maple or spruce, we treat these woods with the same care and tradition.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Each Lowther acoustic masterpiece is handcrafted to order, allowing for a truly personalised experience. Our clients select from a curated range of premium veneers, each pair matched to create a unique visual signature that complements the distinctive Lowther sound.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                We invite you to experience these instruments at our Northampton listening room, where you can audition various configurations with your preferred musical selections in an environment designed for critical appreciation.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Beyond selection, our relationship with you continues with white-glove delivery and installation by Lowther specialists, ensuring that your acoustic masterpiece performs optimally within your specific environment.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-12">
                This is not merely a purchase; it is the beginning of a relationship with a legacy of excellence that has endured for nearly a century - and will continue to bring musical truth into your home for generations to come.
              </p>

              <div className="border-t border-gray-200 pt-12 mt-16">
                <p className="text-xl text-gray-900 mb-8 font-light">
                  To arrange a private consultation or listening appointment, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/book-appointment">
                    <Button 
                      size="lg" 
                      className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      BOOK AN APPOINTMENT
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      size="lg" 
                      className="bg-white hover:bg-black text-black hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      CONTACT US
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </article>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />
    </div>
  );
}
