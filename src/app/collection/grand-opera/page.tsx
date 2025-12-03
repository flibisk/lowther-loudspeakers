'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { X } from 'lucide-react';
import { ProductActionButtons } from '@/components/product-action-buttons';
import { useShopifyCollection } from '@/hooks/use-shopify-collection';
import { formatPrice, type ShopifyProduct } from '@/lib/shopify-storefront';
import { CommissionForm } from '@/components/commission-form';

// Product data for Grand Opera Collection drive units
const grandOperaProducts = [
  {
    id: 'field-coil-grand-opera',
    handle: 'field-coil-grand-opera',
    title: 'Field Coil Motor',
    price: 'Price on commission',
    image: '/images/drive-units/grand-opera-collection/gallery/grand-opera-transparentBG-Field-Coil.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Field Coil', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Impedance Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'Permalloy/Soft Iron', highlighted: false },
    ],
  },
  {
    id: 'pm4a-grand-opera',
    handle: 'pm4a-grand-opera',
    title: 'PM4A',
    price: 'Price on commission',
    image: '/images/drive-units/grand-opera-collection/gallery/grand-opera-transparentBG-PM4A.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Impedance Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'Permalloy/Soft Iron', highlighted: false },
    ],
  },
  {
    id: 'pm7a-grand-opera',
    handle: 'pm7a-grand-opera',
    title: 'PM7A',
    price: 'Price on commission',
    image: '/images/drive-units/grand-opera-collection/gallery/grand-opera-transparentBG-PM7A.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Impedance Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'Permalloy/Soft Iron', highlighted: false },
    ],
  },
];

// Gallery images (non-transparent only)
const galleryImages = [
  { src: '/images/drive-units/grand-opera-collection/gallery/Grand-Opera-Collection-Field-Coil.avif', alt: 'Grand Opera Field Coil' },
  { src: '/images/drive-units/grand-opera-collection/gallery/Grand-Opera-Collection-Field-Coil-2.avif', alt: 'Grand Opera Field Coil detail' },
  { src: '/images/drive-units/grand-opera-collection/gallery/Grand-Opera-Collection-PM4A-Close-UP.avif', alt: 'Grand Opera PM4A close up' },
  { src: '/images/drive-units/grand-opera-collection/gallery/Grand-Opera-Collection-PM7A.avif', alt: 'Grand Opera PM7A' },
  { src: '/images/drive-units/grand-opera-collection/gallery/Grand-Opera-Collection-Paper-Cones.avif', alt: 'Grand Opera paper cones' },
];

// Generic Handcrafted in Great Britain content (same as other collections)
const genericCraftsmanshipContent = [
  {
    title: 'Hand-Wound Voice Coils',
    description: 'At the heart of every Lowther lies a voice coil wound entirely by hand, to tolerances measured in microns. Copper, silver, or gold alloy wire is layered under exact tension to achieve balance beyond the reach of machines.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-coil-winding.jpg',
  },
  {
    title: 'Assembled by Master Craftsmen',
    description: 'Every component is brought together by craftsmen whose experience spans decades. Their skill and intuition, the ability to feel perfect alignment within a human hair\'s breadth, ensure flawless centring and effortless movement.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-handmade-to-order.jpg',
  },
  {
    title: 'Cones Treated by Hand, Dried by Sunlight',
    description: 'Our paper cones are individually brushed with proprietary treatments, then cured slowly in natural sunlight. This organic process creates a surface both rigid and alive, capturing musical textures with breathtaking speed and delicacy.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain - lowther paper cones curing in sunlight.jpg',
  },
  {
    title: 'Tested to Ensure Perfection',
    description: 'Every drive unit undergoes exhaustive acoustic and mechanical testing. From precise frequency analysis to the tactile inspection of cone travel, nothing leaves our bench until it meets the sonic ideal that defines Lowther.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-tested.jpg',
  },
  {
    title: 'Superior Metalwork, Engineered for Magnetism',
    description: 'Our metalwork is forged from premium lead-free steels. This geometry channels magnetic flux with maximum efficiency, forming the silent architecture beneath the Lowther signature: lightning-fast response and effortless dynamics.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-handmade-to-order2.jpg',
  },
  {
    title: 'Choice of Magnets',
    description: 'From traditional Alnico to modern Neodymium and the rare Permendur and Magmax of our Grand Opera instruments, each magnet composition shapes character and tone.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-higest-specifications-of-any-drive-units-in-the-world.jpg',
  },
];

