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
import { findVariantByOptions, formatPrice, type ShopifyProduct, type ShopifyVariant } from '@/lib/shopify-storefront';
import { useCart } from '@/contexts/cart-context';

// Product data for Reference Cables
const cableProducts = [
  {
    id: 'speaker-cables',
    handle: 'lowther-speaker-cables',
    title: 'Lowther Speaker Cables',
    price: '£3,300.00',
    image: '/images/ensemble/reference-cables/gallery/Speaker-cables-transparent.avif',
    hasLengthOptions: true,
    lengthOptions: ['2 m', '4 m'],
    description: 'Designed to complement the speed and sensitivity of Lowther loudspeakers, our speaker cables are handcrafted in the UK with a purist approach—preserving dynamic range, tonal integrity, and timing across the entire frequency spectrum.',
    details: [
      'Constructed with high-purity conductors and low-resistance architecture, they provide an uncoloured, unobstructed path between amplifier and speaker—ensuring every nuance of your music reaches the driver unaltered.',
      'Whether you\'re powering a Concert Collection build or a Grand Opera masterpiece, these cables are the final step in achieving system-wide coherence and emotional immediacy.',
    ],
  },
  {
    id: 'rca-interconnects',
    handle: 'rca-interconnects',
    title: 'Lowther RCA Interconnects',
    price: '£1,395.60',
    image: '/images/ensemble/reference-cables/gallery/RCA-Interconnects-transparent.avif',
    hasLengthOptions: true,
    lengthOptions: ['1 m', '1.5 m', '2 m', '4 m'],
    description: 'Crafted to the same exacting standards as our loudspeakers, Lowther RCA Cables preserve the full emotional impact of your music. Each pair is handmade in the UK using audiophile-grade components, selected for their sonic transparency and long-term reliability.',
    details: [
      'With a focus on minimal signal loss and natural tonal balance, these cables offer an effortlessly open sound—revealing texture, space, and musical nuance without coloration or fatigue.',
      'Ideal for connecting amplifiers, preamps, and sources within high-efficiency systems, they deliver cohesion and clarity worthy of the Lowther name.',
    ],
  },
  {
    id: 'spdif-cable',
    handle: 'lowther-spdif-cable',
    title: 'Lowther SPDIF Cable',
    price: '£1,500.00',
    image: '/images/ensemble/reference-cables/gallery/SPDIF-holder-transparent.avif.jpg',
    hasLengthOptions: true,
    lengthOptions: ['2 m', '3 m', '4 m'],
    description: 'Engineered for digital purists, the Lowther SPDIF Cable preserves the timing integrity and coherence that are essential to natural sound reproduction. Every detail - from the impedance-matched geometry to the hand-selected coaxial core - is designed to minimise jitter and phase distortion across the signal path.',
    details: [
      'Handmade in the UK with audiophile-grade terminations and shielding, it delivers crystal-clear signal flow from transport to DAC - ensuring that even your digital sources retain the organic flow and emotional immediacy of true high-fidelity playback.',
      'Ideal for those who demand digital without compromise, this is Lowther precision - down to the very last bit.',
    ],
  },
  {
    id: 'usb-cable',
    handle: 'lowther-usb-cable',
    title: 'Lowther USB',
    price: '£1,500.00',
    image: '/images/ensemble/reference-cables/gallery/USB-cable-transparent.webp',
    hasLengthOptions: true,
    lengthOptions: ['1 m', '2 m'],
    description: 'Built for those who refuse to compromise - even in the digital domain - the Lowther USB Cable ensures bit-perfect transmission with the tonal finesse our analog heritage demands.',
    details: [
      'Hand-terminated in the UK using high-purity conductors, double shielding, and precision connectors, it delivers jitter-free performance with a musical presentation that feels open, natural, and alive.',
      'Whether connecting your DAC to a server, streamer, or laptop, the Lowther USB Cable preserves timing, space, and microdetail - bringing the soul of your digital library closer to the Lowther sound.',
    ],
  },
  {
    id: 'mains-cable',
    handle: 'lowther-mains-cable',
    title: 'Lowther Mains Cable',
    price: '£1,995.60',
    image: '/images/ensemble/reference-cables/gallery/Mains-cable-transparent.avif',
    hasLengthOptions: true,
    lengthOptions: ['1 m', '2 m', '4 m'],
    description: 'Great sound begins with clean, stable power - and the Lowther Mains Cable is built to deliver exactly that. Handcrafted in the UK with high-purity copper conductors, low-resistance geometry, and comprehensive shielding, it provides a rock-solid electrical foundation for your amplifier or source component.',
    details: [
      'Designed to reduce noise ingress and voltage sag, this cable preserves dynamic headroom, blacker backgrounds, and the effortless musicality that defines the Lowther experience.',
      'Whether paired with our PX4 amplifier or your reference system, it\'s the quietest path to deeper immersion.',
    ],
  },
  {
    id: 'mains-filter',
    handle: 'lowther-mains-filter',
    title: 'Lowther Mains Filter',
    price: '£6,000.00',
    image: '/images/ensemble/reference-cables/gallery/Mains-filter-holder-transparent.jpg',
    hasLengthOptions: false,
    lengthOptions: [],
    description: 'The Lowther Mains Filter is designed to do one thing with absolute precision - remove electrical noise before it ever reaches your system. Using a carefully tuned, hand-built filter network, it strips out EMI and RFI interference while preserving voltage stability and dynamic headroom.',
    details: [
      'The result: blacker backgrounds, improved imaging, and a more natural sense of space - especially when paired with high-sensitivity systems like our own.',
      'Crafted in the UK with audiophile-grade components and encased in a robust chassis, the Lowther Mains Filter is the hidden foundation of a truly revealing system. Once heard, you\'ll never go back.',
    ],
  },
];

