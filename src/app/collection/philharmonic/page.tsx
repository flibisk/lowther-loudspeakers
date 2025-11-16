'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { X } from 'lucide-react';
import { ProductActionButtons } from '@/components/product-action-buttons';
import { CartOverlay } from '@/components/cart-overlay';
import { useShopifyCollection } from '@/hooks/use-shopify-collection';
import { findVariantByOptions, formatPrice, type ShopifyProduct } from '@/lib/shopify-storefront';
import { useCart } from '@/contexts/cart-context';

/**
 * SHOPIFY INTEGRATION GUIDE:
 * 
 * When ready to connect to Shopify, replace this static data with:
 * 
 * 1. Fetch products using Shopify Storefront API or Admin API
 * 2. Map Shopify product data to this structure:
 *    - id: product.id or product.handle
 *    - title: product.title
 *    - price: product.variants[0].price (with currency formatting)
 *    - specs: extracted from product.metafields or product description
 *    - image: product.images[0].src (use transparent background images)
 *    - shopifyHandle: product.handle (for constructing Shopify URLs)
 * 
 * 3. Voice coil and impedance options:
 *    - Use Shopify product variants for different options
 *    - variants.forEach(variant => variant.selectedOptions) contains options like:
 *      { name: 'Voice Coil', value: 'Silver' }
 *      { name: 'Impedance', value: '8 Ohm' }
 * 
 * 4. "ADD TO BAG" functionality:
 *    - Use Shopify Buy SDK: shopifyClient.checkout.addLineItems()
 *    - Or redirect to: `https://shop.lowtherloudspeakers.com/products/${product.shopifyHandle}?variant=${variantId}`
 * 
 * 5. Pricing:
 *    - Fetch prices in multiple currencies using Shopify Markets
 *    - Display VAT-excluded prices (stored in Shopify as base price)
 *    - Calculate VAT dynamically based on customer location
 */
const philharmonicProducts = [
  {
    id: 'field-coil-motor',
    title: 'Field Coil Motor',
    price: '£6,700',
    priceNote: '*',
    specs: [
      { label: 'Frame Size', value: '8 Inch' },
      { label: 'Magnet Type', value: 'Field Coil' },
      { label: 'Voice Coil', value: 'Aluminium/Silver' },
      { label: 'Impedance Options', value: '8/15 Ohms' },
      { label: 'dB Efficiency', value: '-' },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel' },
      { label: 'Overall diameter', value: '22.5 cm' },
    ],
    image: '/images/drive-units/philharmonic-collection/gallery/Field Coil - Store Section.png',
    shopifyHandle: 'lowther-field-coil-philharmonic',
  },
  {
    id: 'pm4a',
    title: 'PM4A',
    price: '£1,780',
    priceNote: '*',
    specs: [
      { label: 'Frame Size', value: '8 Inch' },
      { label: 'Magnet Type', value: 'Alnico' },
      { label: 'Voice Coil', value: 'Aluminium/Silver' },
      { label: 'Impedance Options', value: '8/15 Ohms' },
      { label: 'dB Efficiency', value: '97dB+' },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel' },
      { label: 'Overall diameter', value: '22.5 cm' },
    ],
    image: '/images/drive-units/philharmonic-collection/gallery/PM4A - Store Section.png',
    shopifyHandle: 'lowther-pm4a-philharmonic',
  },
  {
    id: 'pm7a',
    title: 'PM7A',
    price: '£1,530',
    priceNote: '*',
    specs: [
      { label: 'Frame Size', value: '8 Inch' },
      { label: 'Magnet Type', value: 'Alnico' },
      { label: 'Voice Coil', value: 'Aluminium/Silver' },
      { label: 'Impedance Options', value: '8/15 Ohms' },
      { label: 'dB Efficiency', value: '94dB+' },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel' },
      { label: 'Overall diameter', value: '22.5 cm' },
    ],
    image: '/images/drive-units/philharmonic-collection/gallery/PM7A Store Section.png',
    shopifyHandle: 'lowther-pm7a-philharmonic',
  },
];