// Speaker-specific craftsmanship content for Grand Opera Collection
const grandOperaCraftsmanshipContent = [
  {
    title: 'Custom Metalwork',
    description: 'The Grand Opera Collection features bespoke metalwork crafted from the finest permalloys and soft magnetic irons available. These ultra-high-grade materials, where absolute performance is essential, are precision-machined to tolerances that exceed industry standards, creating the ultimate magnetic circuit for uncompromising sonic purity.',
    image: '/images/drive-units/grand-opera-collection/gallery/Grand-Opera-Collection-Field-Coil-2.avif',
  },
  {
    title: 'Hand-Machined Matched Frames',
    description: 'Each Grand Opera frame is individually hand-machined and meticulously matched to its specific driver assembly. This artisanal approach ensures perfect mechanical integration and eliminates even the minutest resonances, providing an acoustically inert foundation for musical truth.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-frame-matching.jpg',
  },
  {
    title: 'Custom Cone Improvements',
    description: 'The Grand Opera Collection employs our most advanced cone treatment processes, developed exclusively for these flagship instruments. Enhanced structural refinements and proprietary formulations deliver unprecedented clarity, resolution, and tonal accuracy across the entire frequency spectrum.',
    image: '/images/drive-units/grand-opera-collection/gallery/Grand-Opera-Collection-Paper-Cones.avif',
  },
];

// Customer quotes
const customerQuotes = [
  '"Working with Lowther to create my own Grand Opera drivers was unlike anything I\'ve experienced. Every choice, from the magnet to the voice coil, feels like it was made just for me. The result is pure, effortless music that sounds uniquely mine."',
  '"I wanted a sound that captured the intimacy of small jazz sessions but still held scale for orchestral work. Together we tuned my Grand Opera drivers to do exactly that. It\'s like they were built around the way I listen."',
  '"Thank you for guiding me through the Grand Opera process. Designing my set felt like commissioning a fine instrument, every decision and every detail was handled with such care. It\'s everything I hoped for and more."',
];

