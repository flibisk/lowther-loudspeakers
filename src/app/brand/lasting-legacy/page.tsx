'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function LastingLegacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/lasting-legacy/hero/Lasting-Legacy-hero-old-amplifiers.avif"
          alt="A Lasting Legacy"
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
            <span className="text-sm tracking-wider uppercase text-white/80">THE LOWTHER PROMISE</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            A Lasting Legacy
          </h1>
          
          <p className="text-xl leading-relaxed">
            Made to Endure. Crafted to be Cherished.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Brand', href: '/history' },
          { label: 'Lasting Legacy' }
        ]}
      />

      {/* Content Section - Medium Style */}
      <article data-surface="light" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <p className="text-2xl leading-relaxed text-gray-900 font-light mb-16">
                A Lowther is not just owned — it is inherited. Built to last decades, not cycles, each speaker is designed for longevity through thoughtful engineering, timeless aesthetics, and lifelong repairability.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Built to Be Rebuilt
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Lowther loudspeakers are often still in use after 60, 70, even 80 years. Designed with continuity in mind, they are made not to be replaced, but restored — re-veneered, re-coned, and revitalised as needed. Every part can be rebuilt, ensuring that a Lowther is not just a product of its time, but a companion across generations.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Heirloom Engineering
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                From sustainable hardwoods to alnico magnets, every material is chosen for longevity and sonic integrity, not cost-cutting.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Lowther for Life
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-12">
                Every speaker is backed by our ten-year warranty. But more than that, it's supported by people who still understand how to fix it.
              </p>

              <div className="border-t border-gray-200 pt-12 mt-16">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/warranty">
                    <Button 
                      size="lg" 
                      className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      VIEW WARRANTY
                    </Button>
                  </Link>
                  <Link href="/services/refurbishments-upgrades">
                    <Button 
                      size="lg" 
                      className="bg-white hover:bg-black text-black hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      REFURBISHMENTS & UPGRADES
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