export default function ReferenceCablesPage() {
  const { addItem, isLoading: cartLoading } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<typeof cableProducts[0] | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedLength, setSelectedLength] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);

  const { productMap } = useShopifyCollection('accessories');

  const getDisplayPrice = (product: typeof cableProducts[number]) => {
    const shopifyMatch = productMap.get(product.handle ?? product.id);
    if (shopifyMatch) {
      return formatPrice(
        shopifyMatch.priceRange.minVariantPrice.amount,
        shopifyMatch.priceRange.minVariantPrice.currencyCode,
      );
    }
    return product.price;
  };

  const openProductDetail = (product: typeof cableProducts[0]) => {
    setSelectedProduct(product);
    // Set default length for products with options
    if (product.hasLengthOptions && product.lengthOptions.length > 0) {
      setSelectedLength({ ...selectedLength, [product.id]: product.lengthOptions[0] });
    }
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
      const variant = getCurrentVariant();
      if (!variant) {
        alert('Please select length');
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

  const getSelectedLength = (productId: string, defaultLength: string) => {
    return selectedLength[productId] || defaultLength;
  };

  const getCurrentVariant = (): ShopifyVariant | undefined => {
    if (!selectedShopifyProduct || !selectedProduct) return undefined;

    if (selectedProduct.hasLengthOptions && selectedProduct.lengthOptions.length > 0) {
      const lengthValue = getSelectedLength(selectedProduct.id, selectedProduct.lengthOptions[0]);
      return findVariantByOptions(selectedShopifyProduct.variants, { Length: lengthValue });
    }

    return selectedShopifyProduct.variants?.[0];
  };

  const getOverlayPrice = () => {
    const variant = getCurrentVariant();
    if (variant) {
      return formatPrice(variant.price.amount, variant.price.currencyCode);
    }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/ensemble/reference-cables/hero/Lowther-cables-hero.png"
          alt="Reference Cables"
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
            Reference Cables
          </h1>
          
          <p className="text-xl leading-relaxed">
            Hand-Crafted for Unparalleled Signal Purity.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Lowther Ensemble', href: '/products' },
          { label: 'Reference Cables' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                The Lowther Sound
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Lowther Premium Speaker Cables represent a fundamentally different approach to signal transmission. Unlike 99.9% of audio cables that employ conventional construction methods, these are handmade in Great Britain to complement the capabilities of our acoustic instruments.
                </p>
                <p>
                  We begin with 99.99% pure silver, certified and made in Great Britain. We then selectively blend with gold & copper alloys chosen for their sonic characteristics. Rather than conventional plastic insulation, these conductors are meticulously braided in cotton - nature's superior dielectric with remarkable properties that synthetic materials cannot match.
                </p>
                <p>
                  This specialised construction creates a crucial difference: only 20% of the wire contacts the insulator, with the remaining 80% surrounded by air - the ideal dielectric. The result is dramatically reduced micro-vibrations, eliminated triboelectric noise, and pristine signal transfer that preserves the full emotional impact of the performance.
                </p>
                <p>
                  Our braided signal conductors are precisely twisted together to naturally cancel electromagnetic interference without the need for conventional shielding that would suffocate the sound. Each finished cable is adorned in our signature British Racing Green braid and terminated with high-quality silver or gold-plated pure copper connectors.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Shop Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Explore Our Reference Cables
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Handcrafted in Great Britain for uncompromising signal purity
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {cableProducts.map((product, index) => {
              const displayPrice = getDisplayPrice(product);
              return (
              <ScrollReveal key={product.id} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col items-center text-center h-full">
                  <div className="relative w-full mb-6 flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={500}
                      height={500}
                      className="w-full h-auto object-contain max-h-[400px]"
                    />
                  </div>
                  <div className="flex flex-col flex-grow w-full">
                    <h3 className="font-display text-2xl mb-2" style={{ color: '#c59862' }}>
                      {product.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {displayPrice}
                    </p>
                    <div className="mt-auto w-full">
                      <ProductActionButtons
                        product={{
                          id: product.id,
                          handle: product.handle,
                          title: product.title,
                          price: displayPrice,
                          image: product.image,
                        }}
                        onPrimary={() => openProductDetail(product)}
                        onSecondary={() => openProductDetail(product)}
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
            })}
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
                    {getOverlayPrice()}
                  </p>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>{selectedProduct.description}</p>
                    {selectedProduct.details.map((detail, i) => (
                      <p key={i}>{detail}</p>
                    ))}
                  </div>
                </div>

                {/* Product Options */}
                <div className="space-y-6 mb-12">
                  {/* Length Selector (if applicable) */}
                  {selectedProduct.hasLengthOptions && selectedProduct.lengthOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Length
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedProduct.lengthOptions.map((length) => (
                          <button
                            key={length}
                            onClick={() => setSelectedLength({ ...selectedLength, [selectedProduct.id]: length })}
                            className={`py-3 px-4 text-sm border rounded transition-all ${
                              getSelectedLength(selectedProduct.id, selectedProduct.lengthOptions[0]) === length
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {length}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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