const galleryImages = [
  { src: '/images/drive-units/philharmonic-collection/gallery/Philharmonic Collection - all.avif', alt: 'Philharmonic Collection - All three drive units' },
  { src: '/images/drive-units/philharmonic-collection/gallery/Philharmonic Collection - Field Coil.avif', alt: 'Field Coil Philharmonic drive unit' },
  { src: '/images/drive-units/philharmonic-collection/gallery/Philharmonic Collection - PM4A.avif', alt: 'PM4A Philharmonic drive unit' },
  { src: '/images/drive-units/philharmonic-collection/gallery/Philharmonic Collection - PM4A 2.avif', alt: 'PM4A Philharmonic drive unit detail' },
  { src: '/images/drive-units/philharmonic-collection/gallery/Philharmonic Collection - PM7A.avif', alt: 'PM7A Philharmonic drive unit' },
  { src: '/images/drive-units/philharmonic-collection/gallery/Philharmonic Collection - PM4A Close Up of Cones.avif.jpg', alt: 'Close-up of Philharmonic drive unit cones' },
];

const craftsmanshipContent = [
  {
    title: 'Improved Metal Work',
    description: 'Distinctive, superior engineered metalwork with nickel chrome finishing elevates these instruments to objects of both acoustic and visual beauty. High Grade EN1A Lead Free Steel, precision machined to exacting tolerances.',
    image: '/images/drive-units/philharmonic-collection/gallery/Philharmonic Collection - metal work 2.jpg',
  },
  {
    title: 'Hand-Machined Matched Frames',
    description: 'Each frame is precision-machined in our Norfolk workshop, with tolerances measured in microns. The perfect marriage of traditional craftsmanship and modern engineering ensures optimal magnetic flux control and structural integrity.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-frame-matching.jpg',
  },
  {
    title: 'Sinfonia Cone Improvements',
    description: 'Our latest Sinfonia cone treatment delivers enhanced bass response while maintaining the legendary Lowther midrange clarity. Each cone is hand-treated and sun-cured, creating a diaphragm that combines rigidity with musical expression.',
    image: '/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-handmade3.jpg',
  },
];

// Generic Handcrafted in Great Britain content
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

const customerQuotes = [
  { quote: 'I finally understand what people mean by the \'Lowther sound\'. The Philharmonics make music feel alive again.' },
  { quote: 'I built the cabinets myself and when I dropped the Philharmonics in, wow!' },
  { quote: 'Every friend who visits wants to know what they\'re hearing. They can\'t believe it\'s just one driver doing everything.' },
  { quote: 'They\'re not just speakers, they\'re a piece of art. I still catch myself standing back just to look at them.' },
  { quote: 'I\'ve used countless systems over the years but these have ended my search.' },
  { quote: 'Installing them myself made the first listen even more emotional.' },
  { quote: 'I\'ve owned systems five times the price, but none have ever made me feel closer to the music.' },
];

