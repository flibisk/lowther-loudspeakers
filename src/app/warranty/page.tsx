'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/warranty/hero/Lowther-Speaker-Making-hero.jpg"
          alt="Lowther Warranty - Craftsmanship Guaranteed"
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
            <span className="text-sm tracking-wider uppercase text-white/80">CUSTOMER CARE</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Warranty Information
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            A commitment to excellence, backed by nearly a century of craftsmanship
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Warranty' }
        ]}
      />

      {/* Content Section - Article Style */}
      <article data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                At Lowther Loudspeaker Systems Limited, we take pride in crafting instruments that last for generations. Our warranty policy reflects our commitment to exceptional craftsmanship, lasting value, and direct customer care.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Drive Units – Our Sonic Instruments
              </h2>

              <p className="text-lg text-gray-700 mb-8 italic">
                Each drive unit is covered against defects in materials and workmanship for the period stated below, from the date of original purchase from an authorised Lowther dealer.
              </p>

              <div className="mb-12 border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#fafaf8]">
                    <tr>
                      <th className="px-6 py-4 text-left font-display text-lg text-gray-900">Collection</th>
                      <th className="px-6 py-4 text-right font-display text-lg text-gray-900">Warranty Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">Concert Collection</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>2 Years</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">Sinfonia Collection</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>10 Years</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">Philharmonic Collection</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>10 Years</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">Grand Opera Collection</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>10 Years</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-base text-gray-600 mb-16 italic">
                This warranty applies only to the original purchaser and is non-transferable.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Masterpieces – Handmade
              </h2>

              <p className="text-lg text-gray-700 mb-8">
                Products such as the Acousta 117, Acousta QW, Edilia, Almira, Audiovector, TP2, and Hegeman are covered under a 2-Year Warranty.
              </p>

              <p className="text-base text-gray-600 mb-16 italic">
                This warranty applies only to the original purchaser and is non-transferable.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Electronics and Accessories
              </h2>

              <div className="mb-12 border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#fafaf8]">
                    <tr>
                      <th className="px-6 py-4 text-left font-display text-lg text-gray-900">Product</th>
                      <th className="px-6 py-4 text-right font-display text-lg text-gray-900">Warranty Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">PX4 Valve Amplifier</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>2 Years</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">Cables</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>2 Years</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">Phase Plugs</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>2 Years</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">Valves (included)</td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#c59862' }}>3 Months</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-base text-gray-600 mb-16 italic">
                This warranty applies only to the original purchaser and is non-transferable.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                What Your Warranty Covers
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                If any covered product fails during normal domestic use due to defects in materials or workmanship, Lowther will, at its discretion:
              </p>

              <ul className="space-y-3 text-lg text-gray-700 mb-8 ml-6">
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Repair or</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Replace the item free of charge within a reasonable timeframe.</span>
                </li>
              </ul>

              <p className="text-lg text-gray-700 mb-4 font-medium">
                Service must be carried out by:
              </p>

              <ul className="space-y-2 text-lg text-gray-700 mb-16 ml-6">
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Lowther Loudspeaker Systems Limited</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>An appointed Lowther dealer or engineer</span>
                </li>
              </ul>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Important Conditions
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                Shipping costs to and from Lowther or its representatives are not included.
              </p>

              <p className="text-lg text-gray-700 mb-4 font-medium">
                Products must be returned with:
              </p>

              <ul className="space-y-3 text-lg text-gray-700 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Original packaging (where possible)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>A copy of the sales receipt</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>A written description of the issue</span>
                </li>
              </ul>

              <p className="text-lg text-gray-700 mb-16">
                Always ship using a reputable courier and fully insure the product in transit.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                What Will Void Your Warranty
              </h2>

              <ul className="space-y-4 text-lg text-gray-700 mb-16 ml-6">
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Modifications, repairs, or servicing performed by unauthorised persons</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Removal, defacing, or tampering with serial numbers</span>
                </li>
              </ul>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                What Your Warranty Does NOT Cover
              </h2>

              <ul className="space-y-4 text-lg text-gray-700 mb-8 ml-6">
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Damage after purchase not caused by manufacturing fault</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Normal wear and tear</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Accidental damage, misuse, neglect, or acts of nature</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Failure to follow supplied installation or operating instructions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c59862] mr-3 mt-1">•</span>
                  <span>Damage due to improper cleaning</span>
                </li>
              </ul>

              <div className="bg-[#fafaf8] p-6 rounded-sm border-l-4 border-[#c59862] mb-16">
                <p className="text-base text-gray-700 leading-relaxed">
                  <strong>Lowther Loudspeaker Systems Limited reserves the right to refuse warranty service if any of these conditions are not met.</strong>
                </p>
              </div>

              <div className="border-t border-gray-200 pt-12 mt-16 text-center">
                <h3 className="font-display text-2xl mb-6" style={{ color: '#c59862' }}>
                  Need More Information?
                </h3>
                <p className="text-lg text-gray-700 mb-8">
                  Download our complete warranty documentation or verify your Lowther product.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/images/warranty/details/Lowther-Warranty.pdf" target="_blank" rel="noopener noreferrer">
                    <Button 
                      size="lg" 
                      className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      DOWNLOAD WARRANTY PDF
                    </Button>
                  </a>
                  <Link href="/verify">
                    <Button 
                      size="lg" 
                      className="bg-white hover:bg-black text-black hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      VERIFY YOUR LOWTHER
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
