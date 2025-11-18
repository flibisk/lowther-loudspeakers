'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { DiscountPopup } from '@/components/discount-popup';
import { X } from 'lucide-react';

// Product data for Phase Plugs
const phasePlugProducts = [
  {
    id: 'standard-dome',
    title: 'Standard Dome',
    price: '£60* per pair',
    image: '/images/ensemble/phase-equalisers/gallery/Lowther-standard-dome-transparent.webp',
    description: 'The Dome is the core of Lowther\'s sound excellence. It\'s expertly crafted to manage sound waves from the heart of the speaker driver, enhancing sound dispersion and reducing internal reflections. This phase plug ensures a smoother high-frequency response, crucial for clear and refined audio output.',
  },
  {
    id: 'phase-equaliser',
    title: 'Phase Equaliser',
    price: '£110* per pair',
    image: '/images/ensemble/phase-equalisers/gallery/Lowther-phase-equaliser-transparent.webp',
    description: 'Lovingly referred to as "the Pepper Pot", this is our innovative approach to superior sound quality. Our Phase Equaliser not only enhances traditional phase plug capabilities but also acts as an effective diffuser. It\'s engineered to guide sound waves optimally, significantly improving high-frequency and mid-range responses. The result? A sound that\'s cleaner, clearer, and impeccably balanced.',
  },
  {
    id: 'sound-diffuser',
    title: 'Sound Diffuser',
    price: '£240* per pair',
    image: '/images/ensemble/phase-equalisers/gallery/Lowther-Sound-diffuser-transparent.webp',
    description: 'We call it "the Door Knob" and its very familiar shape works well in our larger drive units. The Sound Diffuser provides a more even and natural sound experience. It\'s designed to minimise resonances and ensure a harmonious listening experience.',
  },
  {
    id: 'complete-set',
    title: 'Complete Phase Plug Set',
    price: '£350* for all 3 Pairs',
    image: '/images/ensemble/phase-equalisers/gallery/Lowther-phase-plugset-trasparent.webp',
    description: 'Get all three phase plug types in one comprehensive set. This complete collection allows you to experiment and find the perfect sonic signature for your system. Includes Standard Dome, Phase Equaliser, and Sound Diffuser - all the tools you need to tailor your Lowther experience.',
  },
];

export default function PhasePlugsPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof phasePlugProducts[0] | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const openProductDetail = (product: typeof phasePlugProducts[0]) => {
    setSelectedProduct(product);
    setTimeout(() => setIsProductOpen(true), 50);
  };

  const closeProductDetail = () => {
    setIsProductOpen(false);
    setTimeout(() => setSelectedProduct(null), 600);
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
          src="/images/ensemble/phase-equalisers/hero/Lowther-phase-plugs-hero.webp"
          alt="Lowther Phase Plugs"
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
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Lowther Phase Plugs
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Explore our collection of phase plugs, each tailored for distinct listening improvements.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Lowther Ensemble', href: '/products' },
          { label: 'Phase Plugs' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                Phase Plugs
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Explore our collection of phase plugs, each tailored for distinct listening improvements. While every drive unit comes with a selected phase plug as standard, we recognise the desire for personalisation in audio setups. Our range of phase plugs, available both in individual pairs and as a complete set, allows for customisation to suit your unique listening preference.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Three Column Phase Plugs Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Standard Dome */}
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="flex flex-col">
                <div className="relative w-full mb-6 overflow-hidden rounded-lg" style={{ height: '400px' }}>
                  <Image
                    src="/images/ensemble/phase-equalisers/gallery/Lowther-standard-dome.webp"
                    alt="Standard Dome"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                  Standard Dome
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  The Dome is the core of Lowther's sound excellence. It's expertly crafted to manage sound waves from the heart of the speaker driver, enhancing sound dispersion and reducing internal reflections. This phase plug ensures a smoother high-frequency response, crucial for clear and refined audio output.
                </p>
              </div>
            </ScrollReveal>

            {/* Phase Equaliser */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="flex flex-col">
                <div className="relative w-full mb-6 overflow-hidden rounded-lg" style={{ height: '400px' }}>
                  <Image
                    src="/images/ensemble/phase-equalisers/gallery/Lowther-phase-equaliser.webp"
                    alt="Phase Equaliser"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                  Phase Equaliser
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Lovingly referred to as "the Pepper Pot", this is our innovative approach to superior sound quality. Our Phase Equaliser not only enhances traditional phase plug capabilities but also acts as an effective diffuser. It's engineered to guide sound waves optimally, significantly improving high-frequency and mid-range responses. The result? A sound that's cleaner, clearer, and impeccably balanced.
                </p>
              </div>
            </ScrollReveal>

            {/* Sound Diffuser */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="flex flex-col">
                <div className="relative w-full mb-6 overflow-hidden rounded-lg" style={{ height: '400px' }}>
                  <Image
                    src="/images/ensemble/phase-equalisers/gallery/Lowther-Sound-diffuser.webp"
                    alt="Sound Diffuser"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                  Sound Diffuser
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We call it "the Door Knob" and its very familiar shape works well in our larger drive units. The Sound Diffuser provides a more even and natural sound experience. It's designed to minimise resonances and ensure a harmonious listening experience.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Our Phase Plug Collection
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tailor your Lowther experience with precision-engineered phase plugs
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {phasePlugProducts.map((product, index) => (
              <ScrollReveal key={product.id} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col items-center text-center h-full">
                  <div className="relative w-full mb-6 flex items-center justify-center" style={{ minHeight: '300px' }}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-auto object-contain max-h-[300px]"
                    />
                  </div>
                  <div className="flex flex-col flex-grow w-full">
                    <h3 className="font-display text-2xl mb-2" style={{ color: '#c59862' }}>
                      {product.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {product.price}
                    </p>
                    <div className="flex flex-col gap-3 w-full mt-auto">
                      <Button 
                        size="lg" 
                        className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                        onClick={() => openProductDetail(product)}
                      >
                        ORDER NOW
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
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
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xl text-gray-900 mb-8">
                    {selectedProduct.price}
                  </p>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>{selectedProduct.description}</p>
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
                    onClick={() => {
                      closeProductDetail();
                      window.location.href = '/book-appointment';
                    }}
                  >
                    Book an Appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DiscountPopup />
    </div>
  );
}

