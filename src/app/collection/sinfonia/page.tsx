'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { X } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { ProductActionButtons } from '@/components/product-action-buttons';
import {
  getCollectionProducts,
  formatPrice,
  findVariantByOptions,
  type ShopifyProduct,
  type ShopifyVariant,
} from '@/lib/shopify-storefront';

// Product data for Sinfonia Collection drive units (fallback data)
const sinfoniaProducts = [
  {
    id: 'pm2a-sinfonia',
    title: 'PM2A Sinfonia',
    price: '£1,130',
    handle: 'lowther-pm2a-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/PM2A-Sinfonia-transparent.webp',
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
    id: 'pm3a-sinfonia',
    title: 'PM3A Sinfonia',
    price: '£1,485',
    handle: 'lowther-pm3a-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/PM3A-Sinfonia-transparent.webp',
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
    id: 'pm4a-sinfonia',
    title: 'PM4A Sinfonia',
    price: '£1,430',
    handle: 'lowther-pm4a-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/PM4A-Sinfonia-transparent.webp',
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
    id: 'pm5a-sinfonia',
    title: 'PM5A Sinfonia',
    price: '£1,110',
    handle: 'lowther-pm5a-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/PM5A-Sinfonia-transparent.webp',
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
    id: 'pm6a-sinfonia',
    title: 'PM6A Sinfonia',
    price: '£965',
    handle: 'lowther-pm6a-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/PM6A-Sinfonia-transparent.webp',
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
    id: 'pm7a-sinfonia',
    title: 'PM7A Sinfonia',
    price: '£1,085',
    handle: 'lowther-pm7a-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/PM7A-Sinfonia-transparent.webp',
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
    id: 'dx2-sinfonia',
    title: 'DX2 Sinfonia',
    price: '£865',
    handle: 'lowther-dx2-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/DX2-Sinfonia-transparent.webp',
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
    id: 'dx3-sinfonia',
    title: 'DX3 Sinfonia',
    price: '£910',
    handle: 'lowther-dx3-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/DX3-Sinfonia-transparent.webp',
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
    id: 'dx4-sinfonia',
    title: 'DX4 Sinfonia',
    price: '£990',
    handle: 'lowther-dx4-sinfonia',
    image: '/images/drive-units/sinfonia-collection/gallery/DX4-Sinfonia-transparent.webp',
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
  { src: '/images/drive-units/sinfonia-collection/gallery/Sinfonia-PM4A.avif', alt: 'Sinfonia PM4A drive unit' },
  { src: '/images/drive-units/sinfonia-collection/gallery/PM4A-sinfonia-back-close-up.avif', alt: 'PM4A Sinfonia back close-up' },
  { src: '/images/drive-units/sinfonia-collection/gallery/DX3-Sinfonia-resting-on-its-side.avif', alt: 'DX3 Sinfonia resting on its side' },
];

// Video for Sinfonia Collection
const sinfoniaVideo = {
  youtubeUrl: 'https://youtu.be/fEAAXK5j-SE?si=m4gCEwm1W1FYYELB',
  thumbnail: '/images/drive-units/sinfonia-collection/gallery/Sinfonia-PM4A.avif',
  title: 'Refined Harmony in Every Note',
};

// Generic Handcrafted in Great Britain content (same as Philharmonic and Concert)
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

// Speaker-specific craftsmanship content for Sinfonia Collection
const sinfoniaCraftsmanshipContent = [
  {
    title: 'Enhanced Diaphragm',
    description: 'The Sinfonia Collection introduces a newly developed premium diaphragm that represents a significant advancement in cone technology. Enhanced structural integrity and refined resonance characteristics deliver noticeable improvements in clarity and resolution across the entire frequency spectrum.',
    image: '/images/drive-units/sinfonia-collection/gallery/Sinfonia-PM4A.avif',
  },
  {
    title: 'Refined Paper Treatment',
    description: 'Building on nine decades of expertise, the Sinfonia features an evolved paper treatment process that enhances transient response and tonal accuracy. This proprietary refinement maintains the warmth and musicality of traditional Lowther sound while unveiling new layers of detail.',
    image: '/images/drive-units/sinfonia-collection/gallery/PM4A-sinfonia-back-close-up.avif',
  },
  {
    title: 'Precision Engineering',
    description: 'Every Sinfonia drive unit benefits from the latest advances in precision manufacturing while maintaining our commitment to hand assembly. The result is exceptional consistency and performance that honours our heritage while embracing innovation.',
    image: '/images/drive-units/sinfonia-collection/gallery/DX3-Sinfonia-resting-on-its-side.avif',
  },
];

export default function SinfoniaPage() {
  const { addItem, isLoading: cartLoading } = useCart();
  const { currency, region } = useCurrency();
  
  // Shopify products (optional enhancement)
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [shopifyLoaded, setShopifyLoaded] = useState(false);
  
  // State for product detail overlay
  const [selectedProduct, setSelectedProduct] = useState<typeof sinfoniaProducts[0] | null>(null);
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  
  // State for product options (per product ID)
  const [voiceCoil, setVoiceCoil] = useState<Record<string, string>>({});
  const [impedance, setImpedance] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  
  // State for gallery
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // State for video overlay
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Try to fetch Shopify products (enhancement, not required)
  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        const products = await getCollectionProducts('the-symphonic-collection', currency, region);
        if (products.length > 0) {
          setShopifyProducts(products);
          setShopifyLoaded(true);
        }
      } catch (error) {
        console.log('Shopify products not available, using fallback data');
        setShopifyLoaded(false);
      }
    };

    fetchShopifyProducts();
  }, [currency, region]);

  // Helper functions for product options
  const getVoiceCoil = (productId: string) => voiceCoil[productId] || 'Aluminium';
  const getImpedance = (productId: string) => impedance[productId] || '8 Ohms';
  const getProductQuantity = (productId: string) => quantity[productId] || 1;

  const handleQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity({ ...quantity, [productId]: numValue });
    }
  };

  // Get current variant and price from Shopify if available
  const getCurrentVariant = (shopifyProduct: ShopifyProduct | null): ShopifyVariant | undefined => {
    if (!shopifyProduct || !selectedProduct) return undefined;
    return findVariantByOptions(shopifyProduct.variants, {
      'Voice Coil': getVoiceCoil(selectedProduct.id),
      'Impedance': getImpedance(selectedProduct.id),
    });
  };

  const getCurrentPrice = (): string => {
    if (selectedShopifyProduct && selectedProduct) {
      const variant = getCurrentVariant(selectedShopifyProduct);
      if (variant) {
        return formatPrice(variant.price.amount, variant.price.currencyCode);
      }
    }
    return selectedProduct?.price || '';
  };

  // Handle add to bag (with Shopify if available)
  const handleAddToBag = async () => {
    if (!selectedProduct) return;

    if (selectedShopifyProduct) {
      const variant = getCurrentVariant(selectedShopifyProduct);
      if (!variant) {
        alert('Please select product options');
        return;
      }

      if (!variant.availableForSale) {
        alert('This product is currently unavailable');
        return;
      }

      await addItem(variant.id, getProductQuantity(selectedProduct.id));
      alert(`Added ${getProductQuantity(selectedProduct.id)}x ${selectedProduct.title} to your bag!`);
      closeProductDetail();
    } else {
      // Fallback: redirect to external shop
      window.open(process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.lowtherloudspeakers.com', '_blank');
    }
  };

  // Product detail overlay functions
  const openProductDetail = (product: typeof sinfoniaProducts[0]) => {
    setSelectedProduct(product);
    
    // Try to find matching Shopify product
    if (shopifyLoaded) {
      const shopifyMatch = shopifyProducts.find(sp => sp.handle === product.handle);
      setSelectedShopifyProduct(shopifyMatch || null);
    }
    
    setIsProductOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductDetail = () => {
    setIsProductOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setSelectedShopifyProduct(null);
      document.body.style.overflow = '';
    }, 700);
  };

  // Video functions
  const openVideo = () => {
    setIsVideoOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    document.body.style.overflow = '';
  };

  // Gallery functions
  const openGallery = (index: number) => {
    setSelectedImage(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  const navigateGallery = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/drive-units/sinfonia-collection/hero/Sinfonia-hero1.avif"
          alt="The Sinfonia Collection"
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
          
          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            The Sinfonia Collection
          </h1>
          
          <p className="text-xl leading-relaxed">
            Elevate your speakers with the Sinfonia Collection. Featuring enhanced diaphragms, refined paper treatment, and improved clarity across the spectrum.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Instruments', href: '/products' },
          { label: 'The Sinfonia Collection' },
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                Refined Harmony in Every Note
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Drawing from the visionary designs of Paul Voigt and O.P. Lowther, the Sinfonia elevates our full-range philosophy with a newly developed premium diaphragm. Enhanced cone structures, refined spiders, and a proprietary paper treatment process harmonise to deliver noticeable refinements in clarity, resolution, and tonal accuracy. Yet, the soul of Lowther remains unaltered: that timeless, authentic sound which reveals music's deepest truths.
                </p>
                <p>
                  These instruments integrate seamlessly into custom designs, providing a significant leap in performance - from crystal clear transient response to precise sound-stage imaging. Experience the warmth of natural materials, the precision of hand-wound voice coils, and the enduring legacy of Lowther.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Video Section */}
      <section data-surface="light" className="py-12 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div 
              className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer group"
              onClick={openVideo}
            >
              <Image
                src={sinfoniaVideo.thumbnail}
                alt={sinfoniaVideo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Video Overlay */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeVideo}
        >
          <button
            onClick={closeVideo}
            className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-[90vw] h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${sinfoniaVideo.youtubeUrl.split('youtu.be/')[1]?.split('?')[0]}`}
              title={sinfoniaVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Gallery Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Gallery
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
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
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Explore the Collection
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Encompassing our full spectrum of Alnico and Neodymium series with Sinfonia refinements.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {sinfoniaProducts.map((product, index) => {
              // Find matching Shopify product for live pricing
              const shopifyMatch = shopifyLoaded ? shopifyProducts.find(sp => sp.handle === product.handle) : null;
              const displayPrice = shopifyMatch 
                ? formatPrice(shopifyMatch.priceRange.minVariantPrice.amount, shopifyMatch.priceRange.minVariantPrice.currencyCode)
                : product.price;

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
      <section data-surface="light" className="py-24 bg-white">
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
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                The Details That Define the Collection
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {sinfoniaCraftsmanshipContent.map((item, index) => (
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

      {/* Lowther for Life Section */}
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
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">SINFONIA COLLECTION</p>
                  <h2 className="font-display text-5xl mb-4" style={{ color: '#c59862' }}>
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xl text-gray-900 mb-2">
                    {getCurrentPrice()} <span className="text-sm text-gray-600">per drive unit</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-8">
                    VAT excluded
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

                {/* Product Options (only if Shopify is available) */}
                {selectedShopifyProduct && (
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
                )}

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
