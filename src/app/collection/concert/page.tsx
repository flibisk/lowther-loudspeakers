'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { X, FileText } from 'lucide-react';
import { ProductActionButtons } from '@/components/product-action-buttons';
import { CartOverlay } from '@/components/cart-overlay';
import { DiscountPopup } from '@/components/discount-popup';
import { useShopifyCollection } from '@/hooks/use-shopify-collection';
import { findVariantByOptions, formatPrice, type ShopifyProduct, type ShopifyVariant } from '@/lib/shopify-storefront';
import { useCart } from '@/contexts/cart-context';

// Product data for Concert Collection drive units
const concertProducts = [
  {
    id: 'pm2a-concert',
    handle: 'lowther-pm2a-concert',
    title: 'PM2A Concert',
    price: '£730',
    image: '/images/drive-units/concert-collection/gallery/PM2A-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '97dB', highlighted: true },
    ],
  },
  {
    id: 'pm3a-concert',
    handle: 'lowther-pm3a-concert',
    title: 'PM3A Concert',
    price: '£1,085',
    image: '/images/drive-units/concert-collection/gallery/PM3A-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '93dB', highlighted: true },
    ],
  },
  {
    id: 'pm4a-concert',
    handle: 'lowther-pm4a-concert',
    title: 'PM4A Concert',
    price: '£1,030',
    image: '/images/drive-units/concert-collection/gallery/PM4A-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '98dB', highlighted: true },
    ],
  },
  {
    id: 'pm5a-concert',
    handle: 'lowther-pm5a-concert',
    title: 'PM5A Concert',
    price: '£710',
    image: '/images/drive-units/concert-collection/gallery/PM5A-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '95dB', highlighted: true },
    ],
  },
  {
    id: 'pm6a-concert',
    handle: 'lowther-pm6a-concert',
    title: 'PM6A Concert',
    price: '£565',
    image: '/images/drive-units/concert-collection/gallery/PM6A-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '96dB', highlighted: true },
    ],
  },
  {
    id: 'pm7a-concert',
    handle: 'lowther-pm7a-concert',
    title: 'PM7A Concert',
    price: '£685',
    image: '/images/drive-units/concert-collection/gallery/PM7A-transparentBG.webp',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Alnico', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '96dB', highlighted: true },
    ],
  },
  {
    id: 'dx2-concert',
    handle: 'lowther-dx2-concert',
    title: 'DX2 Concert',
    price: '£465',
    image: '/images/drive-units/concert-collection/gallery/DX2-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Neodynium', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '96dB', highlighted: true },
    ],
  },
  {
    id: 'dx3-concert',
    handle: 'lowther-dx3-concert',
    title: 'DX3 Concert',
    price: '£510',
    image: '/images/drive-units/concert-collection/gallery/DX3-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Neodynium', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '98dB', highlighted: true },
    ],
  },
  {
    id: 'dx4-concert',
    handle: 'lowther-dx4-concert',
    title: 'DX4 Concert',
    price: '£590',
    image: '/images/drive-units/concert-collection/gallery/DX4-transparentBG.avif',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Neodynium', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '99dB', highlighted: true },
    ],
  },
  {
    id: 'pm6c-concert',
    handle: 'lowther-pm6c-concert',
    title: 'PM6C Concert',
    price: '£420',
    image: '/images/drive-units/concert-collection/gallery/PM6C-transparentBG.webp',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Ceramic', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '99dB', highlighted: true },
    ],
  },
  {
    id: 'ex2-concert',
    handle: 'lowther-ex2-concert',
    title: 'EX2 Concert',
    price: '£495',
    image: '/images/drive-units/concert-collection/gallery/EX2-transparentBG.webp',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Neodynium', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '99dB', highlighted: true },
    ],
  },
  {
    id: 'ex3-concert',
    handle: 'lowther-ex3-concert',
    title: 'EX3 Concert',
    price: '£540',
    image: '/images/drive-units/concert-collection/gallery/EX3-transparentBG.webp',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Neodynium', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '99dB', highlighted: true },
    ],
  },
  {
    id: 'ex4-concert',
    handle: 'lowther-ex4-concert',
    title: 'EX4 Concert',
    price: '£610',
    image: '/images/drive-units/concert-collection/gallery/EX4-transparentBG.webp',
    specs: [
      { label: 'Frame Size', value: '8 Inch', highlighted: true },
      { label: 'Magnet Type', value: 'Neodynium', highlighted: true },
      { label: 'Voice Coil', value: 'Aluminium/Silver', highlighted: false },
      { label: 'Imp Options', value: '8/15 Ohms', highlighted: false },
      { label: 'Metal Work', value: 'High Grade EN1A Lead Free Steel', highlighted: false },
      { label: 'Clean Air Efficiency', value: '99dB', highlighted: true },
    ],
  },
];

