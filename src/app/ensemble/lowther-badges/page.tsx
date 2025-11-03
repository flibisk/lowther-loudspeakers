'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { X } from 'lucide-react';

export default function LowtherBadgesPage() {
  const [selectedProduct, setSelectedProduct] = useState<boolean>(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const openProductDetail = () => {
    setSelectedProduct(true);
    setTimeout(() => setIsProductOpen(true), 50);
  };

  const closeProductDetail = () => {
    setIsProductOpen(false);
    setTimeout(() => setSelectedProduct(false), 600);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/ensemble/lowther-badges/hero/Official-Lowther-Badges-Hero.webp"
          alt="Official Lowther Badges"
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
            <span className="text-sm tracking-wider uppercase text-white/80">LOWTHER ENSEMBLE</span>
          </div>
          
          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Official Lowther Badges
          </h1>
          
          <p className="text-xl leading-relaxed">
            The finishing touch for any homemade Lowther
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Lowther Ensemble', href: '/products' },
          { label: 'Official Lowther Badges' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                The Lowther Badge
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Crafted from solid metal by the same artisans who produce the emblems for Aston Martin in Great Britain.
                </p>
                <p>
                  Each badge is finished to the highest standard and represents nearly a century of Lowther excellence. Whether you are restoring a cherished masterpiece or simply wish to own a piece of audio history, this emblem carries the same attention to detail found in our legendary loudspeakers.
                </p>
                <p>
                  <strong>Made in Great Britain</strong> – with pride, for those who value authenticity.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Shop Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-full max-w-2xl mb-8 flex items-center justify-center" style={{ minHeight: '400px' }}>
                <Image
                  src="/images/ensemble/lowther-badges/hero/Official-Lowther-Badges-Hero.webp"
                  alt="Official Lowther Badges"
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex flex-col w-full max-w-md">
                <h3 className="font-display text-3xl mb-2" style={{ color: '#c59862' }}>
                  Official Lowther Badges
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  £60.00
                </p>
                <p className="text-sm text-gray-600 mb-8">
                  Price per pair
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <Button 
                    size="lg" 
                    className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    onClick={openProductDetail}
                  >
                    BUY NOW
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection />

      {/* Product Detail Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="h-full flex flex-col md:flex-row">
            {/* Left: Product Image */}
            <div 
              className={`w-full md:w-1/2 relative bg-[#fafaf8] flex items-center justify-center p-12 transition-transform duration-[600ms] ease-out ${
                isProductOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="relative w-full h-full max-w-lg">
                <Image
                  src="/images/ensemble/lowther-badges/hero/Official-Lowther-Badges-Hero.webp"
                  alt="Official Lowther Badges"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right: Product Details */}
            <div 
              className={`w-full md:w-1/2 relative overflow-y-auto transition-transform duration-[600ms] ease-out delay-100 ${
                isProductOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="p-12 max-w-2xl">
                {/* Close Button */}
                <button
                  onClick={closeProductDetail}
                  className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Product Info */}
                <div className="mb-12">
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">LOWTHER ENSEMBLE</p>
                  <h2 className="font-display text-5xl mb-4" style={{ color: '#c59862' }}>
                    Official Lowther Badges
                  </h2>
                  <p className="text-xl text-gray-900 mb-2">
                    £60.00
                  </p>
                  <p className="text-sm text-gray-600 mb-8">
                    Price per pair
                  </p>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Crafted from solid metal by the same artisans who produce the emblems for Aston Martin in Great Britain.
                    </p>
                    <p>
                      Each badge is finished to the highest standard and represents nearly a century of Lowther excellence. Whether you are restoring a cherished masterpiece or simply wish to own a piece of audio history, this emblem carries the same attention to detail found in our legendary loudspeakers.
                    </p>
                    <p>
                      <strong>Made in Great Britain</strong> – with pride, for those who value authenticity.
                    </p>
                  </div>
                </div>

                {/* Product Options */}
                <div className="space-y-6 mb-12">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-20 h-10 text-center border border-gray-300 rounded"
                        min="1"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                  >
                    ADD TO BAG
                  </Button>
                  <Button
                    size="lg"
                    className="w-full bg-white hover:bg-black text-black hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                  >
                    Book an Appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

