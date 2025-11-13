"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { X } from 'lucide-react';
import { ProductActionButtons } from '@/components/product-action-buttons';
import { useShopifyCollection } from '@/hooks/use-shopify-collection';
import { formatPrice, type ShopifyProduct } from '@/lib/shopify-storefront';
import { useCart } from '@/contexts/cart-context';

// Product data for PX4 Amplifier
const px4Products = [
  {
    id: 'px4-green-push-pull',
    handle: 'lowther-px4-valve-amplifier',
    title: 'PX4 Green/Black',
    price: 'From £12,000*',
    image: '/images/ensemble/px4-amplifier/gallery/Green-Lowther-PX4-Tube-Amplifier-transparent.avif',
    specs: [
      { label: 'Output Power', value: '10 W + 10 W', highlighted: true },
      { label: 'Topology', value: 'Push-Pull / Single-Ended', highlighted: true },
      { label: 'Finish', value: 'British Green / Black', highlighted: false },
      { label: 'Valves', value: '4 × PX4 (output)', highlighted: false },
      { label: 'Frequency Response', value: '10 Hz – 45 kHz', highlighted: false },
    ],
  },
];

// Gallery images
const galleryImages = [
  { src: '/images/ensemble/px4-amplifier/gallery/Green-Lowther-PX4-Tube-Amplifier.avif', alt: 'Green PX4 Tube Amplifier' },
  { src: '/images/ensemble/px4-amplifier/gallery/Black-Lowther-PX4-Tube-Amplifier.avif', alt: 'Black PX4 Tube Amplifier' },
  { src: '/images/ensemble/px4-amplifier/gallery/Green-Lowther-PX4-Tube-Amplifier-back.avif', alt: 'PX4 Amplifier back panel' },
  { src: '/images/ensemble/px4-amplifier/gallery/Green-Lowther-PX4-Tube-Amplifier-close-up-of-cables.avif', alt: 'PX4 Amplifier cable connections' },
  { src: '/images/ensemble/px4-amplifier/gallery/Green-Lowther-PX4-Tube-Amplifier-close-up-of-cables2.avif', alt: 'PX4 Amplifier detail' },
  { src: '/images/ensemble/px4-amplifier/gallery/Green-Lowther-PX4-Tube-Amplifier-back-power-cable.avif', alt: 'PX4 Amplifier power connections' },
];

// Complete specifications data
const specifications = [
  { label: 'Amplifier topology', value: 'PX4 Class-A push-pull or single-ended' },
  { label: 'Valves fitted', value: '4 × PX4 (output), 2 × 6SN7, 2 × 6J5, 1 × 5U4G/5AR4' },
  { label: 'Bias arrangement', value: 'Automatic cathode bias' },
  { label: 'Rated output power', value: '10 W + 10 W into 6 Ω' },
  { label: 'Frequency response (-3 dB)', value: '10 Hz – 45 kHz' },
  { label: 'Signal-to-noise ratio', value: '93 dB' },
  { label: 'Input', value: 'Main In × 1' },
  { label: 'Input sensitivity/impedance', value: '1 V rms for rated power / 300 kΩ' },
  { label: 'Variable feedback range', value: '0 dB – 10 dB (user adjustable)' },
  { label: 'Speaker outputs', value: '6 Ω binding posts' },
  { label: 'Power consumption', value: '200 W (maximum)' },
  { label: 'Dimensions (W × D × H)', value: '330 mm × 430 mm × 240 mm' },
];