// Gallery images (non-transparent only)
const galleryImages = [
  { src: '/images/drive-units/concert-collection/gallery/PM4A - Front.jpg', alt: 'PM4A Concert drive unit front view' },
  { src: '/images/drive-units/concert-collection/gallery/PM6A - Front.jpg', alt: 'PM6A Concert drive unit front view' },
  { src: '/images/drive-units/concert-collection/gallery/EX3.jpg', alt: 'EX3 Concert drive unit' },
  { src: '/images/drive-units/concert-collection/gallery/DX4-Concert-Collection.avif', alt: 'DX4 Concert drive unit' },
  { src: '/images/drive-units/concert-collection/gallery/PM5A-Concert-Collection.avif', alt: 'PM5A Concert drive unit' },
  { src: '/images/drive-units/concert-collection/gallery/PM3A-Concert-Collection-Close-up-of-speaker-conectors.avif', alt: 'PM3A Concert collection close-up of speaker connectors' },
];

// Generic Handcrafted in Great Britain content (same as Philharmonic)
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

// Speaker-specific craftsmanship content for Concert Collection
const concertCraftsmanshipContent = [
  {
    title: 'Classic Paper Treatment',
    description: 'Each Concert drive unit features our time-tested paper cone treatment, developed and refined over nine decades. This proprietary process creates a diaphragm that is both light and rigid, delivering the immediate response and tonal purity that defines the Lowther sound.',
    image: '/images/drive-units/concert-collection/gallery/Traditional-paper.jpg',
  },
  {
    title: 'Traditional Metalwork',
    description: 'Our Concert series employs the traditional metalwork techniques that have been the foundation of Lowther\'s reputation since the 1930s. High-grade lead-free steel frames, precision-machined to exacting tolerances, provide the structural integrity for decades of faithful service.',
    image: '/images/drive-units/concert-collection/gallery/PM3A-Concert-Collection-Close-up-of-speaker-conectors.avif',
  },
  {
    title: 'Choice of Magnet Systems',
    description: 'The Concert Collection offers flexibility in magnet technology - from the warmth of Alnico to the precision of Neodymium and the efficiency of Ceramic. Each variant provides a different voice, allowing you to tailor the sonic character to your specific taste and cabinet design.',
    image: '/images/drive-units/concert-collection/gallery/magnet-choice.jpg',
  },
];

// Customer quotes
const customerQuotes = [
  '"I built my first pair of Lowthers in the 80s and they\'re still singing beautifully. I can\'t imagine ever parting with them."',
  '"When I play vinyl through my Lowthers, real instruments, real space, real emotion."',
  '"Every time I switch them on, I\'m reminded why I built them."',
  '"They\'re a lifelong companion. The more I listen, the better they get."',
  '"I\'ve had countless hi-fi systems over the years, but I always come back to my Lowthers. They just make everything else sound ordinary."',
  '"Building them myself was one of the most rewarding projects I\'ve ever done. Every time I listen, I feel proud."',
  '"The Lowthers make my room sound like a live venue. It\'s that open, that natural."',
  '"Even after decades, I still sit back and smile. They sound as fresh today as the day I first wired them up."',
];