export default function GrandOperaCollectionPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof grandOperaProducts[0] | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [voiceCoil, setVoiceCoil] = useState<{ [key: string]: string }>({});
  const [impedance, setImpedance] = useState<{ [key: string]: string }>({});
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false);

  const { productMap } = useShopifyCollection('the-grand-opera-collection');

  const getDisplayPrice = (product: typeof grandOperaProducts[number]) => {
    const shopifyMatch = productMap.get(product.handle ?? product.id);
    if (shopifyMatch) {
      return formatPrice(
        shopifyMatch.priceRange.minVariantPrice.amount,
        shopifyMatch.priceRange.minVariantPrice.currencyCode,
      );
    }
    return product.price;
  };

  const openGallery = (index: number) => {
    setSelectedImage(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImage(null);
  };

  const navigateGallery = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const openProductDetail = (product: typeof grandOperaProducts[0]) => {
    setSelectedProduct(product);
    const match = productMap.get(product.handle ?? product.id) ?? null;
    setSelectedShopifyProduct(match);
    setTimeout(() => setIsProductOpen(true), 50);
  };

  const closeProductDetail = () => {
    setIsProductOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setSelectedShopifyProduct(null);
    }, 600);
  };

  const getVoiceCoil = (productId: string) => voiceCoil[productId] || 'Aluminium';
  const getImpedance = (productId: string) => impedance[productId] || '8 Ohms';
  const getOverlayPrice = () => {
    if (selectedShopifyProduct) {
      return formatPrice(
        selectedShopifyProduct.priceRange.minVariantPrice.amount,
        selectedShopifyProduct.priceRange.minVariantPrice.currencyCode,
      );
    }
    return selectedProduct?.price ?? '';
  };

  useEffect(() => {
    if (selectedProduct) {
      const match = productMap.get(selectedProduct.handle ?? selectedProduct.id) ?? null;
      setSelectedShopifyProduct(match);
    }
  }, [productMap, selectedProduct]);

  useEffect(() => {
    if (!isProductOpen) {
      setIsCommissionFormOpen(false);
    }
  }, [isProductOpen]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/drive-units/grand-opera-collection/hero/Fieldcoil-Grand-Opera-hero1.avif"
          alt="The Grand Opera Collection"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">DRIVE UNITS</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            The Grand Opera Collection
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            The Grand Opera Collection represents the absolute pinnacle of acoustic artistry.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Instruments', href: '/products' },
          { label: 'The Grand Opera Collection' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                Without Compromise
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Three curated instruments, the Field Coil, PM4A and PM7A - built to the highest specification possible.
                </p>
                <p>
                  Available exclusively by commission and priced upon request, these bespoke instruments employ components made with the highest grade permalloys or soft magnetic irons - materials where absolute performance is essential.
                </p>
                <p>
                  Each Grand Opera instrument is uniquely numbered and created entirely to order through a collaborative process between client and craftsman. The result transcends conventional audio reproduction, revealing musical nuances and emotional subtleties that remain hidden to lesser instruments.
                </p>
                <p>
                  This is the ultimate expression of the Lowther acoustic masterpiece for those who accept no compromise in their pursuit of musical truth.
                </p>
                <p className="pt-4">
                  <Link 
                    href="/collection/decoding-lowther-driver-data" 
                    className="text-[#c59862] hover:text-[#a07b4d] underline transition-colors"
                  >
                    Learn more about our measurement methodology
                  </Link>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <ScrollReveal key={index} animation="scale" delay={index * 100}>
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm cursor-pointer group"
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Overlay */}
      {isGalleryOpen && selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeGallery}
        >
          <button
            onClick={closeGallery}
            className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateGallery('prev');
            }}
            className="absolute left-8 text-white/80 hover:text-white transition-colors text-6xl font-light z-10"
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="relative w-[90vw] h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              fill
              className="object-contain"
              priority
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateGallery('next');
            }}
            className="absolute right-8 text-white/80 hover:text-white transition-colors text-6xl font-light z-10"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}

      {/* Shop Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Explore the Collection
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Three exceptional instruments, each representing the absolute pinnacle of our craft.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {grandOperaProducts.map((product, index) => {
              const displayPrice = getDisplayPrice(product);
              return (
              <ScrollReveal key={product.id} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-full mb-6 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={500}
                      height={500}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <h3 className="font-display text-3xl mb-2" style={{ color: '#c59862' }}>
                    {product.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {displayPrice}
                  </p>
                  <ProductActionButtons
                    product={{
                      id: product.id,
                      handle: product.handle ?? product.id,
                      title: product.title,
                      price: displayPrice,
                      image: product.image,
                    }}
                    onPrimary={() => openProductDetail(product)}
                    onSecondary={() => openProductDetail(product)}
                    primaryLabel="COMMISSION"
                  />
                </div>
              </ScrollReveal>
            );
            })}
          </div>

          <ScrollReveal animation="fade-up">
            <p className="text-center text-sm text-gray-600">
              Available exclusively by commission. Each instrument is uniquely numbered and built to order.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Handcrafted in Great Britain Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Handcrafted in Great Britain
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every Lowther drive unit is the result of meticulous hand assembly, decades of refinement, and an unwavering commitment to sonic excellence.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {genericCraftsmanshipContent.map((item, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col">
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
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

      {/* The Details That Define the Collection Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                The Details That Define the Collection
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {grandOperaCraftsmanshipContent.map((item, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col">
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
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

      {/* Customer Quotes Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                What Owners Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real experiences from Grand Opera Collection owners around the world
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerQuotes.map((quote, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-white p-8 rounded-lg shadow-sm h-full flex items-center justify-center">
                  <blockquote className="text-center">
                    <p className="text-gray-700 leading-relaxed italic">
                      {quote}
                    </p>
                  </blockquote>
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
        <div 
          className={`fixed inset-0 bg-white z-50 transition-opacity duration-700 ${
            isProductOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
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
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">GRAND OPERA COLLECTION</p>
                  <h2 className="font-display text-5xl mb-4" style={{ color: '#c59862' }}>
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xl text-gray-900 mb-8">
                    {getOverlayPrice()}
                  </p>
                </div>

                {/* Specifications */}
                <div className="mb-8">
                  <div className="space-y-3">
                    {selectedProduct.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">{spec.label}</span>
                        <span 
                          className={`font-medium ${
                            spec.highlighted ? 'text-[#c59862]' : 'text-gray-900'
                          }`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Options */}
                <div className="space-y-6 mb-12">
                  {/* Voice Coil Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Voice Coil
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setVoiceCoil({ ...voiceCoil, [selectedProduct.id]: 'Aluminium' })}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          getVoiceCoil(selectedProduct.id) === 'Aluminium'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Aluminium
                      </button>
                      <button
                        onClick={() => setVoiceCoil({ ...voiceCoil, [selectedProduct.id]: 'Silver' })}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          getVoiceCoil(selectedProduct.id) === 'Silver'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Silver
                      </button>
                    </div>
                  </div>

                  {/* Impedance Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Impedance
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setImpedance({ ...impedance, [selectedProduct.id]: '8 Ohms' })}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          getImpedance(selectedProduct.id) === '8 Ohms'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        8 Ohms
                      </button>
                      <button
                        onClick={() => setImpedance({ ...impedance, [selectedProduct.id]: '15 Ohms' })}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          getImpedance(selectedProduct.id) === '15 Ohms'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        15 Ohms
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    onClick={() => setIsCommissionFormOpen(true)}
                  >
                    Submit Commission Request
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
                <div className="mt-4 text-center">
                  <Link 
                    href="/collection/decoding-lowther-driver-data"
                    className="text-sm text-gray-600 hover:text-[#c59862] underline transition-colors"
                  >
                    Learn more about our measurement methodology
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CommissionForm
        isOpen={isCommissionFormOpen}
        onClose={() => setIsCommissionFormOpen(false)}
        speakerName={selectedProduct?.title ?? 'Grand Opera Commission'}
      />
    </div>
  );
}