export default function PhilharmonicCollectionPage() {
  const { addItem, isLoading: cartLoading } = useCart();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof philharmonicProducts[0] | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const [voiceCoil, setVoiceCoil] = useState<{ [key: string]: string }>({});
  const [impedance, setImpedance] = useState<{ [key: string]: string }>({});
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [accessories, setAccessories] = useState<{ [key: string]: string }>({});

  const { productMap } = useShopifyCollection('the-philharmonic-collection');

  const getDisplayPrice = (product: typeof philharmonicProducts[number]) => {
    const shopifyMatch = productMap.get(product.shopifyHandle ?? product.id);
    if (shopifyMatch) {
      return formatPrice(
        shopifyMatch.priceRange.minVariantPrice.amount,
        shopifyMatch.priceRange.minVariantPrice.currencyCode,
      );
    }
    return `${product.price}${product.priceNote ?? ''}`;
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

  const openProductDetail = (product: typeof philharmonicProducts[0]) => {
    setSelectedProduct(product);
    const match = productMap.get(product.shopifyHandle ?? product.id) ?? null;
    setSelectedShopifyProduct(match);
    // Small delay to allow the DOM to render before triggering animation
    setTimeout(() => setIsProductOpen(true), 50);
  };

  const closeProductDetail = () => {
    setIsProductOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setSelectedShopifyProduct(null);
    }, 600);
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const num = parseInt(value) || 1;
    setQuantity({ ...quantity, [productId]: Math.max(1, num) });
  };

  const getProductQuantity = (productId: string) => quantity[productId] || 1;
  const getVoiceCoil = (productId: string) => voiceCoil[productId] || 'Aluminium';
  const getImpedance = (productId: string) => impedance[productId] || '8 Ohms';
  const getAccessoryOption = (productId: string) => accessories[productId] || 'No Power Supply';
  const isFieldCoilProduct = selectedProduct?.shopifyHandle === 'lowther-field-coil-philharmonic';
  const fieldCoilOptions = useMemo(() => {
    if (!selectedShopifyProduct || !isFieldCoilProduct) return [];
    const values = new Set<string>();
    selectedShopifyProduct.variants.forEach((variant) => {
      variant.selectedOptions.forEach((opt) => {
        if (opt.name.trim().toLowerCase().includes('accessories')) {
          values.add(opt.value);
        }
      });
    });
    return Array.from(values);
  }, [selectedShopifyProduct, isFieldCoilProduct]);
  const availableFieldCoilOptions =
    fieldCoilOptions.length > 0 ? fieldCoilOptions : ['No Power Supply', 'With Power Supply'];
  const getOverlayPrice = () => {
    if (selectedShopifyProduct) {
      const variant = findVariantByOptions(
        selectedShopifyProduct.variants,
        selectedProduct?.shopifyHandle === 'lowther-field-coil-philharmonic'
          ? {
              Accessories: selectedProduct ? getAccessoryOption(selectedProduct.id) : 'No Power Supply',
            }
          : {
              'Voice Coil': selectedProduct ? getVoiceCoil(selectedProduct.id) : 'Aluminium',
              Impedance: selectedProduct ? getImpedance(selectedProduct.id) : '8 Ohms',
            },
      );

      if (variant) {
        return formatPrice(variant.price.amount, variant.price.currencyCode);
      }

      return formatPrice(
        selectedShopifyProduct.priceRange.minVariantPrice.amount,
        selectedShopifyProduct.priceRange.minVariantPrice.currencyCode,
      );
    }
    if (!selectedProduct) return '';
    return `${selectedProduct.price}${selectedProduct.priceNote ?? ''}`;
  };
  const handleAddToBag = async () => {
    if (!selectedProduct) return;

    if (selectedShopifyProduct) {
      const variant = findVariantByOptions(
        selectedShopifyProduct.variants,
        selectedProduct.shopifyHandle === 'lowther-field-coil-philharmonic'
          ? {
              Accessories: getAccessoryOption(selectedProduct.id),
            }
          : {
              'Voice Coil': getVoiceCoil(selectedProduct.id),
              Impedance: getImpedance(selectedProduct.id),
            },
      );

      if (!variant) {
        alert('Please select product options');
        return;
      }

      if (!variant.availableForSale) {
        alert('This product is currently unavailable');
        return;
      }

      await addItem(variant.id, getProductQuantity(selectedProduct.id));
      closeProductDetail();
      // Open cart overlay after product overlay closes (600ms transition + small buffer)
      setTimeout(() => {
        setCartOpen(true);
      }, 650);
      return;
    }

    window.open(process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.lowtherloudspeakers.com', '_blank');
  };

  useEffect(() => {
    if (selectedProduct) {
      const match = productMap.get(selectedProduct.shopifyHandle ?? selectedProduct.id) ?? null;
      setSelectedShopifyProduct(match);
    }
  }, [productMap, selectedProduct]);

  useEffect(() => {
    if (
      selectedProduct &&
      selectedProduct.shopifyHandle === 'lowther-field-coil-philharmonic' &&
      fieldCoilOptions.length > 0
    ) {
      setAccessories((prev) => ({
        ...prev,
        [selectedProduct.id]: prev[selectedProduct.id] ?? fieldCoilOptions[0],
      }));
    }
  }, [selectedProduct, fieldCoilOptions]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/drive-units/philharmonic-collection/hero/Philharmonic-hero1.avif"
          alt="The Philharmonic Collection"
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
            The Philharmonic Collection
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Our most refined offering of instruments, standard in every Lowther masterpiece.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Instruments', href: '/products' },
          { label: 'The Philharmonic Collection' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                Our most refined offering of instruments.
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  The Philharmonic Collection represents our most refined offering of instruments. This selection features only three exceptional designs - PM4A, PM7A, and our Field Coil - each chosen for their perfect embodiment of the Lowther sound that has captivated listeners for generations.
                </p>
                <p>
                  Distinctive, superior engineered metalwork with nickel chrome finishing elevates these instruments to objects of both acoustic and visual beauty. Our Philharmonic drive units combine aesthetic elegance with functional excellence.
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

      {/* Shop Section - Simplified */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Explore the Collection
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover the heart of Lowther sound – our meticulously crafted drive units.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {philharmonicProducts.map((product, index) => {
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
                    From {displayPrice}
                  </p>
                  <ProductActionButtons
                    product={{
                      id: product.id,
                      handle: product.shopifyHandle ?? product.id,
                      title: product.title,
                      price: displayPrice,
                      image: product.image,
                    }}
                    onPrimary={() => openProductDetail(product)}
                    onSecondary={() => openProductDetail(product)}
                  />
                </div>
              </ScrollReveal>
            );
            })}
          </div>

          <ScrollReveal animation="fade-up">
            <p className="text-center text-sm text-gray-600">
              *All prices exclude VAT. As a global company, applicable taxes are automatically calculated based on your location on our online store.
            </p>
          </ScrollReveal>
        </div>
      </section>

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
                <div className="mb-8">
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">PHILHARMONIC COLLECTION</p>
                  <h2 className="font-display text-5xl mb-4" style={{ color: '#c59862' }}>
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xl text-gray-900 mb-4">
                    {getOverlayPrice()} <span className="text-sm text-gray-600">per drive unit</span>
                  </p>
                </div>

                {/* Specs Table */}
                <div className="mb-8">
                  <div className="space-y-3">
                    {selectedProduct.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">{spec.label}</span>
                        <span className="font-medium text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuration Options */}
                <div className="space-y-6 mb-8">
                  {isFieldCoilProduct ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Power Supply
                      </label>
                      <div className="flex gap-3">
                        {availableFieldCoilOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() =>
                              setAccessories({ ...accessories, [selectedProduct.id]: option })
                            }
                            className={`flex-1 py-3 px-4 text-sm border rounded transition-all ${
                              getAccessoryOption(selectedProduct.id) === option
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Voice Coil */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
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

                      {/* Impedance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
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
                    </>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={getProductQuantity(selectedProduct.id)}
                      onChange={(e) => handleQuantityChange(selectedProduct.id, e.target.value)}
                      className="w-full py-3 px-4 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/book-appointment">
                    <Button 
                      className="w-full bg-white text-black hover:bg-[#c59862] hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 py-6 uppercase"
                    >
                      BOOK AN APPOINTMENT
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 py-6 uppercase"
                    onClick={handleAddToBag}
                    disabled={cartLoading}
                  >
                    {cartLoading ? 'ADDING...' : 'ADD TO BAG'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* The Details That Define the Collection */}
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
            {craftsmanshipContent.map((item, index) => (
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
                Real experiences from Philharmonic owners around the world
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerQuotes.map((item, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-white p-8 rounded-lg shadow-sm h-full flex items-center justify-center">
                  <blockquote className="text-center">
                    <p className="text-gray-700 leading-relaxed italic">
                      {item.quote}
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

      {/* Cart Overlay */}
      <CartOverlay isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