export default function ConcertCollectionPage() {
  const { addItem, isLoading: cartLoading } = useCart();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof concertProducts[0] | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const [voiceCoil, setVoiceCoil] = useState<{ [key: string]: string }>({});
  const [impedance, setImpedance] = useState<{ [key: string]: string }>({});
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);

  const { productMap } = useShopifyCollection('the-concert-collection');

  const getDisplayPrice = (product: typeof concertProducts[number]) => {
    const shopifyMatch = productMap.get(product.handle ?? product.id);
    if (shopifyMatch) {
      return formatPrice(
        shopifyMatch.priceRange.minVariantPrice.amount,
        shopifyMatch.priceRange.minVariantPrice.currencyCode,
      );
    }
    return product.price;
  };

  useEffect(() => {
    if (selectedProduct) {
      const match = productMap.get(selectedProduct.handle ?? selectedProduct.id) ?? null;
      setSelectedShopifyProduct(match);
    }
  }, [productMap, selectedProduct]);

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

  const openProductDetail = (product: typeof concertProducts[0]) => {
    setSelectedProduct(product);
    const match = productMap.get(product.handle ?? product.id) ?? null;
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
  const getCurrentVariant = (): ShopifyVariant | undefined => {
    if (!selectedProduct || !selectedShopifyProduct) return undefined;
    return findVariantByOptions(selectedShopifyProduct.variants, {
      'Voice Coil': getVoiceCoil(selectedProduct.id),
      Impedance: getImpedance(selectedProduct.id),
    });
  };
  const handleAddToBag = async () => {
    if (!selectedProduct) return;

    if (selectedShopifyProduct) {
      const variant = getCurrentVariant();
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
  const getOverlayPrice = () => {
    if (selectedShopifyProduct) {
      const variant = getCurrentVariant();
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

  const getTechnicalPdfPath = (productTitle: string): string | null => {
    // Map product titles to their PDF filenames
    const pdfMap: { [key: string]: string } = {
      'PM2A Concert': '/images/drive-units/concert-collection/technical/PM2A Concert.pdf',
      'PM3A Concert': '/images/drive-units/concert-collection/technical/PM3A Concert.pdf',
      'PM4A Concert': '/images/drive-units/concert-collection/technical/PM4A Concert.pdf',
      'PM5A Concert': '/images/drive-units/concert-collection/technical/PM5A Concert.pdf',
      'PM6A Concert': '/images/drive-units/concert-collection/technical/PM6A Concert.pdf',
      'PM7A Concert': '/images/drive-units/concert-collection/technical/PM7A Concert.pdf',
      'DX2 Concert': '/images/drive-units/concert-collection/technical/DX2 Concert.pdf',
      'DX3 Concert': '/images/drive-units/concert-collection/technical/DX3 Concert.pdf',
      'DX4 Concert': '/images/drive-units/concert-collection/technical/DX4 Concert.pdf',
      'EX2 Concert': '/images/drive-units/concert-collection/technical/EX2 Concert.pdf',
      'EX3 Concert': '/images/drive-units/concert-collection/technical/EX3 Concert.pdf',
      'EX4 Concert': '/images/drive-units/concert-collection/technical/EX4 Concert.pdf',
    };
    return pdfMap[productTitle] || null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/drive-units/concert-collection/hero/Concert-Hero1.avif"
          alt="The Concert Collection"
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
            The Concert Collection
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Hand-crafted drive units deliver the legendary immediate and detailed sound that has captivated audiophiles for nearly a century.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Instruments', href: '/products' },
          { label: 'The Concert Collection' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                The Timeless Foundation of Lowther Sound
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded on the pioneering vision of Paul Voigt and O.P. Lowther, this series offers the original Lowther experience - unadorned, uncompromising, and eternally captivating.
                </p>
                <p>
                  Each drive unit is meticulously hand-crafted using our classic paper treatment and traditional metalwork, honed over nine decades in our Norfolk atelier. These instruments capture the legendary Lowther sound: immediate, detailed, and profoundly musical. For discerning home builders who cherish exceptional reproduction without artifice, Concert provides the essential foundation to craft custom acoustic environments that unveil music in its most authentic form.
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
                Encompassing our full spectrum of Alnico, Neodymium, and Ceramic series.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {concertProducts.map((product, index) => {
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
                    From {displayPrice}*
                  </p>
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
            {concertCraftsmanshipContent.map((item, index) => (
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
                Real experiences from Concert Collection owners around the world
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

      {/* Cart Overlay */}
      <CartOverlay isOpen={cartOpen} onClose={() => setCartOpen(false)} />

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
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">CONCERT COLLECTION</p>
                  <h2 className="font-display text-5xl mb-4" style={{ color: '#c59862' }}>
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xl text-gray-900 mb-4">
                    {getOverlayPrice()} <span className="text-sm text-gray-600">per drive unit</span>
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
                  {/* Technical PDF Link */}
                  {getTechnicalPdfPath(selectedProduct.title) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <a
                        href={getTechnicalPdfPath(selectedProduct.title)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#c59862] transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Technical Graphs</span>
                      </a>
                    </div>
                  )}
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

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
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
      <DiscountPopup />
    </div>
  );
}