export default function PX4AmplifierPage() {
  const { addItem, isLoading: cartLoading } = useCart();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof px4Products[0] | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('green');
  const [selectedTopology, setSelectedTopology] = useState<string>('push-pull');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);

  const { productMap } = useShopifyCollection('accessories');

  const getDisplayPrice = (product: typeof px4Products[number]) => {
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

  const openProductDetail = (product: typeof px4Products[0]) => {
    setSelectedProduct(product);
    setQuantity(1);
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

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };
  const handleAddToBag = async () => {
    if (!selectedProduct) return;

    if (selectedShopifyProduct) {
      const variant = selectedShopifyProduct.variants?.[0];
      if (!variant) {
        alert('This product is currently unavailable');
        return;
      }
      if (!variant.availableForSale) {
        alert('This product is currently unavailable');
        return;
      }

      await addItem(variant.id, quantity);
      alert(`Added ${quantity}x ${selectedProduct.title} to your bag!`);
      closeProductDetail();
      return;
    }

    window.open(process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.lowtherloudspeakers.com', '_blank');
  };

  const getOverlayPrice = () => {
    if (selectedShopifyProduct) {
      const variant = selectedShopifyProduct.variants?.[0];
      if (variant) {
        return formatPrice(variant.price.amount, variant.price.currencyCode);
      }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/ensemble/px4-amplifier/hero/PX4-hero2.jpg"
          alt="The PX4 Valve Amp"
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
            The PX4 Valve Amp
          </h1>
          
          <p className="text-xl leading-relaxed">
            A harmonious blend of heritage and innovation, delivering 10 watts of exquisite sound through legendary British PX4 valves.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Lowther Ensemble', href: '/products' },
          { label: 'PX4 Tube Amplifier' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                Harmony of Heritage and Innovation
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Inspired by our revered designs from the 1940s and 1950s, this amplifier pays homage to the legendary British PX4 valve – a beacon of acoustic excellence that prioritises revelation over raw power.
                </p>
                <p>
                  At its heart are two pairs of Direct Heated Triode PX4 valves - chosen not for their power output, but for their unrivalled ability to reveal musical truth. Delivering 10 watts per channel of exquisite sound, this amplifier embodies our philosophy that true fidelity comes not from brute force, but from purity of signal reproduction.
                </p>
                <p>
                  Every element has been meticulously considered, from the custom-wound transformers crafted in Dorset to the point-to-point wiring that eschews printed circuits in favour of a construction method that enhances both reliability and sonic qualities. The chassis, precision-machined from aluminium and finished with a bespoke powder coating, completes an instrument that is as beautiful to behold as it is to experience.
                </p>
                <p>
                  When paired with Lowther's full-range drivers, the PX4 amplifier creates a synergy that must be experienced to be fully appreciated.
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
                Configure Your PX4
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Available in British Green or Black finish, with Push-Pull or Single-Ended topology
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-12 mb-16">
            {px4Products.map((product, index) => {
              const displayPrice = getDisplayPrice(product);
              return (
              <ScrollReveal key={product.id} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-full mb-6 overflow-hidden max-w-2xl">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <h3 className="font-display text-3xl mb-2" style={{ color: '#c59862' }}>
                    {product.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {displayPrice}
                  </p>
                  <div className="w-full max-w-2xl">
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
                    />
                  </div>
                </div>
              </ScrollReveal>
            );
            })}
          </div>

          <ScrollReveal animation="fade-up">
            <p className="text-center text-sm text-gray-600">
              * Prices may vary based on selected options. Contact us for a detailed quote.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl mb-12 text-center" style={{ color: '#c59862' }}>
              Technical Specifications
            </h2>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    <div className="font-medium text-gray-900">{spec.label}:</div>
                    <div className="text-gray-700 whitespace-pre-line">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection />

      {/* Product Detail Overlay */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-white z-50"
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
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">LOWTHER ENSEMBLE</p>
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
                  {/* Color Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Finish
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedColor('green')}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          selectedColor === 'green'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        British Green
                      </button>
                      <button
                        onClick={() => setSelectedColor('black')}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          selectedColor === 'black'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Black
                      </button>
                    </div>
                  </div>

                  {/* Topology Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Topology
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedTopology('push-pull')}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          selectedTopology === 'push-pull'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Push-Pull
                      </button>
                      <button
                        onClick={() => setSelectedTopology('single-ended')}
                        className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                          selectedTopology === 'single-ended'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Single-Ended
                      </button>
                    </div>
                  </div>

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
                    onClick={handleAddToBag}
                    disabled={cartLoading}
                  >
                    {cartLoading ? 'ADDING...' : 'ADD TO BAG'}
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
    </div>
  );
}
